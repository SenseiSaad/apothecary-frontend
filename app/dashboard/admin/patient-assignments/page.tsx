'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw, Search, Stethoscope, UserCheck, Eye } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Avatar, Button, Modal } from '@/components/ui';
import { apiRequest } from '@/lib/api';
import { getSession, hasRole } from '@/lib/auth';
import TriageChatWorkspace from '@/components/TriageChatWorkspace';

type CareStatus = 'needs_care' | 'assigned' | 'in_treatment' | 'treated' | 'inactive';

type AssignablePatient = {
    patient_id: string;
    user_id?: string;
    email?: string;
    name: string;
    status?: string;
    tier?: string;
    doctor_id?: string | null;
    care_status: CareStatus;
    illness_description?: string;
    care_status_updated_at?: string;
    doctor_assigned_at?: string;
    onboarding_source?: string;
    created_at: string;
    updated_at: string;
};

type PatientsResponse = {
    patients: AssignablePatient[];
    pagination: { total: number; page: number; limit: number; total_pages: number; has_next: boolean; has_prev: boolean };
};

type DoctorOption = {
    doctor_id: string;
    email: string;
    status: string;
    specialty?: string;
    max_patients: number;
    credential_status: string;
};

type DoctorsResponse = {
    Doctors: DoctorOption[];
};

const careLabels: Record<string, string> = {
    needs_care: 'Needs care',
    assigned: 'Assigned',
    in_treatment: 'In treatment',
    treated: 'Treated',
    inactive: 'Inactive',
};

const careStyles: Record<string, string> = {
    needs_care: 'bg-amber-100 text-amber-800',
    assigned: 'bg-green-100 text-green-700',
    in_treatment: 'bg-blue-100 text-blue-700',
    treated: 'bg-gray-100 text-gray-600',
    inactive: 'bg-gray-100 text-gray-500',
};

function nameFromEmail(email = '') {
    return email.split('@')[0].split(/[._-]+/).filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') || 'Patient';
}

export default function AdminPatientAssignments() {
    const router = useRouter();
    const [patients, setPatients] = useState<AssignablePatient[]>([]);
    const [doctors, setDoctors] = useState<DoctorOption[]>([]);
    const [search, setSearch] = useState('');
    const [careStatus, setCareStatus] = useState<'active' | CareStatus>('active');
    const [assignedFilter, setAssignedFilter] = useState<'all' | 'unassigned' | 'assigned'>('unassigned');
    const [isLoading, setIsLoading] = useState(true);
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<AssignablePatient | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [forceReassign, setForceReassign] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);

    // Monitor State
    const [selectedMonitorPatient, setSelectedMonitorPatient] = useState<AssignablePatient | null>(null);
    const [monitorCareRequestId, setMonitorCareRequestId] = useState<string | null>(null);
    const [isMonitorLoading, setIsMonitorLoading] = useState(false);

    useEffect(() => {
        if (!hasRole('admin')) {
            router.push('/auth/login');
            return;
        }

        void loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const loadData = async () => {
        const session = getSession();
        if (!session) {
            router.push('/auth/login');
            return;
        }

        setIsLoading(true);
        setNotice(null);

        try {
            const params = new URLSearchParams({
                page: '1',
                limit: '200',
            });

            if (search.trim()) {
                params.set('search', search.trim());
            }
            if (careStatus !== 'active') {
                params.set('care_status', careStatus);
            }
            if (assignedFilter === 'assigned') {
                params.set('assigned', 'true');
            }
            if (assignedFilter === 'unassigned') {
                params.set('assigned', 'false');
            }

            const [patientRes, doctorRes] = await Promise.all([
                apiRequest<PatientsResponse>(`/admin/patients/assignable?${params.toString()}`, { token: session.access_token }),
                apiRequest<DoctorsResponse>('/admin/doctors/active?page=1&limit=500&credential_status=verified', { token: session.access_token }),
            ]);

            setPatients(patientRes.data?.patients || []);
            setDoctors((doctorRes.data?.Doctors || []).filter(doctor => doctor.status === 'active' && doctor.credential_status === 'verified'));
        } catch (error) {
            setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load patient assignments.' });
        } finally {
            setIsLoading(false);
        }
    };

    const openAssign = (patient: AssignablePatient) => {
        setSelectedPatient(patient);
        setSelectedDoctorId(patient.doctor_id || '');
        setForceReassign(Boolean(patient.doctor_id));
    };

    const assignPatient = async (event: React.FormEvent) => {
        event.preventDefault();
        const session = getSession();
        if (!session || !selectedPatient || !selectedDoctorId) {
            return;
        }

        setIsAssigning(true);
        setNotice(null);

        try {
            const response = await apiRequest<{ message: string }>(`/admin/patients/${selectedPatient.patient_id}/assign-doctor`, {
                method: 'POST',
                token: session.access_token,
                body: JSON.stringify({
                    doctor_id: selectedDoctorId,
                    force: forceReassign,
                }),
            });

            setNotice({ type: 'success', message: response.data?.message || 'Patient assigned successfully.' });
            setSelectedPatient(null);
            await loadData();
        } catch (error) {
            setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Unable to assign patient.' });
        } finally {
            setIsAssigning(false);
        }
    };

    const unassignPatient = async (patient: AssignablePatient) => {
        const session = getSession();
        if (!session) {
            return;
        }

        setNotice(null);

        try {
            const response = await apiRequest<{ message: string }>(`/admin/patients/${patient.patient_id}/doctor`, {
                method: 'DELETE',
                token: session.access_token,
            });

            setNotice({ type: 'success', message: response.data?.message || 'Patient unassigned.' });
            await loadData();
        } catch (error) {
            setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Unable to unassign patient.' });
        }
    };

    const handleMonitor = async (patient: AssignablePatient) => {
        setSelectedMonitorPatient(patient);
        setIsMonitorLoading(true);
        try {
            const session = getSession();
            const res = await apiRequest<{ conversations: { care_request_id: string }[] }>(`/triage/conversations?patient_id=${patient.patient_id}&limit=1`, { token: session?.access_token });
            if (res.success && res.data && res.data.conversations.length > 0) {
                setMonitorCareRequestId(res.data.conversations[0].care_request_id);
            } else {
                setMonitorCareRequestId(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsMonitorLoading(false);
        }
    };

    const stats = useMemo(() => ({
        total: patients.length,
        unassigned: patients.filter(patient => !patient.doctor_id).length,
        assigned: patients.filter(patient => Boolean(patient.doctor_id)).length,
        needsCare: patients.filter(patient => patient.care_status === 'needs_care').length,
    }), [patients]);

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Patient Assignment</h2>
                        <p className="text-gray-600">Assign patients who need care to verified available Doctors.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadData} leftIcon={<RefreshCcw className="h-4 w-4" />}>
                        Refresh
                    </Button>
                </div>

                {notice && (
                    <div className={`rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {notice.message}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Stat label="Showing" value={isLoading ? '...' : stats.total} />
                    <Stat label="Unassigned" value={isLoading ? '...' : stats.unassigned} tone="amber" />
                    <Stat label="Assigned" value={isLoading ? '...' : stats.assigned} tone="green" />
                    <Stat label="Needs Care" value={isLoading ? '...' : stats.needsCare} tone="blue" />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === 'Enter') {
                                        void loadData();
                                    }
                                }}
                                placeholder="Search patient, email, or illness..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <select
                            value={assignedFilter}
                            onChange={event => setAssignedFilter(event.target.value as 'all' | 'unassigned' | 'assigned')}
                            className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                        >
                            <option value="unassigned">Unassigned</option>
                            <option value="assigned">Assigned</option>
                            <option value="all">All</option>
                        </select>
                        <select
                            value={careStatus}
                            onChange={event => setCareStatus(event.target.value as 'active' | CareStatus)}
                            className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                        >
                            <option value="active">Active care</option>
                            <option value="needs_care">Needs care</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_treatment">In treatment</option>
                            <option value="treated">Treated</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <Button size="sm" onClick={loadData} leftIcon={<Search className="h-4 w-4" />}>
                            Apply
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Care Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Illness</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Doctor</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-gray-500">Loading patients...</td>
                                    </tr>
                                )}
                                {!isLoading && patients.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-gray-500">No matching patients found.</td>
                                    </tr>
                                )}
                                {!isLoading && patients.map(patient => (
                                    <tr key={patient.patient_id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={patient.name || patient.email || 'Patient'} />
                                                <div>
                                                    <p className="font-medium text-foreground">{patient.name || nameFromEmail(patient.email)}</p>
                                                    <p className="text-sm text-gray-600">{patient.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${careStyles[patient.care_status] || careStyles.needs_care}`}>
                                                {careLabels[patient.care_status] || patient.care_status}
                                            </span>
                                        </td>
                                        <td className="max-w-xs px-4 py-4 text-sm text-gray-600">
                                            <p className="line-clamp-2">{patient.illness_description || '-'}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {patient.doctor_id ? 'Assigned' : 'Unassigned'}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <Button size="sm" variant="outline" onClick={() => openAssign(patient)} leftIcon={<UserCheck className="h-4 w-4" />}>
                                                    {patient.doctor_id ? 'Change' : 'Assign'}
                                                </Button>
                                                {patient.doctor_id && (
                                                    <Button size="sm" variant="ghost" onClick={() => void unassignPatient(patient)}>
                                                        Unassign
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="secondary" onClick={() => handleMonitor(patient)} leftIcon={<Eye className="h-4 w-4" />}>
                                                    Monitor
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={Boolean(selectedPatient)} onClose={() => setSelectedPatient(null)} title="Assign Patient" size="lg">
                {selectedPatient && (
                    <form onSubmit={assignPatient} className="space-y-5 p-6">
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="font-semibold text-foreground">{selectedPatient.name || nameFromEmail(selectedPatient.email)}</p>
                            <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                            <p className="mt-2 text-sm text-gray-600">{selectedPatient.illness_description || 'No illness details provided.'}</p>
                        </div>

                        <div>
                            <label htmlFor="doctor_id" className="mb-2 block text-sm font-medium text-gray-700">Doctor</label>
                            <select
                                id="doctor_id"
                                required
                                value={selectedDoctorId}
                                onChange={event => setSelectedDoctorId(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select a verified Doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                        {nameFromEmail(doctor.email)} - {doctor.specialty || 'General'} - max {doctor.max_patients}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedPatient.doctor_id && (
                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={forceReassign}
                                    onChange={event => setForceReassign(event.target.checked)}
                                    className="h-4 w-4 rounded accent-[var(--primary)]"
                                />
                                <span className="text-sm text-amber-800">Confirm reassignment from the current Doctor</span>
                            </label>
                        )}

                        {doctors.length === 0 && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                No active verified Doctors are available for assignment.
                            </div>
                        )}

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                            <Button type="button" variant="secondary" onClick={() => setSelectedPatient(null)} disabled={isAssigning}>Cancel</Button>
                            <Button type="submit" isLoading={isAssigning} disabled={!selectedDoctorId || doctors.length === 0} leftIcon={<Stethoscope className="h-5 w-5" />}>
                                Save Assignment
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Monitor Modal */}
            <Modal isOpen={Boolean(selectedMonitorPatient)} onClose={() => { setSelectedMonitorPatient(null); setMonitorCareRequestId(null); }} title="Monitor Care Request" size="xl">
                {selectedMonitorPatient && (
                    <div className="h-[600px] flex flex-col bg-gray-50 rounded-b-2xl overflow-hidden">
                        <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-foreground">{selectedMonitorPatient.name || nameFromEmail(selectedMonitorPatient.email)}</p>
                                <p className="text-sm text-gray-500">Status: {careLabels[selectedMonitorPatient.care_status] || selectedMonitorPatient.care_status}</p>
                            </div>
                            {selectedMonitorPatient.doctor_id && (
                                <Button size="sm" variant="outline" onClick={() => { setSelectedMonitorPatient(null); void unassignPatient(selectedMonitorPatient); }}>Unassign Doctor</Button>
                            )}
                        </div>
                        {isMonitorLoading ? (
                            <div className="flex-1 flex items-center justify-center"><p className="text-gray-500">Loading chat...</p></div>
                        ) : monitorCareRequestId ? (
                            <TriageChatWorkspace role="admin" initialCareRequestId={monitorCareRequestId} />
                        ) : (
                            <div className="flex-1 flex items-center justify-center"><p className="text-gray-500">No chat history available.</p></div>
                        )}
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}

function Stat({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'green' | 'amber' | 'blue' }) {
    const color = tone === 'green' ? 'text-green-600' : tone === 'amber' ? 'text-amber-600' : tone === 'blue' ? 'text-blue-600' : 'text-foreground';

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
    );
}
