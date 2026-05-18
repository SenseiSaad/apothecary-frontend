'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalendarClock, MessageSquare, ShieldAlert, Users, UserRoundCheck } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Avatar, Button, StatCard } from '@/components/ui';
import { apiRequest } from '@/lib/api';
import { getSession, hasRole } from '@/lib/auth';

type AssistantMe = {
    user: {
        email: string;
        status: string;
        role: string;
    };
    Assistant: {
        assigned_doctor_ids: string[];
        permissions: {
            can_view_assigned_patients: boolean;
            can_manage_bookings: boolean;
            can_send_communications: boolean;
        };
    };
};

type AssistantPatient = {
    patient_id: string;
    name: string;
    email: string;
    status: string;
    tier: string;
    Doctor_name?: string;
    current_streak: number;
    activity_score: number;
    last_active?: string;
};

type AssistantPatientsResponse = {
    patients: AssistantPatient[];
    total: number;
};

type AssistantDoctor = {
    doctor_id: string;
    email: string;
    status: string;
    specialty: string;
    name: string;
    credential_status: string;
};

type DoctorDashboardSummary = {
    invites: Array<{ status: string }>;
    total: number;
};

function nameFromEmail(email?: string) {
    const local = email?.split('@')[0] || 'assistant';
    return local
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function AssistantDashboard() {
    const router = useRouter();
    const [me, setMe] = useState<AssistantMe | null>(null);
    const [patients, setPatients] = useState<AssistantPatient[]>([]);
    const [Doctors, setDoctors] = useState<AssistantDoctor[]>([]);
    const [DoctorInviteSummary, setDoctorInviteSummary] = useState<DoctorDashboardSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notice, setNotice] = useState<{ type: 'error' | 'info'; message: string } | null>(null);

    const session = typeof window !== 'undefined' ? getSession() : null;
    const isBackendAssistant = session?.user.role === 'assistant';
    const isBackendDoctor = session?.user.role === 'doctor';

    useEffect(() => {
        if (!hasRole('doctor')) {
            router.push('/auth/login');
            return;
        }

        void loadDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const loadDashboard = async () => {
        const activeSession = getSession();
        if (!activeSession) {
            router.push('/auth/login');
            return;
        }

        setIsLoading(true);
        setNotice(null);

        try {
            if (activeSession.user.role === 'assistant') {
                const profile = await apiRequest<AssistantMe>('/assistant/me', { token: activeSession.access_token });
                setMe(profile.data || null);

                const DoctorsRes = await apiRequest<{ Doctors: AssistantDoctor[] }>('/assistant/doctors', { token: activeSession.access_token });
                setDoctors(DoctorsRes.data?.Doctors || []);

                if (profile.data?.Assistant.permissions.can_view_assigned_patients) {
                    const patientResponse = await apiRequest<AssistantPatientsResponse>('/assistant/patients', {
                        token: activeSession.access_token,
                    });
                    setPatients(patientResponse.data?.patients || []);
                }
            } else {
                const invites = await apiRequest<DoctorDashboardSummary>('/doctor/patient-invites', {
                    token: activeSession.access_token,
                });
                setDoctorInviteSummary(invites.data || null);
            }
        } catch (error) {
            setNotice({
                type: 'error',
                message: error instanceof Error
                    ? error.message
                    : 'Unable to load dashboard. Your account may be inactive or missing permissions.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const stats = useMemo(() => {
        if (isBackendAssistant) {
            return [
                { label: 'Assigned Doctors', value: me?.Assistant.assigned_doctor_ids.length || 0, icon: <UserRoundCheck className="h-6 w-6" />, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
                { label: 'Visible Patients', value: patients.length, icon: <Users className="h-6 w-6" />, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
                { label: 'Booking Access', value: me?.Assistant.permissions.can_manage_bookings ? 'On' : 'Off', icon: <CalendarClock className="h-6 w-6" />, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50' },
                { label: 'Messaging', value: me?.Assistant.permissions.can_send_communications ? 'On' : 'Off', icon: <MessageSquare className="h-6 w-6" />, color: 'from-[#E67E3C] to-[#d16b2a]', bgColor: 'bg-orange-50' },
            ];
        }

        return [
            { label: 'Patient Invites', value: DoctorInviteSummary?.total || 0, icon: <Users className="h-6 w-6" />, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
            { label: 'Pending Invites', value: DoctorInviteSummary?.invites.filter((invite) => invite.status === 'pending').length || 0, icon: <UserRoundCheck className="h-6 w-6" />, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
            { label: 'Booking System', value: 'TODO', icon: <CalendarClock className="h-6 w-6" />, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50' },
            { label: 'Messages', value: 'TODO', icon: <MessageSquare className="h-6 w-6" />, color: 'from-[#E67E3C] to-[#d16b2a]', bgColor: 'bg-orange-50' },
        ];
    }, [isBackendAssistant, me, patients.length, DoctorInviteSummary]);

    return (
        <DashboardLayout role="doctor">
            <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-r from-[#E67E3C] to-[#d16b2a] p-8 text-white">
                    <h2 className="mb-2 text-3xl font-bold">
                        {isBackendAssistant ? `Assistant Dashboard, ${nameFromEmail(session?.user.email)}` : `Doctor Dashboard, ${nameFromEmail(session?.user.email)}`}
                    </h2>
                    <p className="text-white/90">
                        {isBackendAssistant
                            ? 'Support assigned Doctors with patient coordination, bookings, and approved communications.'
                            : 'Manage patient invites, availability, profile details, and Assistant support access.'}
                    </p>
                </div>

                {notice && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {notice.message}
                    </div>
                )}

                {isLoading ? (
                    <div className="rounded-2xl bg-white p-8 text-gray-600 shadow-sm">Loading dashboard...</div>
                ) : notice?.message.includes('deactivated') ? (
                    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                        <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-red-500" />
                        <h3 className="mb-2 text-xl font-bold text-[#4a3428]">Dashboard Access Disabled</h3>
                        <p className="text-gray-600">Your Assistant account is not active. Please contact your Doctor or the Apothecary admin.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <StatCard key={stat.label} {...stat} value={String(stat.value)} />
                            ))}
                        </div>

                        {isBackendAssistant && (
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {/* Assigned Doctors */}
                                <div className="rounded-2xl bg-white p-6 shadow-sm">
                                    <h3 className="mb-6 text-xl font-bold text-[#4a3428]">Assigned Doctors</h3>
                                    <div className="space-y-4">
                                        {Doctors.map((Doctor) => (
                                            <div key={Doctor.doctor_id} className="flex items-center gap-3 rounded-lg bg-[#fef3e8] p-4">
                                                <Avatar name={Doctor.name || Doctor.email} />
                                                <div>
                                                    <p className="font-semibold text-[#4a3428]">{Doctor.name || nameFromEmail(Doctor.email)}</p>
                                                    <p className="text-sm text-gray-600 capitalize">{Doctor.specialty || 'General'} Doctor</p>
                                                </div>
                                            </div>
                                        ))}
                                        {!Doctors.length && (
                                            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">No assigned Doctors.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Assigned Patients */}
                                <div className="rounded-2xl bg-white p-6 shadow-sm">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-[#4a3428]">Assigned Patients</h3>
                                        <Link href="/dashboard/doctor/patients" className="text-sm font-medium text-[#E67E3C] hover:text-[#d16b2a]">
                                            View All
                                        </Link>
                                    </div>
                                    <div className="space-y-4">
                                        {patients.slice(0, 5).map((patient) => (
                                            <div key={patient.patient_id} className="flex items-center justify-between rounded-lg bg-[#fef3e8] p-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={patient.name} />
                                                    <div>
                                                        <p className="font-semibold text-[#4a3428]">{patient.name}</p>
                                                        <p className="text-sm text-gray-600">{patient.Doctor_name || 'Assigned Doctor'}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-semibold text-[#E67E3C]">{patient.current_streak}🔥</p>
                                            </div>
                                        ))}
                                        {!patients.length && (
                                            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">No assigned patients are visible yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Permissions */}
                                <div className="rounded-2xl bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 text-xl font-bold text-[#4a3428]">Permissions</h3>
                                    <div className="space-y-3 text-sm">
                                        <PermissionRow label="View patients" enabled={!!me?.Assistant.permissions.can_view_assigned_patients} />
                                        <PermissionRow label="Manage bookings" enabled={!!me?.Assistant.permissions.can_manage_bookings} />
                                        <PermissionRow label="Send communications" enabled={!!me?.Assistant.permissions.can_send_communications} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isBackendDoctor && (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <Link href="/dashboard/doctor/patients" className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg">
                                    <Users className="mb-4 h-8 w-8 text-[#E67E3C]" />
                                    <h3 className="mb-2 text-lg font-bold text-[#4a3428]">Patient Invites</h3>
                                    <p className="text-sm text-gray-600">Invite patients and track invite status.</p>
                                </Link>
                                <Link href="/dashboard/doctor/assistants" className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg group">
                                    <UserRoundCheck className="mb-4 h-8 w-8 text-[#E67E3C]" />
                                    <h3 className="mb-2 text-lg font-bold text-[#4a3428]">My Assistants</h3>
                                    <p className="text-sm text-gray-600">Invite Assistants, set permissions, and monitor access.</p>
                                    <div className="mt-3">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3e8] px-3 py-1 text-xs font-semibold text-[#E67E3C]">
                                            {DoctorInviteSummary !== null ? 'View Assistants →' : 'Manage →'}
                                        </span>
                                    </div>
                                </Link>
                                <Link href="/dashboard/doctor/profile" className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg">
                                    <Users className="mb-4 h-8 w-8 text-[#E67E3C]" />
                                    <h3 className="mb-2 text-lg font-bold text-[#4a3428]">Profile</h3>
                                    <p className="text-sm text-gray-600">Edit credentials, availability, and portal settings.</p>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

function PermissionRow({ label, enabled }: { label: string; enabled: boolean }) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="font-medium text-gray-700">{label}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {enabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>
    );
}
