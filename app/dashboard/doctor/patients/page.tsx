'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailPlus, RefreshCcw, Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Avatar, Badge, Button, Modal } from '@/components/ui';
import { apiRequest } from '@/lib/api';
import { getSession, hasRole } from '@/lib/auth';

type PatientInvite = {
    invite_id: string;
    email: string;
    doctor_id?: string;
    patient_id?: string;
    status: 'pending' | 'accepted' | 'declined' | 'revoked' | 'expired';
    expires_at: string;
    used_at?: string;
    declined_at?: string;
    created_at: string;
    is_expired: boolean;
};

type PatientInviteResponse = {
    invites: PatientInvite[];
    total: number;
};

type AssistantPatientResponse = {
    patients: Array<{
        patient_id: string;
        name: string;
        email: string;
        status: string;
        tier: string;
        created_at: string;
        updated_at: string;
    }>;
    total: number;
};

const inviteStatusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    revoked: 'bg-gray-100 text-gray-700',
    expired: 'bg-gray-100 text-gray-500',
};

function formatNameFromEmail(email: string) {
    const local = email.split('@')[0] || email;
    return local
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function DoctorPatients() {
    const router = useRouter();
    const [invites, setInvites] = useState<PatientInvite[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [form, setForm] = useState({
        email: '',
        note: '',
    });
    const [isAssistantAccount, setIsAssistantAccount] = useState(false);

    useEffect(() => {
        if (!hasRole('doctor')) {
            router.push('/auth/login');
            return;
        }

        loadInvites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const loadInvites = async () => {
        const session = getSession();
        if (!session) {
            router.push('/auth/login');
            return;
        }

        setIsLoading(true);
        setNotice(null);

        try {
            if (session.user.role === 'assistant') {
                setIsAssistantAccount(true);
                const response = await apiRequest<AssistantPatientResponse>('/assistant/patients', {
                    token: session.access_token,
                });
                setInvites((response.data?.patients || []).map((patient) => ({
                    invite_id: patient.patient_id,
                    email: patient.email,
                    patient_id: patient.patient_id,
                    status: patient.status === 'active' ? 'accepted' : 'pending',
                    expires_at: patient.updated_at || patient.created_at,
                    created_at: patient.created_at,
                    is_expired: false,
                })));
                return;
            }

            const response = await apiRequest<PatientInviteResponse>('/doctor/patient-invites', {
                token: session.access_token,
            });
            setInvites(response.data?.invites || []);
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to load patient invites.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredInvites = useMemo(() => {
        return invites.filter((invite) => {
            const matchesSearch = !search.trim() || invite.email.toLowerCase().includes(search.trim().toLowerCase());
            const matchesStatus = statusFilter === 'all' || invite.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [invites, search, statusFilter]);

    const stats = useMemo(() => ({
        total: invites.length,
        pending: invites.filter((invite) => invite.status === 'pending').length,
        accepted: invites.filter((invite) => invite.status === 'accepted').length,
        expired: invites.filter((invite) => invite.status === 'expired' || invite.is_expired).length,
    }), [invites]);

    const sendInvite = async (event: React.FormEvent) => {
        event.preventDefault();
        const session = getSession();
        if (!session) {
            router.push('/auth/login');
            return;
        }

        setIsSending(true);
        setNotice(null);

        try {
            const response = await apiRequest<{ message: string }>('/doctor/patient-invites', {
                method: 'POST',
                token: session.access_token,
                body: JSON.stringify({
                    email: form.email.trim().toLowerCase(),
                    ...(form.note.trim() ? { note: form.note.trim() } : {}),
                }),
            });

            setNotice({
                type: 'success',
                message: response.data?.message || 'Patient invite sent successfully.',
            });
            setForm({ email: '', note: '' });
            setIsInviteOpen(false);
            await loadInvites();
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to send patient invite.',
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <DashboardLayout role="doctor">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#4a3428]">{isAssistantAccount ? 'Assigned Patients' : 'My Patients'}</h2>
                        <p className="text-gray-600">
                            {isAssistantAccount ? 'Patients visible through assigned Doctor relationships.' : 'Invite patients by email and track onboarding status.'}
                        </p>
                    </div>
                    {!isAssistantAccount && (
                        <Button
                            className="rounded-full"
                            onClick={() => setIsInviteOpen(true)}
                            leftIcon={<MailPlus className="h-5 w-5" />}
                        >
                            Invite Patient
                        </Button>
                    )}
                </div>

                {notice && (
                    <div className={`rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {notice.message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <Stat label={isAssistantAccount ? 'Visible Patients' : 'Total Invites'} value={isLoading ? '...' : stats.total} />
                    <Stat label="Pending" value={isLoading ? '...' : stats.pending} tone="yellow" />
                    <Stat label={isAssistantAccount ? 'Active' : 'Accepted'} value={isLoading ? '...' : stats.accepted} tone="green" />
                    <Stat label="Expired" value={isLoading ? '...' : stats.expired} tone="gray" />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={isAssistantAccount ? 'Search patient email...' : 'Search invite email...'}
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-[#E67E3C]"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#E67E3C]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="declined">Declined</option>
                                <option value="expired">Expired</option>
                            </select>
                            <Button variant="outline" size="sm" onClick={loadInvites} leftIcon={<RefreshCcw className="h-4 w-4" />}>
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Sent</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Expires</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            Loading patients...
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && filteredInvites.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No patients found.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && filteredInvites.map((invite) => (
                                    <tr key={invite.invite_id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={invite.email} />
                                                <div>
                                                    <p className="font-medium text-[#4a3428]">{formatNameFromEmail(invite.email)}</p>
                                                    <p className="text-sm text-gray-600">{invite.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${inviteStatusStyles[invite.status] || inviteStatusStyles.pending}`}>
                                                {invite.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">{new Date(invite.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-gray-600">{new Date(invite.expires_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-gray-600">
                                            {invite.used_at ? new Date(invite.used_at).toLocaleDateString() : invite.declined_at ? new Date(invite.declined_at).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {!isAssistantAccount && <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Patient" size="lg">
                    <form onSubmit={sendInvite} className="space-y-5 p-6">
                        <div className="rounded-xl bg-[#fef3e8] px-4 py-3 text-sm text-gray-700">
                            The patient will receive a secure one-time invite link by email. New patients can complete registration from the link; existing patients can accept the invite inside the app.
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Patient Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                                placeholder="patient@example.com"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-[#E67E3C]"
                            />
                        </div>

                        <div>
                            <label htmlFor="note" className="mb-2 block text-sm font-medium text-gray-700">Message to Patient (optional)</label>
                            <textarea
                                id="note"
                                rows={4}
                                value={form.note}
                                onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                                placeholder="Add a short note for the invitation email."
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-[#E67E3C]"
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                            <Button type="button" variant="secondary" onClick={() => setIsInviteOpen(false)} disabled={isSending}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isSending} leftIcon={<MailPlus className="h-5 w-5" />}>
                                Send Invite
                            </Button>
                        </div>
                    </form>
                </Modal>}
            </div>
        </DashboardLayout>
    );
}

function Stat({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'green' | 'yellow' | 'gray' }) {
    const color = tone === 'green' ? 'text-green-600' : tone === 'yellow' ? 'text-yellow-600' : tone === 'gray' ? 'text-gray-500' : 'text-[#4a3428]';

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
    );
}
