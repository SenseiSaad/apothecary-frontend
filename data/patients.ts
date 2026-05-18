// Mock data for patients
export interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    status: 'Active' | 'Inactive' | 'Pending' | 'On Hold';
    assignedAssistant: string;
    assistantId: number;
    joinedDate: string;
    lastSession: string;
    totalSessions: number;
    nextAppointment: string | null;
    subscriptionPlan: string;
    paymentStatus: 'Paid' | 'Pending' | 'Overdue';
    progress: number;
    concerns: string[];
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    medicalHistory: string;
    notes: string;
}

export const patientsData: Patient[] = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 123-4567',
        age: 28,
        gender: 'Female',
        status: 'Active',
        assignedAssistant: 'Dr. Lisa Anderson',
        assistantId: 1,
        joinedDate: '2026-01-15',
        lastSession: '2026-05-07',
        totalSessions: 12,
        nextAppointment: '2026-05-10 10:00 AM',
        subscriptionPlan: 'Deep Growth Pack',
        paymentStatus: 'Paid',
        progress: 85,
        concerns: ['Anxiety', 'Work Stress', 'Sleep Issues'],
        emergencyContact: {
            name: 'John Johnson',
            phone: '+1 (555) 123-4568',
            relationship: 'Spouse',
        },
        medicalHistory: 'No major medical conditions. Mild anxiety diagnosed in 2024.',
        notes: 'Making excellent progress. Very engaged in Consultations.',
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1 (555) 234-5678',
        age: 35,
        gender: 'Male',
        status: 'Active',
        assignedAssistant: 'Dr. James Wilson',
        assistantId: 2,
        joinedDate: '2026-02-20',
        lastSession: '2026-05-06',
        totalSessions: 8,
        nextAppointment: '2026-05-09 02:00 PM',
        subscriptionPlan: 'Starter Clinical Care Pack',
        paymentStatus: 'Paid',
        progress: 70,
        concerns: ['Relationship Issues', 'Communication'],
        emergencyContact: {
            name: 'Lisa Chen',
            phone: '+1 (555) 234-5679',
            relationship: 'Sister',
        },
        medicalHistory: 'Healthy. No current medications.',
        notes: 'Working on communication skills. Shows good commitment.',
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        phone: '+1 (555) 345-6789',
        age: 42,
        gender: 'Female',
        status: 'Active',
        assignedAssistant: 'Dr. Lisa Anderson',
        assistantId: 1,
        joinedDate: '2026-03-10',
        lastSession: '2026-05-05',
        totalSessions: 15,
        nextAppointment: '2026-05-11 11:00 AM',
        subscriptionPlan: 'Mindfulness Plus',
        paymentStatus: 'Paid',
        progress: 90,
        concerns: ['Depression', 'Life Transitions', 'Self-esteem'],
        emergencyContact: {
            name: 'Carlos Rodriguez',
            phone: '+1 (555) 345-6790',
            relationship: 'Brother',
        },
        medicalHistory: 'Depression (managed with medication). Takes Sertraline 50mg.',
        notes: 'Excellent progress. Very responsive to CBT techniques.',
    },
    {
        id: 4,
        name: 'David Kim',
        email: 'david.kim@example.com',
        phone: '+1 (555) 456-7890',
        age: 31,
        gender: 'Male',
        status: 'Active',
        assignedAssistant: 'Dr. Maria Garcia',
        assistantId: 3,
        joinedDate: '2026-04-05',
        lastSession: '2026-05-03',
        totalSessions: 5,
        nextAppointment: '2026-05-12 03:00 PM',
        subscriptionPlan: 'Starter Clinical Care Pack',
        paymentStatus: 'Paid',
        progress: 60,
        concerns: ['Work Stress', 'Burnout', 'Time Management'],
        emergencyContact: {
            name: 'Susan Kim',
            phone: '+1 (555) 456-7891',
            relationship: 'Mother',
        },
        medicalHistory: 'No significant medical history.',
        notes: 'New patient. Building rapport. Needs stress management techniques.',
    },
    {
        id: 5,
        name: 'Lisa Wang',
        email: 'lisa.wang@example.com',
        phone: '+1 (555) 567-8901',
        age: 26,
        gender: 'Female',
        status: 'Inactive',
        assignedAssistant: 'Dr. Robert Lee',
        assistantId: 4,
        joinedDate: '2025-11-20',
        lastSession: '2026-04-28',
        totalSessions: 20,
        nextAppointment: null,
        subscriptionPlan: 'Deep Growth Pack',
        paymentStatus: 'Paid',
        progress: 95,
        concerns: ['Anxiety', 'Social Phobia'],
        emergencyContact: {
            name: 'James Wang',
            phone: '+1 (555) 567-8902',
            relationship: 'Father',
        },
        medicalHistory: 'Generalized Anxiety Disorder. Takes Lexapro 10mg.',
        notes: 'Completed treatment plan. Moved to maintenance phase.',
    },
    {
        id: 6,
        name: 'Robert Martinez',
        email: 'robert.martinez@example.com',
        phone: '+1 (555) 678-9012',
        age: 45,
        gender: 'Male',
        status: 'Pending',
        assignedAssistant: 'Unassigned',
        assistantId: 0,
        joinedDate: '2026-05-07',
        lastSession: 'Never',
        totalSessions: 0,
        nextAppointment: null,
        subscriptionPlan: 'Starter Clinical Care Pack',
        paymentStatus: 'Pending',
        progress: 0,
        concerns: ['Grief', 'Loss'],
        emergencyContact: {
            name: 'Maria Martinez',
            phone: '+1 (555) 678-9013',
            relationship: 'Wife',
        },
        medicalHistory: 'Recent loss of family member. No other conditions.',
        notes: 'New registration. Awaiting Assistant assignment and initial consultation.',
    },
    {
        id: 7,
        name: 'Jennifer Taylor',
        email: 'jennifer.taylor@example.com',
        phone: '+1 (555) 789-0123',
        age: 33,
        gender: 'Female',
        status: 'Active',
        assignedAssistant: 'Dr. Sarah Brown',
        assistantId: 5,
        joinedDate: '2026-03-25',
        lastSession: '2026-05-04',
        totalSessions: 10,
        nextAppointment: '2026-05-13 09:00 AM',
        subscriptionPlan: 'Deep Growth Pack',
        paymentStatus: 'Paid',
        progress: 75,
        concerns: ['Parenting Stress', 'Work-Life Balance'],
        emergencyContact: {
            name: 'Mark Taylor',
            phone: '+1 (555) 789-0124',
            relationship: 'Husband',
        },
        medicalHistory: 'Postpartum depression (resolved). No current medications.',
        notes: 'Working on parenting strategies and self-care routines.',
    },
    {
        id: 8,
        name: 'Christopher Lee',
        email: 'chris.lee@example.com',
        phone: '+1 (555) 890-1234',
        age: 29,
        gender: 'Male',
        status: 'On Hold',
        assignedAssistant: 'Dr. James Wilson',
        assistantId: 2,
        joinedDate: '2026-02-15',
        lastSession: '2026-04-20',
        totalSessions: 6,
        nextAppointment: null,
        subscriptionPlan: 'Starter Clinical Care Pack',
        paymentStatus: 'Overdue',
        progress: 45,
        concerns: ['Career Anxiety', 'Decision Making'],
        emergencyContact: {
            name: 'Anna Lee',
            phone: '+1 (555) 890-1235',
            relationship: 'Sister',
        },
        medicalHistory: 'No significant medical history.',
        notes: 'Payment overdue. Sessions on hold until payment received.',
    },
    {
        id: 9,
        name: 'Amanda Foster',
        email: 'amanda.foster@example.com',
        phone: '+1 (555) 901-2345',
        age: 38,
        gender: 'Female',
        status: 'Active',
        assignedAssistant: 'Dr. Maria Garcia',
        assistantId: 3,
        joinedDate: '2026-01-30',
        lastSession: '2026-05-06',
        totalSessions: 14,
        nextAppointment: '2026-05-14 01:00 PM',
        subscriptionPlan: 'Mindfulness Plus',
        paymentStatus: 'Paid',
        progress: 82,
        concerns: ['Trauma', 'PTSD', 'Anxiety'],
        emergencyContact: {
            name: 'Sarah Foster',
            phone: '+1 (555) 901-2346',
            relationship: 'Mother',
        },
        medicalHistory: 'PTSD from past trauma. Takes Zoloft 100mg and Prazosin.',
        notes: 'Making steady progress with EMDR Clinical Care. Requires gentle approach.',
    },
    {
        id: 10,
        name: 'Daniel Brown',
        email: 'daniel.brown@example.com',
        phone: '+1 (555) 012-3456',
        age: 52,
        gender: 'Male',
        status: 'Active',
        assignedAssistant: 'Dr. Robert Lee',
        assistantId: 4,
        joinedDate: '2026-04-10',
        lastSession: '2026-05-05',
        totalSessions: 7,
        nextAppointment: '2026-05-15 10:30 AM',
        subscriptionPlan: 'Deep Growth Pack',
        paymentStatus: 'Paid',
        progress: 68,
        concerns: ['Midlife Crisis', 'Depression', 'Purpose'],
        emergencyContact: {
            name: 'Rachel Brown',
            phone: '+1 (555) 012-3457',
            relationship: 'Wife',
        },
        medicalHistory: 'Mild depression. Recently started on Wellbutrin 150mg.',
        notes: 'Exploring life purpose and career transition. Engaged in Clinical Care.',
    },
];

export const getPatientById = (id: number): Patient | undefined => {
    return patientsData.find(patient => patient.id === id);
};

export const getPatientsByAssistant = (assistantId: number): Patient[] => {
    return patientsData.filter(patient => patient.assistantId === assistantId);
};

export const getPatientsByStatus = (status: string): Patient[] => {
    if (status === 'All') return patientsData;
    return patientsData.filter(patient => patient.status === status);
};
