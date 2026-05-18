'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { hasRole, getSession } from '@/lib/auth';
import { apiRequest } from '@/lib/api';
import { StatCard, Button, Avatar, BarChart, ProgressBar } from '@/components/ui';
import {
    revenueData,
    sessionStats,
    AssistantPerformance,
    patientGrowth,
    getTotalRevenue,
    getAverageSessionsPerDay,
    getRevenueGrowth,
    sessionTimeDistribution,
    ClinicalCareTypes,
} from '@/data/analytics';

type LiveSummary = { totals: { patients: number; Assistants: number; staff: number } };
type AssistantStat = { assistant_id: string; email: string; status: string; assigned_doctor_count: number; permissions: { can_view_assigned_patients: boolean; can_manage_bookings: boolean; can_send_communications: boolean } };
type AssistantsRes = { Assistants: AssistantStat[] };

function nameFromEmail(e = '') { return e.split('@')[0].split(/[._-]+/).filter(Boolean).map((p: string) => p[0].toUpperCase() + p.slice(1)).join(' '); }

export default function AdminAnalytics() {
    const router = useRouter();
    const [summary, setSummary] = useState<LiveSummary | null>(null);
    const [liveAssistants, setLiveAssistants] = useState<AssistantStat[]>([]);
    const [isLoadingLive, setIsLoadingLive] = useState(true);

    useEffect(() => {
        if (!hasRole('admin')) { router.push('/auth/login'); return; }
        const s = getSession();
        if (!s) return;
        setIsLoadingLive(true);
        Promise.all([
            apiRequest<LiveSummary>('/admin/dashboard/summary', { token: s.access_token }),
            apiRequest<AssistantsRes>('/admin/assistants/active?page=1&limit=50', { token: s.access_token }),
        ]).then(([sumRes, cRes]) => {
            setSummary(sumRes.data || null);
            setLiveAssistants(cRes.data?.Assistants || []);
        }).catch(() => {}).finally(() => setIsLoadingLive(false));
    }, [router]);

    const totalRevenue = getTotalRevenue();
    const avgSessions = getAverageSessionsPerDay();
    const revenueGrowth = getRevenueGrowth();

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#4a3428]">📊 Analytics Dashboard</h2>
                        <p className="text-gray-600">Comprehensive platform insights and metrics</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                            Last 7 Days
                        </Button>
                        <Button size="sm">
                            Last 30 Days
                        </Button>
                        <Button variant="outline" size="sm">
                            📥 Export Report
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Revenue"
                        value={`$${totalRevenue.toLocaleString()}`}
                        change={`+${revenueGrowth}%`}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="from-green-500 to-green-600"
                        bgColor="bg-green-50"
                        showProgress
                        progressValue={75}
                    />
                    <StatCard
                        label="Total Sessions"
                        value={sessionStats.total.toString()}
                        change="+12%"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        }
                        color="from-blue-500 to-blue-600"
                        bgColor="bg-blue-50"
                        showProgress
                        progressValue={80}
                    />
                    <StatCard
                        label="Avg Sessions/Day"
                        value={avgSessions.toString()}
                        change="+8%"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                        color="from-[#E67E3C] to-[#d16b2a]"
                        bgColor="bg-orange-50"
                        showProgress
                        progressValue={65}
                    />
                    <StatCard
                        label="Completion Rate"
                        value={`${Math.round((sessionStats.completed / sessionStats.total) * 100)}%`}
                        change="+3%"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="from-green-500 to-green-600"
                        bgColor="bg-green-50"
                        showProgress
                        progressValue={Math.round((sessionStats.completed / sessionStats.total) * 100)}
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-xl font-bold text-[#4a3428] mb-4">Revenue Trend (Last 30 Days)</h3>
                        <div className="h-64 flex items-end justify-between space-x-1">
                            {revenueData.slice(-15).map((day, index) => {
                                const maxRevenue = Math.max(...revenueData.map(d => d.amount));
                                const height = (day.amount / maxRevenue) * 100;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center group">
                                        <div className="relative w-full">
                                            <div
                                                className="w-full bg-[#E67E3C] rounded-t-lg transition-all hover:bg-[#d16b2a] cursor-pointer"
                                                style={{ height: `${height * 2}px` }}
                                                title={`$${day.amount} - ${day.sessions} sessions`}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                                            {new Date(day.date).getDate()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                            <span>Daily Revenue</span>
                            <span className="font-medium">${Math.round(totalRevenue / 30).toLocaleString()}/day avg</span>
                        </div>
                    </div>

                    {/* Patient Growth Chart */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-xl font-bold text-[#4a3428] mb-4">Patient Growth (6 Months)</h3>
                        <div className="h-64 flex items-end justify-between space-x-2">
                            {patientGrowth.map((month, index) => {
                                const maxPatients = Math.max(...patientGrowth.map(m => m.activePatients));
                                const height = (month.activePatients / maxPatients) * 100;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full space-y-1">
                                            <div
                                                className="w-full bg-green-500 rounded-t-lg"
                                                style={{ height: `${height * 2}px` }}
                                                title={`${month.activePatients} active patients`}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-2 text-center">
                                            {month.month.split(' ')[0]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">New</p>
                                <p className="font-bold text-green-600">+{patientGrowth[patientGrowth.length - 1].newPatients}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Active</p>
                                <p className="font-bold text-blue-600">{patientGrowth[patientGrowth.length - 1].activePatients}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Churned</p>
                                <p className="font-bold text-red-600">-{patientGrowth[patientGrowth.length - 1].churnedPatients}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Session Time Distribution */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-xl font-bold text-[#4a3428] mb-4">Session Time Distribution</h3>
                        <div className="space-y-3">
                            {sessionTimeDistribution.map((slot, index) => {
                                const maxCount = Math.max(...sessionTimeDistribution.map(s => s.count));
                                const width = (slot.count / maxCount) * 100;
                                return (
                                    <div key={index} className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-600 w-20">{slot.time}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                                            <div
                                                className="bg-[#E67E3C] h-8 rounded-full flex items-center justify-end pr-3"
                                                style={{ width: `${width}%` }}
                                            >
                                                <span className="text-white text-sm font-medium">{slot.count}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Clinical Care Types */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-xl font-bold text-[#4a3428] mb-4">Popular Clinical Care Types</h3>
                        <div className="space-y-4">
                            {ClinicalCareTypes.map((type, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">{type.name}</span>
                                        <span className="text-sm text-gray-600">{type.sessions} sessions</span>
                                    </div>
                                    <div className="bg-gray-200 rounded-full h-3 relative">
                                        <div
                                            className="bg-gradient-to-r from-[#E67E3C] to-[#d16b2a] h-3 rounded-full"
                                            style={{ width: `${type.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">{type.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Assistant Performance Table */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-[#4a3428] mb-4">Assistant Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Assistant</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Patients</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sessions</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Completion Rate</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rating</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {AssistantPerformance.map((Assistant) => (
                                    <tr key={Assistant.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-[#E67E3C] rounded-full flex items-center justify-center text-white font-bold">
                                                    {Assistant.name.charAt(4)}
                                                </div>
                                                <span className="font-medium text-[#4a3428]">{Assistant.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">{Assistant.patients}</td>
                                        <td className="py-4 px-4 text-gray-700">{Assistant.totalSessions}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${Assistant.completionRate}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{Assistant.completionRate}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-1">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="font-medium text-gray-700">{Assistant.rating}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-semibold text-green-600">${Assistant.revenue.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Session Status Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-[#4a3428]">Completed Sessions</h4>
                            <span className="text-2xl">✅</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600">{sessionStats.completed}</p>
                        <p className="text-sm text-gray-600 mt-2">{Math.round((sessionStats.completed / sessionStats.total) * 100)}% of total</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-[#4a3428]">Cancelled Sessions</h4>
                            <span className="text-2xl">❌</span>
                        </div>
                        <p className="text-3xl font-bold text-red-600">{sessionStats.cancelled}</p>
                        <p className="text-sm text-gray-600 mt-2">{Math.round((sessionStats.cancelled / sessionStats.total) * 100)}% of total</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-[#4a3428]">Upcoming Sessions</h4>
                            <span className="text-2xl">📅</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{sessionStats.upcoming}</p>
                        <p className="text-sm text-gray-600 mt-2">Next 7 days</p>
                    </div>
                </div>

                {/* Live Assistant Overview */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-[#4a3428]">Live Assistant Overview</h3>
                            <p className="text-sm text-gray-500">Real-time data from backend — {isLoadingLive ? 'loading…' : `${liveAssistants.length} Assistants`}</p>
                        </div>
                        <Link href="/dashboard/admin/admin-assistants" className="text-sm font-medium text-[#E67E3C] hover:text-[#d16b2a]">Manage All →</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
                        {[
                            { label: 'Total Patients', value: summary?.totals.patients ?? '…', cls: 'text-blue-600' },
                            { label: 'Active Doctors', value: summary?.totals.Assistants ?? '…', cls: 'text-green-600' },
                            { label: 'Active Assistants', value: summary?.totals.staff ?? '…', cls: 'text-[#E67E3C]' },
                            { label: 'Unassigned', value: isLoadingLive ? '…' : liveAssistants.filter(c => c.assigned_doctor_count === 0).length, cls: 'text-amber-600' },
                        ].map(s => (
                            <div key={s.label} className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                                <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                    {!isLoadingLive && liveAssistants.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        {['assistant', 'Status', 'Doctors', 'View Pts', 'Bookings', 'Msgs'].map(h => (
                                            <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {liveAssistants.slice(0, 10).map(c => (
                                        <tr key={c.assistant_id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-[#E67E3C] flex items-center justify-center text-white text-xs font-bold">{(c.email[0] || 'C').toUpperCase()}</div>
                                                    <div>
                                                        <p className="text-sm font-medium text-[#4a3428]">{nameFromEmail(c.email)}</p>
                                                        <p className="text-xs text-gray-400">{c.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{c.status}</span></td>
                                            <td className="px-3 py-3 text-sm text-gray-600">{c.assigned_doctor_count}</td>
                                            <td className="px-3 py-3 text-center">{c.permissions.can_view_assigned_patients ? '✅' : '—'}</td>
                                            <td className="px-3 py-3 text-center">{c.permissions.can_manage_bookings ? '✅' : '—'}</td>
                                            <td className="px-3 py-3 text-center">{c.permissions.can_send_communications ? '✅' : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {liveAssistants.length > 10 && <p className="mt-3 text-center text-sm text-gray-400">Showing 10 of {liveAssistants.length}. <Link href="/dashboard/admin/admin-assistants" className="text-[#E67E3C] hover:underline">View all →</Link></p>}
                        </div>
                    )}
                    {!isLoadingLive && liveAssistants.length === 0 && (
                        <p className="py-6 text-center text-gray-400 text-sm">No active Assistants yet. <Link href="/dashboard/admin/admin-assistants" className="text-[#E67E3C] hover:underline">Invite one →</Link></p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
