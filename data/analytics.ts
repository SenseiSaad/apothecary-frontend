// Mock data for analytics
export interface RevenueData {
    date: string;
    amount: number;
    sessions: number;
}

export interface SessionStats {
    total: number;
    completed: number;
    cancelled: number;
    upcoming: number;
}

export interface AssistantPerformance {
    id: number;
    name: string;
    totalSessions: number;
    completionRate: number;
    rating: number;
    revenue: number;
    patients: number;
}

export interface PatientGrowth {
    month: string;
    newPatients: number;
    activePatients: number;
    churnedPatients: number;
}

// Revenue data for last 30 days
export const revenueData: RevenueData[] = [
    { date: '2026-04-08', amount: 1200, sessions: 15 },
    { date: '2026-04-09', amount: 1450, sessions: 18 },
    { date: '2026-04-10', amount: 980, sessions: 12 },
    { date: '2026-04-11', amount: 1680, sessions: 21 },
    { date: '2026-04-12', amount: 1320, sessions: 16 },
    { date: '2026-04-13', amount: 890, sessions: 11 },
    { date: '2026-04-14', amount: 1540, sessions: 19 },
    { date: '2026-04-15', amount: 1750, sessions: 22 },
    { date: '2026-04-16', amount: 1420, sessions: 17 },
    { date: '2026-04-17', amount: 1180, sessions: 14 },
    { date: '2026-04-18', amount: 1620, sessions: 20 },
    { date: '2026-04-19', amount: 1390, sessions: 17 },
    { date: '2026-04-20', amount: 920, sessions: 11 },
    { date: '2026-04-21', amount: 1480, sessions: 18 },
    { date: '2026-04-22', amount: 1650, sessions: 20 },
    { date: '2026-04-23', amount: 1280, sessions: 16 },
    { date: '2026-04-24', amount: 1520, sessions: 19 },
    { date: '2026-04-25', amount: 1780, sessions: 22 },
    { date: '2026-04-26', amount: 1340, sessions: 16 },
    { date: '2026-04-27', amount: 980, sessions: 12 },
    { date: '2026-04-28', amount: 1620, sessions: 20 },
    { date: '2026-04-29', amount: 1450, sessions: 18 },
    { date: '2026-04-30', amount: 1180, sessions: 14 },
    { date: '2026-05-01', amount: 1720, sessions: 21 },
    { date: '2026-05-02', amount: 1580, sessions: 19 },
    { date: '2026-05-03', amount: 1240, sessions: 15 },
    { date: '2026-05-04', amount: 1680, sessions: 21 },
    { date: '2026-05-05', amount: 1820, sessions: 23 },
    { date: '2026-05-06', amount: 1490, sessions: 18 },
    { date: '2026-05-07', amount: 1650, sessions: 20 },
];

// Session statistics
export const sessionStats: SessionStats = {
    total: 523,
    completed: 478,
    cancelled: 28,
    upcoming: 17,
};

// Assistant performance data
export const AssistantPerformance: AssistantPerformance[] = [
    {
        id: 1,
        name: 'Dr. Lisa Anderson',
        totalSessions: 142,
        completionRate: 96,
        rating: 4.9,
        revenue: 12780,
        patients: 28,
    },
    {
        id: 2,
        name: 'Dr. James Wilson',
        totalSessions: 128,
        completionRate: 94,
        rating: 4.8,
        revenue: 11520,
        patients: 32,
    },
    {
        id: 3,
        name: 'Dr. Maria Garcia',
        totalSessions: 115,
        completionRate: 97,
        rating: 4.9,
        revenue: 10350,
        patients: 25,
    },
    {
        id: 4,
        name: 'Dr. Robert Lee',
        totalSessions: 89,
        completionRate: 92,
        rating: 4.7,
        revenue: 8010,
        patients: 18,
    },
    {
        id: 5,
        name: 'Dr. Sarah Brown',
        totalSessions: 49,
        completionRate: 95,
        rating: 4.8,
        revenue: 4410,
        patients: 22,
    },
];

// Patient growth data (last 6 months)
export const patientGrowth: PatientGrowth[] = [
    { month: 'Dec 2025', newPatients: 45, activePatients: 180, churnedPatients: 8 },
    { month: 'Jan 2026', newPatients: 52, activePatients: 224, churnedPatients: 6 },
    { month: 'Feb 2026', newPatients: 68, activePatients: 286, churnedPatients: 10 },
    { month: 'Mar 2026', newPatients: 74, activePatients: 350, churnedPatients: 12 },
    { month: 'Apr 2026', newPatients: 89, activePatients: 427, churnedPatients: 9 },
    { month: 'May 2026', newPatients: 42, activePatients: 460, churnedPatients: 5 },
];

// Calculate totals
export const getTotalRevenue = (): number => {
    return revenueData.reduce((sum, day) => sum + day.amount, 0);
};

export const getAverageSessionsPerDay = (): number => {
    const total = revenueData.reduce((sum, day) => sum + day.sessions, 0);
    return Math.round(total / revenueData.length);
};

export const getRevenueGrowth = (): number => {
    const lastWeek = revenueData.slice(-7).reduce((sum, day) => sum + day.amount, 0);
    const previousWeek = revenueData.slice(-14, -7).reduce((sum, day) => sum + day.amount, 0);
    return Math.round(((lastWeek - previousWeek) / previousWeek) * 100);
};

// Session distribution by time
export interface SessionTimeDistribution {
    time: string;
    count: number;
}

export const sessionTimeDistribution: SessionTimeDistribution[] = [
    { time: '8-10 AM', count: 45 },
    { time: '10-12 PM', count: 78 },
    { time: '12-2 PM', count: 52 },
    { time: '2-4 PM', count: 89 },
    { time: '4-6 PM', count: 112 },
    { time: '6-8 PM', count: 95 },
    { time: '8-10 PM', count: 52 },
];

// Popular Clinical Care types
export interface ClinicalCareType {
    name: string;
    sessions: number;
    percentage: number;
}

export const ClinicalCareTypes: ClinicalCareType[] = [
    { name: 'Anxiety & Depression', sessions: 185, percentage: 35 },
    { name: 'Relationship Counseling', sessions: 142, percentage: 27 },
    { name: 'Stress Management', sessions: 98, percentage: 19 },
    { name: 'Trauma & PTSD', sessions: 63, percentage: 12 },
    { name: 'Other', sessions: 35, percentage: 7 },
];
