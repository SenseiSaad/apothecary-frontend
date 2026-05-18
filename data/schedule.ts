// Mock data for Assistant schedule
export interface Appointment {
    id: number;
    patientId: number;
    patientName: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
    type: 'Initial Consultation' | 'Follow-up' | 'Consultation' | 'Check-in' | 'Emergency';
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show' | 'Rescheduled';
    mode: 'Video Call' | 'Phone Call' | 'In-Person' | 'Chat';
    notes: string;
    concerns: string[];
}

export interface TimeSlot {
    time: string;
    available: boolean;
    appointmentId?: number;
}

export interface AvailabilitySlot {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

// Sample appointments for Assistant
export const appointmentsData: Appointment[] = [
    {
        id: 1,
        patientId: 1,
        patientName: 'Sarah Johnson',
        date: '2026-05-08',
        startTime: '09:00',
        endTime: '10:00',
        duration: 60,
        type: 'Consultation',
        status: 'Scheduled',
        mode: 'Video Call',
        notes: 'Continue CBT techniques for anxiety management',
        concerns: ['Anxiety', 'Work Stress'],
    },
    {
        id: 2,
        patientId: 2,
        patientName: 'Michael Chen',
        date: '2026-05-08',
        startTime: '10:30',
        endTime: '11:30',
        duration: 60,
        type: 'Follow-up',
        status: 'Scheduled',
        mode: 'Video Call',
        notes: 'Review communication exercises progress',
        concerns: ['Relationship Issues'],
    },
    {
        id: 3,
        patientId: 3,
        patientName: 'Emily Rodriguez',
        date: '2026-05-08',
        startTime: '14:00',
        endTime: '15:00',
        duration: 60,
        type: 'Consultation',
        status: 'Scheduled',
        mode: 'Video Call',
        notes: 'EMDR session for trauma processing',
        concerns: ['Depression', 'Trauma'],
    },
    {
        id: 4,
        patientId: 4,
        patientName: 'David Kim',
        date: '2026-05-08',
        startTime: '15:30',
        endTime: '16:30',
        duration: 60,
        type: 'Check-in',
        status: 'Scheduled',
        mode: 'Phone Call',
        notes: 'Quick check-in on stress management techniques',
        concerns: ['Work Stress', 'Burnout'],
    },
    {
        id: 5,
        patientId: 1,
        patientName: 'Sarah Johnson',
        date: '2026-05-09',
        startTime: '09:00',
        endTime: '10:00',
        duration: 60,
        type: 'Consultation',
        status: 'Scheduled',
        mode: 'Video Call',
        notes: 'Continue anxiety management strategies',
        concerns: ['Anxiety'],
    },
    {
        id: 6,
        patientId: 5,
        patientName: 'Jennifer Taylor',
        date: '2026-05-09',
        startTime: '11:00',
        endTime: '12:00',
        duration: 60,
        type: 'Follow-up',
        status: 'Scheduled',
        mode: 'Video Call',
        notes: 'Parenting strategies review',
        concerns: ['Parenting Stress'],
    },
    {
        id: 7,
        patientId: 3,
        patientName: 'Emily Rodriguez',
        date: '2026-05-10',
        startTime: '10:00',
        endTime: '11:00',
        duration: 60,
        type: 'Consultation',
        status: 'Scheduled',
        mode: 'Video Call',
        notes: 'Continue EMDR Clinical Care',
        concerns: ['PTSD', 'Anxiety'],
    },
    {
        id: 8,
        patientId: 2,
        patientName: 'Michael Chen',
        date: '2026-05-10',
        startTime: '14:00',
        endTime: '15:00',
        duration: 60,
        type: 'Consultation',
        status: 'Scheduled',
        mode: 'In-Person',
        notes: 'Couples communication workshop',
        concerns: ['Relationship Issues'],
    },
    // Past appointments
    {
        id: 9,
        patientId: 1,
        patientName: 'Sarah Johnson',
        date: '2026-05-07',
        startTime: '09:00',
        endTime: '10:00',
        duration: 60,
        type: 'Consultation',
        status: 'Completed',
        mode: 'Video Call',
        notes: 'Good progress on anxiety management',
        concerns: ['Anxiety'],
    },
    {
        id: 10,
        patientId: 4,
        patientName: 'David Kim',
        date: '2026-05-07',
        startTime: '15:00',
        endTime: '16:00',
        duration: 60,
        type: 'Initial Consultation',
        status: 'Completed',
        mode: 'Video Call',
        notes: 'Initial assessment completed. Identified work stress as primary concern.',
        concerns: ['Work Stress'],
    },
    {
        id: 11,
        patientId: 6,
        patientName: 'Amanda Foster',
        date: '2026-05-06',
        startTime: '10:00',
        endTime: '11:00',
        duration: 60,
        type: 'Consultation',
        status: 'Completed',
        mode: 'Video Call',
        notes: 'EMDR session went well. Patient showing improvement.',
        concerns: ['Trauma', 'PTSD'],
    },
    {
        id: 12,
        patientId: 7,
        patientName: 'Christopher Lee',
        date: '2026-05-05',
        startTime: '14:00',
        endTime: '15:00',
        duration: 60,
        type: 'Follow-up',
        status: 'No Show',
        mode: 'Video Call',
        notes: 'Patient did not attend. Payment issues noted.',
        concerns: ['Career Anxiety'],
    },
];

// Assistant availability settings
export const availabilitySettings: AvailabilitySlot[] = [
    { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Friday', startTime: '09:00', endTime: '15:00', isAvailable: true },
    { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: false },
    { day: 'Sunday', startTime: '00:00', endTime: '00:00', isAvailable: false },
];

// Helper functions
export const getAppointmentsByDate = (date: string): Appointment[] => {
    return appointmentsData.filter(apt => apt.date === date);
};

export const getAppointmentsByDateRange = (startDate: string, endDate: string): Appointment[] => {
    return appointmentsData.filter(apt => apt.date >= startDate && apt.date <= endDate);
};

export const getUpcomingAppointments = (): Appointment[] => {
    const today = new Date().toISOString().split('T')[0];
    return appointmentsData
        .filter(apt => apt.date >= today && apt.status === 'Scheduled')
        .sort((a, b) => {
            if (a.date === b.date) {
                return a.startTime.localeCompare(b.startTime);
            }
            return a.date.localeCompare(b.date);
        });
};

export const getPastAppointments = (): Appointment[] => {
    const today = new Date().toISOString().split('T')[0];
    return appointmentsData
        .filter(apt => apt.date < today || apt.status === 'Completed')
        .sort((a, b) => b.date.localeCompare(a.date));
};

export const getTodayAppointments = (): Appointment[] => {
    const today = new Date().toISOString().split('T')[0];
    return getAppointmentsByDate(today);
};

// Generate time slots for a day
export const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const appointments = getAppointmentsByDate(date);

    for (let hour = 8; hour <= 20; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const appointment = appointments.find(apt => apt.startTime === time);

        slots.push({
            time,
            available: !appointment,
            appointmentId: appointment?.id,
        });
    }

    return slots;
};

// Get week dates
export const getWeekDates = (startDate: Date): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
    }
    return dates;
};

// Format date helpers
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
};

export const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};
