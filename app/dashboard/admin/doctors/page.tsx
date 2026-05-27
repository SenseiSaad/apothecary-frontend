'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, Plus, RefreshCcw, Search, ShieldCheck, UserRoundPlus, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button, Checkbox, Input, Modal } from '@/components/ui';
import { apiRequest } from '@/lib/api';
import { getSession, hasRole } from '@/lib/auth';

type Assistant = {
    doctor_id: string;
    user_id: string;
    email: string;
    status: string;
    email_verified: boolean;
    otp_required: boolean;
    must_change_password: boolean;
    specialty?: string;
    max_patients: number;
    can_onboard_assistants?: boolean;
    max_assistants?: number;
    credential_status: 'pending' | 'verified' | 'rejected';
    credential_notes?: string;
    created_at: string;
    updated_at: string;
};

type AssistantsResponse = {
    Doctors: Assistant[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
};

type CreateAssistantResponse = {
    message: string;
    user: {
        email: string;
        role: string;
        status: string;
        must_change_password: boolean;
    };
    Doctor: {
        doctor_id: string;
        specialty?: string;
        max_patients: number;
        can_onboard_assistants?: boolean;
        max_assistants?: number;
        credential_status: string;
    };
    setup_required: boolean;
    setup_link_sent: boolean;
};

type DoctorDetails = {
    doctor_id: string;
    user: {
        user_id: string;
        email: string;
        role: string;
        status: string;
        email_verified: boolean;
        otp_required: boolean;
        must_change_password: boolean;
        created_at: string;
        updated_at: string;
    };
    credentials: {
        license_number: string;
        specialty?: string;
        max_patients: number;
        can_onboard_assistants?: boolean;
        max_assistants?: number;
        credential_status: 'pending' | 'verified' | 'rejected';
        credential_notes?: string;
    };
    personal_info?: {
        full_name?: string;
        phone_number?: string;
        timezone?: string;
        profile_photo_url?: string;
    } | null;
    professional_info?: {
        bio?: string;
        credentials?: string[];
        years_experience?: number;
        session_modalities?: string[];
    } | null;
    availability?: Array<{
        day_of_week: number;
        start_time: string;
        end_time: string;
        timezone?: string;
        video_link?: string;
        is_available?: boolean;
    }>;
    created_at: string;
    updated_at: string;
};

const initialForm = {
    email: '',
    license_number: '',
    specialty: '',
    max_patients: '20',
    can_onboard_assistants: false,
    max_assistants: '5',
    credential_status: 'pending' as 'pending' | 'verified',
    credential_notes: '',
    otp_required: false,
};

function formatNameFromEmail(email: string) {
    const local = email.split('@')[0] || email;
    return local
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function getInitial(email: string) {
    return (email.trim()[0] || 'T').toUpperCase();
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminAssistants() {
    const router = useRouter();
    const [Assistants, setAssistants] = useState<Assistant[]>([]);
    const [search, setSearch] = useState('');
    const [credentialStatus, setCredentialStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [resendingId, setResendingId] = useState<string | null>(null);
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [modalNotice, setModalNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [form, setForm] = useState(initialForm);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetails | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');

    const loadAssistants = async () => {
        const activeSession = getSession();
        if (!activeSession) return;

        setIsLoading(true);
        setNotice(null);

        try {
            const params = new URLSearchParams({ page: '1', limit: '100' });
            if (search.trim()) params.set('search', search.trim());
            if (credentialStatus !== 'all') params.set('credential_status', credentialStatus);

            const response = await apiRequest<AssistantsResponse>(`/admin/doctors/active?${params.toString()}`, {
                token: activeSession.access_token,
            });

            setAssistants(response.data?.Doctors || []);
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to load Doctors.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!hasRole('admin')) {
            router.push('/auth/login');
            return;
        }

        loadAssistants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, search, credentialStatus]);

    const stats = useMemo(() => {
        const active = Assistants.filter((Assistant) => Assistant.status === 'active').length;
        const pending = Assistants.filter((Assistant) => Assistant.credential_status === 'pending').length;
        const blocked = Assistants.filter((Assistant) => Assistant.status === 'blocked' || Assistant.status === 'suspended' || Assistant.status === 'deactivated').length;

        return {
            total: Assistants.length,
            active,
            pending,
            blocked,
        };
    }, [Assistants]);

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = event.target;
        const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
        setForm((current) => ({
            ...current,
            [target.name]: value,
        }));
    };

    const closeModal = () => {
        if (isCreating) return;
        setIsModalOpen(false);
        setModalNotice(null);
        setForm(initialForm);
    };

    const createAssistant = async (event: React.FormEvent) => {
        event.preventDefault();
        setNotice(null);
        setModalNotice(null);

        const activeSession = getSession();
        if (!activeSession) {
            router.push('/auth/login');
            return;
        }

        const existingAssistant = Assistants.find(
            (Assistant) => Assistant.email.toLowerCase() === form.email.trim().toLowerCase()
        );

        if (existingAssistant) {
            setModalNotice({
                type: 'error',
                message: `A Doctor account already exists for ${existingAssistant.email}. Current status: ${existingAssistant.status}.`,
            });
            return;
        }

        setIsCreating(true);

        try {
            const payload = {
                email: form.email.trim().toLowerCase(),
                ...(form.license_number.trim() ? { license_number: form.license_number.trim() } : {}),
                ...(form.specialty.trim() ? { specialty: form.specialty.trim() } : {}),
                max_patients: Number(form.max_patients || 20),
                can_onboard_assistants: form.can_onboard_assistants,
                max_assistants: Number(form.max_assistants || 5),
                credential_status: form.credential_status,
                ...(form.credential_notes.trim() ? { credential_notes: form.credential_notes.trim() } : {}),
                otp_required: form.otp_required,
            };

            const response = await apiRequest<CreateAssistantResponse>('/admin/doctors', {
                method: 'POST',
                token: activeSession.access_token,
                body: JSON.stringify(payload),
            });

            setNotice({
                type: 'success',
                message: response.data?.message || 'Doctor invited. A setup link and OTP were emailed.',
            });
            setIsModalOpen(false);
            setForm(initialForm);
            await loadAssistants();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to invite Doctor.';
            setModalNotice({
                type: 'error',
                message: message.includes('Email already registered')
                    ? 'That email is already registered. Search the Doctors table or use a different email.'
                    : message,
            });
        } finally {
            setIsCreating(false);
        }
    };

    const updateAssistantStatus = async (doctorId: string, status: string) => {
        const activeSession = getSession();
        if (!activeSession) {
            router.push('/auth/login');
            return;
        }

        setNotice(null);

        try {
            await apiRequest(`/admin/doctors/${doctorId}/account`, {
                method: 'PATCH',
                token: activeSession.access_token,
                body: JSON.stringify({ status }),
            });

            setAssistants((current) =>
                current.map((Assistant) =>
                    Assistant.doctor_id === doctorId ? { ...Assistant, status } : Assistant
                )
            );
            setNotice({ type: 'success', message: 'Doctor status updated.' });
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to update Doctor status.',
            });
        }
    };

    const resendSetupInvite = async (doctorId: string) => {
        const activeSession = getSession();
        if (!activeSession) {
            router.push('/auth/login');
            return;
        }

        setNotice(null);
        setResendingId(doctorId);

        try {
            const response = await apiRequest<{ message: string; email: string }>(`/admin/doctors/${doctorId}/setup-invite`, {
                method: 'POST',
                token: activeSession.access_token,
            });

            setNotice({
                type: 'success',
                message: response.data?.message || 'Setup invite sent to Doctor email.',
            });
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to resend setup invite.',
            });
        } finally {
            setResendingId(null);
        }
    };

    const openDoctorDetails = async (doctorId: string) => {
        const activeSession = getSession();
        if (!activeSession) {
            router.push('/auth/login');
            return;
        }

        setIsDetailOpen(true);
        setIsDetailLoading(true);
        setSelectedDoctor(null);
        setReviewNotes('');
        setNotice(null);

        try {
            const response = await apiRequest<DoctorDetails>(`/admin/doctors/${doctorId}`, {
                token: activeSession.access_token,
            });
            const details = response.data || null;
            setSelectedDoctor(details);
            setReviewNotes(details?.credentials.credential_notes || '');
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to load Doctor details.',
            });
            setIsDetailOpen(false);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const reviewCredentials = async (status: 'verified' | 'rejected' | 'pending') => {
        if (!selectedDoctor) return;

        const activeSession = getSession();
        if (!activeSession) {
            router.push('/auth/login');
            return;
        }

        setIsReviewing(true);
        setNotice(null);

        try {
            await apiRequest(`/admin/doctors/${selectedDoctor.doctor_id}/credentials`, {
                method: 'PATCH',
                token: activeSession.access_token,
                body: JSON.stringify({
                    credential_status: status,
                    credential_notes: reviewNotes.trim() || undefined,
                    can_onboard_assistants: selectedDoctor.credentials.can_onboard_assistants ?? false,
                    max_assistants: selectedDoctor.credentials.max_assistants ?? 5,
                }),
            });

            setNotice({
                type: 'success',
                message: status === 'verified'
                    ? 'Doctor credentials verified.'
                    : status === 'rejected'
                        ? 'Doctor credentials rejected.'
                        : 'Doctor credentials moved back to pending review.',
            });
            setIsDetailOpen(false);
            setSelectedDoctor(null);
            await loadAssistants();
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to update credential review.',
            });
        } finally {
            setIsReviewing(false);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Doctor Management</h2>
                        <p className="text-gray-600">Invite Doctors and manage their portal access</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="h-5 w-5" />}>
                        Add Doctor
                    </Button>
                </div>

                {notice && (
                    <div
                        className={`rounded-lg border px-4 py-3 text-sm ${notice.type === 'success'
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-red-200 bg-red-50 text-red-700'
                            }`}
                    >
                        {notice.message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <p className="mb-1 text-sm text-gray-600">Total Doctors</p>
                        <p className="text-3xl font-bold text-foreground">{isLoading ? '...' : stats.total}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <p className="mb-1 text-sm text-gray-600">Active</p>
                        <p className="text-3xl font-bold text-green-600">{isLoading ? '...' : stats.active}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <p className="mb-1 text-sm text-gray-600">Pending Credentials</p>
                        <p className="text-3xl font-bold text-yellow-600">{isLoading ? '...' : stats.pending}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <p className="mb-1 text-sm text-gray-600">Blocked</p>
                        <p className="text-3xl font-bold text-red-600">{isLoading ? '...' : stats.blocked}</p>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-72">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search Doctors..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={credentialStatus}
                                onChange={(event) => setCredentialStatus(event.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">All Credentials</option>
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <Button variant="outline" size="sm" onClick={loadAssistants} leftIcon={<RefreshCcw className="h-4 w-4" />}>
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Doctor</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Specialty</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Max Patients</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Credentials</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Account</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            Loading Doctors...
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && Assistants.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            No Doctors found.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && Assistants.map((Assistant) => (
                                    <tr key={Assistant.doctor_id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                                                    {getInitial(Assistant.email)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{formatNameFromEmail(Assistant.email)}</p>
                                                    <p className="text-sm text-gray-600">{Assistant.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">{Assistant.specialty || 'Not set'}</td>
                                        <td className="px-4 py-4 text-gray-600">{Assistant.max_patients}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${Assistant.credential_status === 'verified'
                                                    ? 'bg-green-100 text-green-700'
                                                    : Assistant.credential_status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {Assistant.credential_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            <span
                                                className={`mr-2 rounded-full px-3 py-1 text-xs font-semibold ${Assistant.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : Assistant.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {Assistant.status}
                                            </span>
                                            {Assistant.email_verified ? 'Email verified' : 'Setup pending'}
                                            {Assistant.otp_required ? ' - OTP login' : ''}
                                            <select
                                                value={Assistant.status}
                                                onChange={(event) => updateAssistantStatus(Assistant.doctor_id, event.target.value)}
                                                className="mt-2 block rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="active">Active</option>
                                                <option value="blocked">Blocked</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">
                                            {new Date(Assistant.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            {Assistant.status === 'pending' && !Assistant.email_verified ? (
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        leftIcon={<Eye className="h-4 w-4" />}
                                                        onClick={() => openDoctorDetails(Assistant.doctor_id)}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        isLoading={resendingId === Assistant.doctor_id}
                                                        onClick={() => resendSetupInvite(Assistant.doctor_id)}
                                                    >
                                                        Resend Setup
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    leftIcon={<Eye className="h-4 w-4" />}
                                                    onClick={() => openDoctorDetails(Assistant.doctor_id)}
                                                >
                                                    View Details
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Modal isOpen={isModalOpen} onClose={closeModal} title="Invite Doctor" size="lg">
                    <form onSubmit={createAssistant} className="space-y-5 p-6">
                        {modalNotice && (
                            <div
                                className={`rounded-lg border px-4 py-3 text-sm ${modalNotice.type === 'success'
                                    ? 'border-green-200 bg-green-50 text-green-700'
                                    : 'border-red-200 bg-red-50 text-red-700'
                                    }`}
                            >
                                {modalNotice.message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-xl bg-accent px-4 py-3 text-sm text-gray-700 md:col-span-2">
                                Invite with email first if license or specialty is not available. The Doctor can complete professional details from their profile, then Super Admin can verify or reject credentials here.
                            </div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email Address"
                                required
                                value={form.email}
                                onChange={handleFormChange}
                                placeholder="Doctor@Apothecary.com"
                            />
                            <Input
                                id="license_number"
                                name="license_number"
                                label="License Number (optional)"
                                value={form.license_number}
                                onChange={handleFormChange}
                                placeholder="Doctor can add later"
                            />
                            <Input
                                id="specialty"
                                name="specialty"
                                label="Specialty (optional)"
                                value={form.specialty}
                                onChange={handleFormChange}
                                placeholder="Doctor can add later"
                            />
                            <Input
                                id="max_patients"
                                name="max_patients"
                                type="number"
                                min={1}
                                max={500}
                                label="Max Patients"
                                required
                                value={form.max_patients}
                                onChange={handleFormChange}
                            />
                            <Input
                                id="max_assistants"
                                name="max_assistants"
                                type="number"
                                min={0}
                                max={100}
                                label="Max Assistants"
                                required
                                value={form.max_assistants}
                                onChange={handleFormChange}
                            />
                            <div className="w-full">
                                <label htmlFor="credential_status" className="mb-2 block text-sm font-medium text-gray-700">
                                    Credential Status
                                </label>
                                <select
                                    id="credential_status"
                                    name="credential_status"
                                    value={form.credential_status}
                                    onChange={handleFormChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="verified">Verified</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="credential_notes" className="mb-2 block text-sm font-medium text-gray-700">
                                Credential Notes
                            </label>
                            <textarea
                                id="credential_notes"
                                name="credential_notes"
                                rows={3}
                                value={form.credential_notes}
                                onChange={handleFormChange}
                                placeholder="Internal notes for credential review"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <Checkbox
                            id="otp_required"
                            name="otp_required"
                            checked={form.otp_required}
                            onChange={handleFormChange}
                            label="Require OTP during future Doctor sign-in"
                        />
                        <Checkbox
                            id="can_onboard_assistants"
                            name="can_onboard_assistants"
                            checked={form.can_onboard_assistants}
                            onChange={handleFormChange}
                            label="Allow this Doctor to invite and manage their own Assistants"
                        />

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                            <Button type="button" variant="secondary" onClick={closeModal} disabled={isCreating}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isCreating} leftIcon={<UserRoundPlus className="h-5 w-5" />}>
                                Invite Doctor
                            </Button>
                        </div>
                    </form>
                </Modal>

                <Modal
                    isOpen={isDetailOpen}
                    onClose={() => {
                        if (!isReviewing) setIsDetailOpen(false);
                    }}
                    title="Doctor Credential Review"
                    size="xl"
                >
                    <div className="space-y-6 p-6">
                        {isDetailLoading && (
                            <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                                Loading Doctor details...
                            </div>
                        )}

                        {!isDetailLoading && selectedDoctor && (
                            <>
                                <div className="rounded-2xl bg-gradient-to-r from-[var(--foreground)] to-[#6b4423] p-6 text-white">
                                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold">
                                                {getInitial(selectedDoctor.user.email)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">
                                                    {selectedDoctor.personal_info?.full_name || formatNameFromEmail(selectedDoctor.user.email)}
                                                </h3>
                                                <p className="text-white/80">{selectedDoctor.user.email}</p>
                                                <p className="text-sm text-white/70">{selectedDoctor.credentials.specialty || 'Specialty not set'}</p>
                                            </div>
                                        </div>
                                        <CredentialBadge status={selectedDoctor.credentials.credential_status} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <DetailCard label="License Number" value={selectedDoctor.credentials.license_number || 'Not provided'} />
                                    <DetailCard label="Max Patients" value={selectedDoctor.credentials.max_patients} />
                                    <DetailCard label="Account Status" value={selectedDoctor.user.status} />
                                </div>
                                <section className="rounded-2xl border border-gray-200 p-5">
                                    <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                                        <ShieldCheck className="h-5 w-5 text-primary" />
                                        Assistant Onboarding Permission
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Checkbox
                                            id="detail_can_onboard_assistants"
                                            name="detail_can_onboard_assistants"
                                            checked={selectedDoctor.credentials.can_onboard_assistants ?? false}
                                            onChange={(event) => {
                                                const checked = event.target.checked;
                                                setSelectedDoctor((current) => current ? {
                                                    ...current,
                                                    credentials: {
                                                        ...current.credentials,
                                                        can_onboard_assistants: checked,
                                                    },
                                                } : current);
                                            }}
                                            label="Doctor can invite Assistants"
                                        />
                                        <Input
                                            id="detail_max_assistants"
                                            name="detail_max_assistants"
                                            type="number"
                                            min={0}
                                            max={100}
                                            label="Max Assistants"
                                            value={String(selectedDoctor.credentials.max_assistants ?? 5)}
                                            onChange={(event) => {
                                                const value = Number(event.target.value || 0);
                                                setSelectedDoctor((current) => current ? {
                                                    ...current,
                                                    credentials: {
                                                        ...current.credentials,
                                                        max_assistants: value,
                                                    },
                                                } : current);
                                            }}
                                        />
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <section className="rounded-2xl border border-gray-200 p-5">
                                        <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                                            <ShieldCheck className="h-5 w-5 text-primary" />
                                            Professional Information
                                        </h4>
                                        <div className="space-y-4 text-sm">
                                            <DetailRow label="Bio" value={selectedDoctor.professional_info?.bio || 'No bio added yet.'} multiline />
                                            <DetailRow label="Experience" value={`${selectedDoctor.professional_info?.years_experience ?? 0} years`} />
                                            <DetailRow label="Modalities" value={(selectedDoctor.professional_info?.session_modalities || []).join(', ') || 'Not set'} />
                                            <DetailRow label="Credentials" value={(selectedDoctor.professional_info?.credentials || []).join(', ') || 'No credentials listed'} />
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-gray-200 p-5">
                                        <h4 className="mb-4 font-semibold text-foreground">Personal & Contact</h4>
                                        <div className="space-y-4 text-sm">
                                            <DetailRow label="Full Name" value={selectedDoctor.personal_info?.full_name || 'Not set'} />
                                            <DetailRow label="Phone" value={selectedDoctor.personal_info?.phone_number || 'Not set'} />
                                            <DetailRow label="Timezone" value={selectedDoctor.personal_info?.timezone || 'Not set'} />
                                            <DetailRow label="Email Verified" value={selectedDoctor.user.email_verified ? 'Yes' : 'No'} />
                                        </div>
                                    </section>
                                </div>

                                <section className="rounded-2xl border border-gray-200 p-5">
                                    <h4 className="mb-4 font-semibold text-foreground">Availability</h4>
                                    {selectedDoctor.availability?.length ? (
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {selectedDoctor.availability.map((slot, index) => (
                                                <div key={index} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                                                    <span className="font-semibold text-foreground">{dayNames[slot.day_of_week]}</span>
                                                    <span className="mx-2">{slot.start_time} - {slot.end_time}</span>
                                                    {slot.timezone && <span className="text-gray-500">({slot.timezone})</span>}
                                                    {slot.is_available === false && <span className="ml-2 text-red-600">inactive</span>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No availability added yet.</p>
                                    )}
                                </section>

                                <section className="rounded-2xl bg-accent p-5">
                                    <label htmlFor="reviewNotes" className="mb-2 block font-semibold text-foreground">
                                        Admin Review Notes
                                    </label>
                                    <textarea
                                        id="reviewNotes"
                                        rows={4}
                                        value={reviewNotes}
                                        onChange={(event) => setReviewNotes(event.target.value)}
                                        placeholder="Add verification notes, rejection reason, or license lookup details."
                                        className="w-full rounded-lg border border-orange-200 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                    />
                                </section>

                                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-between">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setIsDetailOpen(false)}
                                        disabled={isReviewing}
                                    >
                                        Close
                                    </Button>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            isLoading={isReviewing}
                                            leftIcon={<XCircle className="h-4 w-4" />}
                                            onClick={() => reviewCredentials('rejected')}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            isLoading={isReviewing}
                                            onClick={() => reviewCredentials('pending')}
                                        >
                                            Mark Pending
                                        </Button>
                                        <Button
                                            type="button"
                                            isLoading={isReviewing}
                                            leftIcon={<CheckCircle2 className="h-4 w-4" />}
                                            onClick={() => reviewCredentials('verified')}
                                        >
                                            Verify Credentials
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
}

function CredentialBadge({ status }: { status: 'pending' | 'verified' | 'rejected' }) {
    const classes = status === 'verified'
        ? 'bg-green-100 text-green-700'
        : status === 'rejected'
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-100 text-yellow-800';

    return (
        <span className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${classes}`}>
            {status}
        </span>
    );
}

function DetailCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
            <p className="font-semibold text-foreground">{value}</p>
        </div>
    );
}

function DetailRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
    return (
        <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
            <p className={`text-gray-700 ${multiline ? 'leading-relaxed' : ''}`}>{value}</p>
        </div>
    );
}
