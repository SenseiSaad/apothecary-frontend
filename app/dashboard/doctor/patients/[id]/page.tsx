'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { hasRole } from '@/lib/auth';
import { getPatientById, type Patient } from '@/data/patients';
import { appointmentsData, formatDisplayDate, formatTime } from '@/data/schedule';

export default function PatientDetails() {
    const router = useRouter();
    const params = useParams();
    const patientId = parseInt(params.id as string);

    const [patient, setPatient] = useState<Patient | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'notes' | 'progress'>('overview');

    useEffect(() => {
        if (!hasRole('doctor')) {
            router.push('/auth/login');
        }

        const patientData = getPatientById(patientId);
        if (patientData) {
            setPatient(patientData);
        } else {
            router.push('/dashboard/doctor/patients');
        }
    }, [router, patientId]);

    if (!patient) {
        return (
            <DashboardLayout role="doctor">
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading patient details...</p>
                </div>
            </DashboardLayout>
        );
    }

    const patientSessions = appointmentsData.filter(apt => apt.patientId === patientId);
    const completedSessions = patientSessions.filter(apt => apt.status === 'Completed');
    const upcomingSessions = patientSessions.filter(apt => apt.status === 'Scheduled');

    // Mock session notes
    const sessionNotes = [
        {
            id: 1,
            date: '2026-05-07',
            duration: 60,
            type: 'Consultation',
            notes: 'Patient showed significant improvement in managing anxiety symptoms. Discussed coping strategies including deep breathing and progressive muscle relaxation. Homework assigned: Practice mindfulness meditation 10 minutes daily.',
            mood: 'Improved',
            nextSteps: 'Continue CBT techniques, monitor progress with anxiety journal',
        },
        {
            id: 2,
            date: '2026-05-01',
            duration: 60,
            type: 'Follow-up',
            notes: 'Reviewed homework from last session. Patient reported using breathing techniques successfully at work. Discussed triggers and developed action plan for high-stress situations.',
            mood: 'Stable',
            nextSteps: 'Introduce cognitive restructuring exercises',
        },
        {
            id: 3,
            date: '2026-04-24',
            duration: 60,
            type: 'Consultation',
            notes: 'Initial assessment completed. Patient presents with work-related anxiety and sleep disturbances. Established clinical goals: reduce anxiety symptoms, improve sleep quality, develop healthy coping mechanisms.',
            mood: 'Anxious',
            nextSteps: 'Begin CBT protocol, sleep hygiene education',
        },
    ];

    // Mock treatment plan
    const treatmentPlan = {
        diagnosis: 'Generalized Anxiety Disorder (GAD)',
        goals: [
            'Reduce anxiety symptoms by 50% within 3 months',
            'Improve sleep quality and duration',
            'Develop and consistently use healthy coping strategies',
            'Return to normal work productivity',
        ],
        interventions: [
            'Cognitive Behavioral Clinical Care (CBT)',
            'Mindfulness-Based Stress Reduction',
            'Relaxation techniques training',
            'Sleep hygiene education',
        ],
        progress: 'Patient is making good progress. Anxiety levels have decreased by approximately 35% based on self-reported measures. Sleep quality has improved. Patient is actively engaged in Clinical Care and completing homework assignments.',
    };

    return (
        <DashboardLayout role="doctor">
            <div className="space-y-6">
                {/* Back Button */}
                <Link
                    href="/dashboard/doctor/patients"
                    className="inline-flex items-center text-[#E67E3C] hover:text-[#d16b2a] font-medium"
                >
                    ← Back to Patients
                </Link>

                {/* Patient Header */}
                <div className="bg-gradient-to-r from-[#E67E3C] to-[#d16b2a] rounded-3xl p-8 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#E67E3C] text-4xl font-bold">
                                {patient.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{patient.name}</h2>
                                <p className="text-white/90 mb-3">{patient.age} years • {patient.gender}</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span>📧 {patient.email}</span>
                                    <span>📞 {patient.phone}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="mb-4">
                                <p className="text-white/80 text-sm mb-1">Progress</p>
                                <p className="text-4xl font-bold">{patient.progress}%</p>
                            </div>
                            <Link
                                href="/dashboard/doctor/chat"
                                className="inline-block bg-white text-[#E67E3C] px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                            >
                                💬 Message
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Total Sessions</p>
                        <p className="text-3xl font-bold text-[#4a3428]">{patient.totalSessions}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-600">{completedSessions.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Upcoming</p>
                        <p className="text-3xl font-bold text-blue-600">{upcomingSessions.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-gray-600 text-sm mb-1">Last Session</p>
                        <p className="text-lg font-bold text-[#E67E3C]">{patient.lastSession}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm">
                    <div className="border-b border-gray-200">
                        <div className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: '📋' },
                                { id: 'sessions', label: 'Session History', icon: '📅' },
                                { id: 'notes', label: 'Clinical Notes', icon: '📝' },
                                { id: 'progress', label: 'Progress & Goals', icon: '📈' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === tab.id
                                            ? 'border-[#E67E3C] text-[#E67E3C]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contact Information */}
                                    <div className="bg-[#fef3e8] rounded-2xl p-6">
                                        <h3 className="font-semibold text-[#4a3428] mb-4">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm text-gray-700">{patient.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="text-sm text-gray-700">{patient.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Joined Date</p>
                                                <p className="text-sm text-gray-700">{patient.joinedDate}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="bg-[#fef3e8] rounded-2xl p-6">
                                        <h3 className="font-semibold text-[#4a3428] mb-4">Emergency Contact</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Name</p>
                                                <p className="text-sm text-gray-700">{patient.emergencyContact.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Relationship</p>
                                                <p className="text-sm text-gray-700">{patient.emergencyContact.relationship}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="text-sm text-gray-700">{patient.emergencyContact.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Primary Concerns */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="font-semibold text-[#4a3428] mb-4">Primary Concerns</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.concerns.map((concern, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-[#E67E3C] text-white rounded-full text-sm font-medium"
                                            >
                                                {concern}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Medical History */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="font-semibold text-[#4a3428] mb-4">Medical History</h3>
                                    <p className="text-sm text-gray-700">{patient.medicalHistory}</p>
                                </div>

                                {/* Treatment Plan Summary */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="font-semibold text-[#4a3428] mb-4">Current Treatment Plan</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Diagnosis</p>
                                            <p className="font-medium text-gray-700">{treatmentPlan.diagnosis}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">Primary Goals</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                {treatmentPlan.goals.slice(0, 3).map((goal, index) => (
                                                    <li key={index} className="text-sm text-gray-700">{goal}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Appointment */}
                                {patient.nextAppointment && (
                                    <div className="bg-[#E67E3C] text-white rounded-2xl p-6">
                                        <h3 className="font-semibold mb-2">Next Appointment</h3>
                                        <p className="text-2xl font-bold">{patient.nextAppointment}</p>
                                        <button className="mt-4 bg-white text-[#E67E3C] px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Session History Tab */}
                        {activeTab === 'sessions' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-[#4a3428]">All Sessions</h3>
                                    <button className="bg-[#E67E3C] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#d16b2a]">
                                        Schedule New Session
                                    </button>
                                </div>
                                {patientSessions.map((session) => (
                                    <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-center min-w-[80px]">
                                                    <p className="text-sm font-bold text-[#E67E3C]">{formatTime(session.startTime)}</p>
                                                    <p className="text-xs text-gray-600">{formatDisplayDate(session.date)}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-700">{session.type}</p>
                                                    <p className="text-sm text-gray-600">{session.mode} • {session.duration} min</p>
                                                    <p className="text-xs text-gray-500 mt-1">{session.notes}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${session.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    session.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {session.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Clinical Notes Tab */}
                        {activeTab === 'notes' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-[#4a3428]">Clinical Notes</h3>
                                    <button className="bg-[#E67E3C] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#d16b2a]">
                                        + Add Note
                                    </button>
                                </div>
                                {sessionNotes.map((note) => (
                                    <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="font-semibold text-gray-700">{note.type}</p>
                                                <p className="text-sm text-gray-500">{formatDisplayDate(note.date)} • {note.duration} minutes</p>
                                            </div>
                                            <span className="px-3 py-1 bg-[#fef3e8] text-[#E67E3C] rounded-full text-xs font-medium">
                                                Mood: {note.mood}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Session Notes</p>
                                                <p className="text-sm text-gray-700">{note.notes}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Next Steps</p>
                                                <p className="text-sm text-gray-700">{note.nextSteps}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <button className="text-[#E67E3C] hover:text-[#d16b2a] text-sm font-medium">
                                                Edit
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Progress & Goals Tab */}
                        {activeTab === 'progress' && (
                            <div className="space-y-6">
                                {/* Progress Chart */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="font-semibold text-[#4a3428] mb-4">Overall Progress</h3>
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">Treatment Progress</span>
                                            <span className="text-2xl font-bold text-[#E67E3C]">{patient.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className="bg-[#E67E3C] h-4 rounded-full transition-all"
                                                style={{ width: `${patient.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{treatmentPlan.progress}</p>
                                </div>

                                {/* Treatment Goals */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="font-semibold text-[#4a3428] mb-4">Treatment Goals</h3>
                                    <div className="space-y-3">
                                        {treatmentPlan.goals.map((goal, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={index < 2}
                                                    className="mt-1 w-5 h-5 text-[#E67E3C] rounded"
                                                    readOnly
                                                />
                                                <span className={`text-sm ${index < 2 ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                                    {goal}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Interventions */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="font-semibold text-[#4a3428] mb-4">Current Interventions</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {treatmentPlan.interventions.map((intervention, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-[#fef3e8] text-[#6b4423] rounded-full text-sm font-medium"
                                            >
                                                {intervention}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Mood Tracking (Mock Chart) */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="font-semibold text-[#4a3428] mb-4">Mood Tracking (Last 7 Days)</h3>
                                    <div className="h-48 flex items-end justify-between space-x-2">
                                        {[7.2, 6.8, 7.5, 7.0, 7.8, 7.3, 7.6].map((mood, index) => {
                                            const height = (mood / 10) * 100;
                                            return (
                                                <div key={index} className="flex-1 flex flex-col items-center">
                                                    <div
                                                        className="w-full bg-[#E67E3C] rounded-t-lg"
                                                        style={{ height: `${height}%` }}
                                                        title={`Mood: ${mood}/10`}
                                                    ></div>
                                                    <span className="text-xs text-gray-500 mt-2">
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-4">Average mood: 7.3/10 (+1.5% from last week)</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
