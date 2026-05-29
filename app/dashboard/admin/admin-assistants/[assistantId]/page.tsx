'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Activity, Users, CheckCircle2, User, UserCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Avatar, Button, Modal } from '@/components/ui';
import { apiRequest } from '@/lib/api';
import TriageChatWorkspace from '@/components/TriageChatWorkspace';

type AssistantStats = {
    total_claimed: number;
    completed: number;
    unique_patients: number;
    assigned_doctors_count: number;
};

type PatientWorkedWith = {
    patient_id: string;
    email: string;
    name: string;
    care_status: string;
    requests_handled: number;
    last_request_at: string;
};

type AssistantHistoryResponse = {
    stats: AssistantStats;
    patients: PatientWorkedWith[];
};

export default function AssistantHistoryPage() {
    const params = useParams();
    const router = useRouter();
    const assistantId = params.assistantId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState<AssistantHistoryResponse | null>(null);
    const [assistantName, setAssistantName] = useState('Assistant');
    
    // Chat Monitor Modal
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [careRequestId, setCareRequestId] = useState<string | null>(null);
    const [isChatLoading, setIsChatLoading] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const [histRes, detRes] = await Promise.all([
                    apiRequest<AssistantHistoryResponse>(`/admin/assistants/${assistantId}/history`),
                    apiRequest<{ email: string }>(`/admin/assistants/${assistantId}`)
                ]);
                if (histRes.success && histRes.data) setHistory(histRes.data);
                if (detRes.success && detRes.data) setAssistantName(detRes.data.email.split('@')[0]);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [assistantId]);

    const handleMonitorPatient = async (patientId: string) => {
        setSelectedPatientId(patientId);
        setIsChatLoading(true);
        try {
            const res = await apiRequest<{ conversations: { care_request_id: string }[] }>(`/triage/conversations?patient_id=${patientId}&limit=1`);
            if (res.success && res.data && res.data.conversations.length > 0) {
                setCareRequestId(res.data.conversations[0].care_request_id);
            } else {
                setCareRequestId(null);
                alert('No active or recent chat thread found for this patient.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsChatLoading(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout role="admin">
                <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-500">Loading history...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground capitalize">{assistantName}'s Activity</h2>
                        <p className="text-gray-600">Global statistics and patient history</p>
                    </div>
                </div>

                {/* Stats */}
                {history && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Activity className="w-4 h-4" />
                                <span className="text-sm font-medium">Claimed Requests</span>
                            </div>
                            <span className="text-3xl font-bold text-primary">{history.stats.total_claimed}</span>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-500">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Completed</span>
                            </div>
                            <span className="text-3xl font-bold text-green-600">{history.stats.completed}</span>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">Unique Patients</span>
                            </div>
                            <span className="text-3xl font-bold text-blue-600">{history.stats.unique_patients}</span>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-500">
                                <User className="w-4 h-4" />
                                <span className="text-sm font-medium">Assigned Doctors</span>
                            </div>
                            <span className="text-3xl font-bold text-purple-600">{history.stats.assigned_doctors_count}</span>
                        </div>
                    </div>
                )}

                {/* Patients Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-foreground">Patients History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3">Care Status</th>
                                    <th className="px-6 py-3">Requests Handled</th>
                                    <th className="px-6 py-3">Last Request</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history?.patients.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No patient history found.
                                        </td>
                                    </tr>
                                )}
                                {history?.patients.map(p => (
                                    <tr key={p.patient_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={p.name} />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{p.name}</p>
                                                    <p className="text-xs text-gray-500">{p.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                                                {p.care_status?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {p.requests_handled}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(p.last_request_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Button size="sm" variant="outline" onClick={() => handleMonitorPatient(p.patient_id)}>
                                                Monitor Chat
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Chat Monitor Modal */}
            <Modal isOpen={!!selectedPatientId} onClose={() => { setSelectedPatientId(null); setCareRequestId(null); }} title="Patient Chat History" size="xl">
                <div className="h-[600px] flex flex-col bg-gray-50 rounded-b-2xl overflow-hidden">
                    {isChatLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-gray-500">Loading chat thread...</p>
                        </div>
                    ) : careRequestId ? (
                        <TriageChatWorkspace role="admin" initialCareRequestId={careRequestId} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-gray-500">No chat history available to display.</p>
                        </div>
                    )}
                </div>
            </Modal>
        </DashboardLayout>
    );
}
