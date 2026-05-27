'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getSession, hasRole } from '@/lib/auth';
import { apiRequest } from '@/lib/api';
import { StatCard, Badge, Avatar, getStatusBadgeVariant } from '@/components/ui';

type RecentPatient = {
    patient_id: string;
    name: string;
    email: string;
    status: string;
    joined: string;
};

type DashboardSummary = {
    totals: {
        patients: number;
        Assistants: number;
        staff: number;
    };
    recent_patients: RecentPatient[];
};

export default function AdminDashboard() {
    const router = useRouter();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [summaryError, setSummaryError] = useState('');

    useEffect(() => {
        if (!hasRole('admin')) {
            router.push('/auth/login');
            return;
        }

        const session = getSession();
        if (!session) {
            router.push('/auth/login');
            return;
        }

        apiRequest<DashboardSummary>('/admin/dashboard/summary', {
            token: session.access_token,
        })
            .then((response) => {
                if (response.data) {
                    setSummary(response.data);
                }
            })
            .catch((error) => {
                setSummaryError(error instanceof Error ? error.message : 'Unable to load dashboard summary.');
            });
    }, [router]);

    const formatNumber = (value?: number) => value === undefined ? '...' : value.toLocaleString();

    const stats = [
        {
            label: 'Total Patients',
            value: formatNumber(summary?.totals.patients),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Active Assistants',
            value: formatNumber(summary?.totals.Assistants),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Sessions Today',
            value: '89',
            change: '+15%',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            color: 'from-primary to-primary-dark',
            bgColor: 'bg-orange-50'
        },
        {
            label: 'Revenue',
            value: '$45,678',
            change: '+8%',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50'
        },
    ];

    const recentPatients = summary?.recent_patients || [];

    const recentAssistants = [
        { id: 1, name: 'Dr. Lisa Anderson', specialty: 'Anxiety & Depression', patients: 28, rating: 4.9 },
        { id: 2, name: 'Dr. James Wilson', specialty: 'Relationship Counseling', patients: 32, rating: 4.8 },
        { id: 3, name: 'Dr. Maria Garcia', specialty: 'Stress Management', patients: 25, rating: 4.9 },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                {summaryError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {summaryError}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            change={stat.change}
                            color={stat.color}
                            bgColor={stat.bgColor}
                            showProgress
                            progressValue={75}
                        />
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sessions Chart */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-xl font-bold text-foreground mb-4">📊 Sessions Overview</h3>
                        <div className="h-64 flex items-end justify-around space-x-2">
                            {[65, 85, 75, 90, 80, 95, 88].map((height, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all hover:from-primary-dark hover:to-primary cursor-pointer shadow-md"
                                        style={{ height: `${height}%` }}
                                        title={`${height} sessions`}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-2 font-medium">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Assistants */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-xl font-bold text-foreground mb-4">Top Assistants</h3>
                        <div className="space-y-4">
                            {recentAssistants.map((Assistant) => (
                                <div key={Assistant.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Avatar name={Assistant.name} />
                                        <div>
                                            <p className="font-semibold text-foreground">{Assistant.name}</p>
                                            <p className="text-xs text-gray-600">{Assistant.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-foreground">{Assistant.patients} patients</p>
                                        <p className="text-xs text-gray-600">⭐ {Assistant.rating}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Patients Table */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-foreground">Recent Patients</h3>
                        <button className="text-primary hover:text-primary-dark font-medium text-sm">
                            View All →
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPatients.map((patient) => (
                                    <tr key={patient.patient_id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                                <Avatar name={patient.name} size="sm" />
                                                <span className="font-medium text-foreground">{patient.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{patient.email}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant={getStatusBadgeVariant(patient.status)}>
                                                {patient.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{new Date(patient.joined).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <button className="text-primary hover:text-primary-dark text-sm font-medium">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {recentPatients.length === 0 && (
                                    <tr>
                                        <td className="py-6 px-4 text-center text-gray-500" colSpan={5}>
                                            No recent patients found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
