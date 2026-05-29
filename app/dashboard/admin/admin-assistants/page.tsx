'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    UserPlus, RefreshCcw, Search, Eye, EyeOff,
    CheckCircle2, XCircle, ShieldCheck, ShieldOff, Link as LinkIcon
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Avatar, Button, Modal } from '@/components/ui';
import { apiRequest } from '@/lib/api';
import { getSession, hasRole } from '@/lib/auth';

/* ── Types ─────────────────────────────────── */

type AdminAssistant = {
    assistant_id: string;
    user_id: string;
    email: string;
    status: string;
    email_verified: boolean;
    otp_required: boolean;
    must_change_password: boolean;
    assigned_doctor_count: number;
    assigned_doctor_ids: string[];
    permissions: {
        can_view_assigned_patients: boolean;
        can_assign_patients: boolean;
        can_manage_bookings: boolean;
        can_send_communications: boolean;
    };
    created_at: string;
    updated_at: string;
};

type AssistantsResponse = {
    Assistants: AdminAssistant[];
    pagination: { total: number; page: number; limit: number; total_pages: number; has_next: boolean; has_prev: boolean };
};

type AdminDoctorOption = {
    doctor_id: string;
    email: string;
    status: string;
};

type DoctorsResponse = {
    Doctors: AdminDoctorOption[];
};

/* ── Helpers ────────────────────────────────── */

function nameFromEmail(e = '') {
    return e.split('@')[0].split(/[._-]+/).filter(Boolean).map(p => p[0].toUpperCase() + p.slice(1)).join(' ');
}

const statusCls: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-red-100 text-red-700',
    blocked: 'bg-red-100 text-red-700',
    suspended: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-yellow-100 text-yellow-700',
};

function PermBadge({ on, label }: { on: boolean; label: string }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${on ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {on ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {label}
        </span>
    );
}

const BLANK_INVITE = {
    email: '', otp_required: false,
    can_view: true, can_assign: false, can_bookings: true, can_comms: true,
    doctor_ids: [] as string[],
};

/* ── Page ───────────────────────────────────── */

export default function AdminAssistantManagement() {
    const router = useRouter();
    const [Assistants, setAssistants] = useState<AdminAssistant[]>([]);
    const [Doctors, setDoctors] = useState<AdminDoctorOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // invite modal
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [inviteForm, setInviteForm] = useState(BLANK_INVITE);

    // manage modal
    const [selected, setSelected] = useState<AdminAssistant | null>(null);
    const [editPerms, setEditPerms] = useState({ can_view: true, can_assign: false, can_bookings: true, can_comms: true });
    const [editStatus, setEditStatus] = useState('active');
    const [assignIds, setAssignIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!hasRole('admin')) { router.push('/auth/login'); return; }
        void load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const load = async () => {
        const s = getSession();
        if (!s) return;
        setIsLoading(true); setNotice(null);
        try {
            const [cRes, tRes] = await Promise.all([
                apiRequest<AssistantsResponse>('/admin/assistants/active?page=1&limit=200', { token: s.access_token }),
                apiRequest<DoctorsResponse>('/admin/doctors/active?page=1&limit=200', { token: s.access_token }),
            ]);
            setAssistants(cRes.data?.Assistants || []);
            setDoctors(tRes.data?.Doctors || []);
        } catch (err) {
            setNotice({ type: 'error', message: err instanceof Error ? err.message : 'Failed to load.' });
        } finally { setIsLoading(false); }
    };

    /* invite */
    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        const s = getSession(); if (!s) return;
        setIsSending(true); setNotice(null);
        try {
            const body: Record<string, unknown> = {
                email: inviteForm.email.trim().toLowerCase(),
                otp_required: inviteForm.otp_required,
                permissions: {
                    can_view_assigned_patients: inviteForm.can_view,
                    can_assign_patients: inviteForm.can_assign,
                    can_manage_bookings: inviteForm.can_bookings,
                    can_send_communications: inviteForm.can_comms,
                },
                ...(inviteForm.doctor_ids.length ? { assigned_doctor_ids: inviteForm.doctor_ids } : {}),
            };
            const res = await apiRequest<{ message: string }>('/admin/assistants', { method: 'POST', token: s.access_token, body: JSON.stringify(body) });
            setNotice({ type: 'success', message: res.data?.message || 'Assistant created.' });
            setIsInviteOpen(false); setInviteForm(BLANK_INVITE);
            await load();
        } catch (err) {
            setNotice({ type: 'error', message: err instanceof Error ? err.message : 'Failed to invite Assistant.' });
        } finally { setIsSending(false); }
    };

    /* open manage */
    const openManage = (c: AdminAssistant) => {
        setSelected(c);
        setEditPerms({
            can_view: c.permissions.can_view_assigned_patients,
            can_assign: c.permissions.can_assign_patients,
            can_bookings: c.permissions.can_manage_bookings,
            can_comms: c.permissions.can_send_communications
        });
        setEditStatus(c.status);
        setAssignIds([...c.assigned_doctor_ids]);
    };

    /* save manage */
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        const s = getSession(); if (!s) return;
        setIsSaving(true); setNotice(null);
        try {
            await Promise.all([
                apiRequest(`/admin/assistants/${selected.assistant_id}`, {
                    method: 'PATCH', token: s.access_token,
                    body: JSON.stringify({
                        permissions: {
                            can_view_assigned_patients: editPerms.can_view,
                            can_assign_patients: editPerms.can_assign,
                            can_manage_bookings: editPerms.can_bookings,
                            can_send_communications: editPerms.can_comms
                        },
                        status: editStatus,
                    }),
                }),
                apiRequest(`/admin/assistants/${selected.assistant_id}/doctors`, {
                    method: 'PUT', token: s.access_token,
                    body: JSON.stringify({ doctor_ids: assignIds }),
                }),
            ]);
            setNotice({ type: 'success', message: 'Assistant updated.' });
            setSelected(null);
            await load();
        } catch (err) {
            setNotice({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update.' });
        } finally { setIsSaving(false); }
    };

    const filtered = useMemo(() => Assistants.filter(c => !search.trim() || c.email.toLowerCase().includes(search.toLowerCase())), [Assistants, search]);

    const stats = useMemo(() => ({
        total: Assistants.length,
        active: Assistants.filter(c => c.status === 'active').length,
        inactive: Assistants.filter(c => c.status !== 'active').length,
        unassigned: Assistants.filter(c => c.assigned_doctor_count === 0).length,
    }), [Assistants]);

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Assistant Management</h2>
                        <p className="text-gray-600">Invite Assistants, set permissions, and assign them to Doctors.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={load} leftIcon={<RefreshCcw className="h-4 w-4" />}>Refresh</Button>
                        <Button onClick={() => setIsInviteOpen(true)} leftIcon={<UserPlus className="h-5 w-5" />}>Invite Assistant</Button>
                    </div>
                </div>

                {notice && (
                    <div className={`rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {notice.message}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                        { label: 'Total', value: stats.total, cls: 'text-foreground' },
                        { label: 'Active', value: stats.active, cls: 'text-green-600' },
                        { label: 'Inactive', value: stats.inactive, cls: 'text-red-500' },
                        { label: 'Unassigned', value: stats.unassigned, cls: 'text-amber-600' },
                    ].map(s => (
                        <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm">
                            <p className="mb-1 text-sm text-gray-500">{s.label}</p>
                            <p className={`text-3xl font-bold ${s.cls}`}>{isLoading ? '…' : s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email…"
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                        <p className="text-sm text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['assistant', 'Status', 'Permissions', 'Doctors', 'Joined', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && <tr><td colSpan={6} className="py-10 text-center text-gray-400">Loading…</td></tr>}
                                {!isLoading && filtered.length === 0 && (
                                    <tr><td colSpan={6} className="py-10 text-center text-gray-400">No Assistants found. Invite one to get started.</td></tr>
                                )}
                                {!isLoading && filtered.map(c => (
                                    <tr key={c.assistant_id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={c.email} />
                                                <div>
                                                    <p className="font-medium text-foreground">{nameFromEmail(c.email)}</p>
                                                    <p className="text-sm text-gray-500">{c.email}</p>
                                                    {c.must_change_password && <p className="text-xs text-amber-500">Temp pwd active</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusCls[c.status] ?? 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                <PermBadge on={c.permissions.can_view_assigned_patients} label="View" />
                                                <PermBadge on={c.permissions.can_assign_patients} label="Assign" />
                                                <PermBadge on={c.permissions.can_manage_bookings} label="Bookings" />
                                                <PermBadge on={c.permissions.can_send_communications} label="Msgs" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{c.assigned_doctor_count} Doctor{c.assigned_doctor_count !== 1 ? 's' : ''}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline" leftIcon={<Eye className="h-3.5 w-3.5" />} onClick={() => openManage(c)}>Manage</Button>
                                                <Button size="sm" variant="secondary" onClick={() => router.push(`/dashboard/admin/admin-assistants/${c.assistant_id}`)}>Monitor</Button>
                                            </div>
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
                        Creates an Assistant account and emails a setup link to them to create their password. You can optionally assign Doctors now.
                    </div>

                    <div>
                        <label htmlFor="ic-email" className="mb-2 block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                        <input id="ic-email" type="email" required value={inviteForm.email}
                            onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="Assistant@clinic.com"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                        <input type="checkbox" checked={inviteForm.otp_required} onChange={e => setInviteForm(f => ({ ...f, otp_required: e.target.checked }))} className="h-4 w-4 rounded accent-[var(--primary)]" />
                        <span className="text-sm text-gray-700">Require OTP on every login</span>
                    </label>

                    <div>
                        <p className="mb-2 text-sm font-semibold text-gray-700">Permissions</p>
                        <div className="space-y-2">
                            {([['can_view', 'View assigned patients'], ['can_assign', 'Assign patients to Doctors'], ['can_bookings', 'Manage bookings'], ['can_comms', 'Send communications']] as const).map(([k, lbl]) => (
                                <label key={k} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                                    <input type="checkbox" checked={inviteForm[k]} onChange={e => setInviteForm(f => ({ ...f, [k]: e.target.checked }))} className="h-4 w-4 rounded accent-[var(--primary)]" />
                                    <span className="text-sm text-gray-700">{lbl}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {Doctors.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-700">Assign to Doctors <span className="font-normal text-gray-400">(optional)</span></p>
                            <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg border border-gray-200 p-2">
                                {Doctors.filter(t => t.status === 'active').map(t => (
                                    <label key={t.doctor_id} className="flex cursor-pointer items-center gap-3 rounded px-3 py-2 hover:bg-gray-50">
                                        <input type="checkbox"
                                            checked={inviteForm.doctor_ids.includes(t.doctor_id)}
                                            onChange={e => setInviteForm(f => ({
                                                ...f,
                                                doctor_ids: e.target.checked ? [...f.doctor_ids, t.doctor_id] : f.doctor_ids.filter(id => id !== t.doctor_id)
                                            }))}
                                            className="h-4 w-4 rounded accent-[var(--primary)]" />
                                        <span className="text-sm text-gray-700">{nameFromEmail(t.email)} <span className="text-gray-400">({t.email})</span></span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                        <Button type="button" variant="secondary" onClick={() => setIsInviteOpen(false)} disabled={isSending}>Cancel</Button>
                        <Button type="submit" isLoading={isSending} leftIcon={<UserPlus className="h-5 w-5" />}>Create Assistant</Button>
                    </div>
                </form>
            </Modal>

            {/* ── Manage Modal ── */}
            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Manage: ${nameFromEmail(selected?.email)}`} size="lg">
                {selected && (
                    <form onSubmit={handleSave} className="space-y-5 p-6">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm space-y-1">
                            <p><span className="font-medium text-gray-600">Email:</span> {selected.email}</p>
                            <p><span className="font-medium text-gray-600">OTP Login:</span> {selected.otp_required ? 'Yes' : 'No'}</p>
                            <p><span className="font-medium text-gray-600">Joined:</span> {new Date(selected.created_at).toLocaleDateString()}</p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Account Status</label>
                            <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="blocked">Blocked</option>
                                <option value="suspended">Suspended</option>
                            </select>
                            <p className={`mt-1.5 flex items-center gap-1 text-xs ${editStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                {editStatus === 'active' ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
                                {editStatus === 'active' ? 'Assistant has dashboard access.' : 'Assistant will lose dashboard access.'}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-700">Permissions</p>
                            <div className="space-y-2">
                                {([['can_view', 'View assigned patients'], ['can_assign', 'Assign patients to Doctors'], ['can_bookings', 'Manage bookings'], ['can_comms', 'Send communications']] as const).map(([k, lbl]) => (
                                    <label key={k} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                                        <input type="checkbox" checked={editPerms[k]} onChange={e => setEditPerms(p => ({ ...p, [k]: e.target.checked }))} className="h-4 w-4 rounded accent-[var(--primary)]" />
                                        <span className="text-sm text-gray-700">{lbl}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {Doctors.length > 0 && (
                            <div>
                                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"><LinkIcon className="h-4 w-4 text-primary" /> Assigned Doctors</p>
                                <div className="max-h-44 overflow-y-auto space-y-1 rounded-lg border border-gray-200 p-2">
                                    {Doctors.filter(t => t.status === 'active').map(t => (
                                        <label key={t.doctor_id} className="flex cursor-pointer items-center gap-3 rounded px-3 py-2 hover:bg-gray-50">
                                            <input type="checkbox"
                                                checked={assignIds.includes(t.doctor_id)}
                                                onChange={e => setAssignIds(ids => e.target.checked ? [...ids, t.doctor_id] : ids.filter(id => id !== t.doctor_id))}
                                                className="h-4 w-4 rounded accent-[var(--primary)]" />
                                            <span className="text-sm text-gray-700">{nameFromEmail(t.email)} <span className="text-gray-400">({t.email})</span></span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                            <Button type="button" variant="secondary" onClick={() => setSelected(null)} disabled={isSaving}>Cancel</Button>
                            <Button type="submit" isLoading={isSaving} leftIcon={<ShieldCheck className="h-5 w-5" />}>Save Changes</Button>
                        </div>
                    </form>
                )}
            </Modal>
        </DashboardLayout>
    );
}
