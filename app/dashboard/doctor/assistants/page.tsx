'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    UserPlus, RefreshCcw, Search, ShieldCheck, ShieldOff,
    Eye, EyeOff, Pencil, Users, CheckCircle2, XCircle
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Avatar, Button, Modal } from '@/components/ui';
import { apiRequest } from '@/lib/api';
import { getSession, hasRole } from '@/lib/auth';

/* ─── Types ─────────────────────────────────────────────── */

type AssistantUser = {
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

type AssistantPermissions = {
    can_view_assigned_patients: boolean;
    can_assign_patients: boolean;
    can_manage_bookings: boolean;
    can_send_communications: boolean;
};

type Assistant = {
    assistant_id: string;
    user: AssistantUser;
    assigned_doctor_ids: string[];
    permissions: AssistantPermissions;
    created_at: string;
    updated_at: string;
};

type AssistantsResponse = {
    Assistants: Assistant[];
    total: number;
    limits: {
        can_onboard_assistants: boolean;
        max_assistants: number;
    };
};

type InviteForm = {
    email: string;
    otp_required: boolean;
    can_view_assigned_patients: boolean;
    can_assign_patients: boolean;
    can_manage_bookings: boolean;
    can_send_communications: boolean;
};

type EditForm = {
    can_view_assigned_patients: boolean;
    can_assign_patients: boolean;
    can_manage_bookings: boolean;
    can_send_communications: boolean;
    status: string;
};

/* ─── Helpers ────────────────────────────────────────────── */

function nameFromEmail(email?: string) {
    const local = email?.split('@')[0] || 'assistant';
    return local.split(/[._-]+/).filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

const statusStyle: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-red-100 text-red-700',
    suspended: 'bg-yellow-100 text-yellow-700',
};

function PermBadge({ enabled, label }: { enabled: boolean; label: string }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {enabled ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {label}
        </span>
    );
}

/* ─── Page ───────────────────────────────────────────────── */

const DEFAULT_INVITE: InviteForm = {
    email: '',
    otp_required: false,
    can_view_assigned_patients: true,
    can_assign_patients: false,
    can_manage_bookings: true,
    can_send_communications: true,
};

export default function DoctorAssistants() {
    const router = useRouter();
    const [Assistants, setAssistants] = useState<Assistant[]>([]);
    const [limits, setLimits] = useState<{ can_onboard_assistants: boolean; max_assistants: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Invite modal
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [inviteForm, setInviteForm] = useState<InviteForm>(DEFAULT_INVITE);

    // Edit modal
    const [editTarget, setEditTarget] = useState<Assistant | null>(null);
    const [editForm, setEditForm] = useState<EditForm>({
        can_view_assigned_patients: true,
        can_assign_patients: false,
        can_manage_bookings: true,
        can_send_communications: true,
        status: 'active',
    });
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    useEffect(() => {
        if (!hasRole('doctor')) {
            router.push('/auth/login');
            return;
        }
        void loadAssistants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    /* ── Fetch ── */
    const loadAssistants = async () => {
        const session = getSession();
        if (!session) { router.push('/auth/login'); return; }

        // Only Doctors can access this page
        if (session.user.role !== 'doctor') {
            router.push('/dashboard/doctor');
            return;
        }

        setIsLoading(true);
        setNotice(null);
        try {
            const res = await apiRequest<AssistantsResponse>('/doctor/assistants', { token: session.access_token });
            setAssistants(res.data?.Assistants || []);
            setLimits(res.data?.limits || null);
        } catch (err) {
            setNotice({ type: 'error', message: err instanceof Error ? err.message : 'Failed to load Assistants.' });
        } finally {
            setIsLoading(false);
        }
    };

    /* ── Invite ── */
    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        const session = getSession();
        if (!session) return;
        setIsSending(true);
        setNotice(null);
        try {
            const body: Record<string, unknown> = {
                email: inviteForm.email.trim().toLowerCase(),
                otp_required: inviteForm.otp_required,
                permissions: {
                    can_view_assigned_patients: inviteForm.can_view_assigned_patients,
                    can_assign_patients: inviteForm.can_assign_patients,
                    can_manage_bookings: inviteForm.can_manage_bookings,
                    can_send_communications: inviteForm.can_send_communications,
                },
            };

            const res = await apiRequest<{ message: string }>('/doctor/assistants', {
                method: 'POST',
                token: session.access_token,
                body: JSON.stringify(body),
            });
            setNotice({ type: 'success', message: res.data?.message || 'Assistant invited successfully.' });
            setInviteForm(DEFAULT_INVITE);
            setIsInviteOpen(false);
            await loadAssistants();
        } catch (err) {
            setNotice({ type: 'error', message: err instanceof Error ? err.message : 'Failed to invite Assistant.' });
        } finally {
            setIsSending(false);
        }
    };

    /* ── Edit ── */
    const openEdit = (c: Assistant) => {
        setEditTarget(c);
        setEditForm({
            can_view_assigned_patients: c.permissions.can_view_assigned_patients,
            can_assign_patients: c.permissions.can_assign_patients,
            can_manage_bookings: c.permissions.can_manage_bookings,
            can_send_communications: c.permissions.can_send_communications,
            status: c.user.status,
        });
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTarget) return;
        const session = getSession();
        if (!session) return;
        setIsSavingEdit(true);
        setNotice(null);
        try {
            const res = await apiRequest<{ message: string }>(`/doctor/assistants/${editTarget.assistant_id}`, {
                method: 'PATCH',
                token: session.access_token,
                body: JSON.stringify({
                    permissions: {
                        can_view_assigned_patients: editForm.can_view_assigned_patients,
                        can_assign_patients: editForm.can_assign_patients,
                        can_manage_bookings: editForm.can_manage_bookings,
                        can_send_communications: editForm.can_send_communications,
                    },
                    status: editForm.status,
                }),
            });
            setNotice({ type: 'success', message: res.data?.message || 'Assistant updated.' });
            setEditTarget(null);
            await loadAssistants();
        } catch (err) {
            setNotice({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update Assistant.' });
        } finally {
            setIsSavingEdit(false);
        }
    };

    /* ── Filtered list ── */
    const filtered = useMemo(() =>
        Assistants.filter(c =>
            !search.trim() || c.user.email.toLowerCase().includes(search.trim().toLowerCase())
        ), [Assistants, search]);

    const canInvite = limits?.can_onboard_assistants && Assistants.length < (limits?.max_assistants ?? 5);

    /* ─── Render ─── */
    return (
        <DashboardLayout role="doctor">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">My Assistants</h2>
                        <p className="text-gray-600">
                            {limits
                                ? `${Assistants.length} / ${limits.max_assistants} Assistants · Invite access: ${limits.can_onboard_assistants ? 'Enabled' : 'Disabled by admin'}`
                                : 'Manage and monitor your Assistant accounts.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={loadAssistants} leftIcon={<RefreshCcw className="h-4 w-4" />}>
                            Refresh
                        </Button>
                        {limits?.can_onboard_assistants && (
                            <Button
                                onClick={() => setIsInviteOpen(true)}
                                leftIcon={<UserPlus className="h-5 w-5" />}
                                disabled={!canInvite}
                                title={!canInvite ? `Assistant limit reached (${limits?.max_assistants})` : undefined}
                            >
                                Invite Assistant
                            </Button>
                        )}
                    </div>
                </div>

                {/* Notice */}
                {notice && (
                    <div className={`rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {notice.message}
                    </div>
                )}

                {/* Admin lock banner */}
                {limits && !limits.can_onboard_assistants && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
                        <ShieldOff className="h-4 w-4 shrink-0" />
                        Assistant invitations are disabled for your account. Contact the Apothecary admin to enable this feature.
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatBox label="Total Assistants" value={isLoading ? '…' : Assistants.length} />
                    <StatBox label="Active" value={isLoading ? '…' : Assistants.filter(c => c.user.status === 'active').length} tone="green" />
                    <StatBox label="Inactive" value={isLoading ? '…' : Assistants.filter(c => c.user.status !== 'active').length} tone="red" />
                    <StatBox label="Slot Limit" value={isLoading ? '…' : limits?.max_assistants ?? '—'} />
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by email…"
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <p className="text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Assistant</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Permissions</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">Loading Assistants…</td></tr>
                                )}
                                {!isLoading && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center">
                                            <Users className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                            <p className="text-gray-500">No Assistants found. {limits?.can_onboard_assistants ? 'Invite one to get started.' : ''}</p>
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && filtered.map(c => (
                                    <tr key={c.assistant_id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={c.user.email} />
                                                <div>
                                                    <p className="font-medium text-foreground">{nameFromEmail(c.user.email)}</p>
                                                    <p className="text-sm text-gray-500">{c.user.email}</p>
                                                    {c.user.must_change_password && (
                                                        <span className="text-xs text-amber-600">Temp password active</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[c.user.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {c.user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                <PermBadge enabled={c.permissions.can_view_assigned_patients} label="View Patients" />
                                                <PermBadge enabled={c.permissions.can_assign_patients} label="Assign Patients" />
                                                <PermBadge enabled={c.permissions.can_manage_bookings} label="Bookings" />
                                                <PermBadge enabled={c.permissions.can_send_communications} label="Messaging" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-4">
                                            <Button size="sm" variant="outline" leftIcon={<Pencil className="h-3.5 w-3.5" />} onClick={() => openEdit(c)}>
                                                Manage
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Invite Modal ── */}
            <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Assistant" size="lg">
                <form onSubmit={handleInvite} className="space-y-5 p-6">
                    <div className="rounded-xl bg-accent px-4 py-3 text-sm text-gray-700">
                        A new Assistant account will be created and a setup link will be emailed to them to create their password.
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="c-email" className="mb-2 block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                        <input
                            id="c-email"
                            type="email"
                            required
                            value={inviteForm.email}
                            onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="Assistant@clinic.com"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* OTP */}
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={inviteForm.otp_required}
                            onChange={e => setInviteForm(f => ({ ...f, otp_required: e.target.checked }))}
                            className="h-4 w-4 rounded accent-[var(--primary)]"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Require OTP on login</p>
                            <p className="text-xs text-gray-500">Assistant must enter an OTP every session.</p>
                        </div>
                    </label>

                    {/* Permissions */}
                    <div>
                        <p className="mb-3 text-sm font-semibold text-gray-700">Permissions</p>
                        <div className="space-y-2">
                            {([
                                ['can_view_assigned_patients', 'View assigned patients'],
                                ['can_assign_patients', 'Assign patients to Doctors'],
                                ['can_manage_bookings', 'Manage bookings'],
                                ['can_send_communications', 'Send communications'],
                            ] as const).map(([key, label]) => (
                                <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={inviteForm[key]}
                                        onChange={e => setInviteForm(f => ({ ...f, [key]: e.target.checked }))}
                                        className="h-4 w-4 rounded accent-[var(--primary)]"
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                        <Button type="button" variant="secondary" onClick={() => setIsInviteOpen(false)} disabled={isSending}>Cancel</Button>
                        <Button type="submit" isLoading={isSending} leftIcon={<UserPlus className="h-5 w-5" />}>Send Invite</Button>
                    </div>
                </form>
            </Modal>

            {/* ── Edit / Manage Modal ── */}
            <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title={`Manage: ${nameFromEmail(editTarget?.user.email)}`} size="md">
                {editTarget && (
                    <form onSubmit={handleSaveEdit} className="space-y-5 p-6">
                        {/* Info */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm space-y-1">
                            <p><span className="font-medium text-gray-600">Email:</span> {editTarget.user.email}</p>
                            <p><span className="font-medium text-gray-600">Joined:</span> {new Date(editTarget.created_at).toLocaleDateString()}</p>
                            <p><span className="font-medium text-gray-600">OTP Login:</span> {editTarget.user.otp_required ? 'Yes' : 'No'}</p>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="c-status" className="mb-2 block text-sm font-medium text-gray-700">Account Status</label>
                            <select
                                id="c-status"
                                value={editForm.status}
                                onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive (deactivated)</option>
                                <option value="suspended">Suspended</option>
                            </select>
                            {editForm.status !== 'active' && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                    <ShieldOff className="h-3.5 w-3.5" /> Assistant will lose dashboard access.
                                </p>
                            )}
                            {editForm.status === 'active' && (
                                <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Assistant has full dashboard access.
                                </p>
                            )}
                        </div>

                        {/* Permissions */}
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-700">Permissions</p>
                            <div className="space-y-2">
                                {([
                                    ['can_view_assigned_patients', 'View assigned patients'],
                                    ['can_assign_patients', 'Assign patients to Doctors'],
                                    ['can_manage_bookings', 'Manage bookings'],
                                    ['can_send_communications', 'Send communications'],
                                ] as const).map(([key, label]) => (
                                    <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={editForm[key]}
                                            onChange={e => setEditForm(f => ({ ...f, [key]: e.target.checked }))}
                                            className="h-4 w-4 rounded accent-[var(--primary)]"
                                        />
                                        <span className="text-sm text-gray-700">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                            <Button type="button" variant="secondary" onClick={() => setEditTarget(null)} disabled={isSavingEdit}>Cancel</Button>
                            <Button type="submit" isLoading={isSavingEdit} leftIcon={<ShieldCheck className="h-5 w-5" />}>Save Changes</Button>
                        </div>
                    </form>
                )}
            </Modal>
        </DashboardLayout>
    );
}

function StatBox({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'green' | 'red' }) {
    const color = tone === 'green' ? 'text-green-600' : tone === 'red' ? 'text-red-500' : 'text-foreground';
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-1 text-sm text-gray-500">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
    );
}
