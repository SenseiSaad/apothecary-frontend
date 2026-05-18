// Mock data for appointment requests and management
export interface AppointmentRequest {
    id: number;
    patientId: number;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    assistantId: number;
    requestedDate: string;
    requestedTime: string;
    alternativeDate1?: string;
    alternativeTime1?: string;
    alternativeDate2?: string;
    alternativeTime2?: string;
    duration: number;
    sessionType: 'Initial Consultation' | 'Follow-up' | 'Consultation' | 'Check-in' | 'Emergency';
    mode: 'Video Call' | 'Phone Call' | 'In-Person' | 'Chat';
    reason: string;
    urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
    status: 'Pending' | 'Approved' | 'Declined' | 'Rescheduled' | 'Cancelled';
    requestedAt: string;
    respondedAt?: string;
    AssistantNotes?: string;
}

export interface AppointmentAction {
    id: number;
    appointmentId: number;
    action: 'Approved' | 'Declined' | 'Rescheduled' | 'Cancelled' | 'Completed' | 'No Show';
    reason?: string;
    newDate?: string;
    newTime?: string;
    performedBy: string;
    performedAt: string;
}

// Sample appointment requests
export const appointmentRequests: AppointmentRequest[] = [
    {
        id: 1,
        patientId: 8,
        patientName: 'Jennifer Taylor',
        patientEmail: 'jennifer.taylor@example.com',
        patientPhone: '+1 (555) 789-0123',
        assistantId: 1,
        requestedDate: '2026-05-12',
        requestedTime: '10:00',
        alternativeDate1: '2026-05-12',
        alternativeTime1: '14:00',
        alternativeDate2: '2026-05-13',
        alternativeTime2: '10:00',
        duration: 60,
        sessionType: 'Follow-up',
        mode: 'Video Call',
        reason: 'Follow-up session to discuss parenting strategies and review progress on work-life balance goals.',
        urgency: 'Medium',
        status: 'Pending',
        requestedAt: '2026-05-08T09:30:00',
    },
    {
        id: 2,
        patientId: 9,
        patientName: 'Robert Martinez',
        patientEmail: 'robert.martinez@example.com',
        patientPhone: '+1 (555) 678-9012',
        assistantId: 1,
        requestedDate: '2026-05-09',
        requestedTime: '15:00',
        duration: 60,
        sessionType: 'Initial Consultation',
        mode: 'Video Call',
        reason: 'Seeking help with grief counseling after recent loss of family member. Need initial assessment and treatment planning.',
        urgency: 'High',
        status: 'Pending',
        requestedAt: '2026-05-08T11:15:00',
    },
    {
        id: 3,
        patientId: 10,
        patientName: 'Daniel Brown',
        patientEmail: 'daniel.brown@example.com',
        patientPhone: '+1 (555) 012-3456',
        assistantId: 1,
        requestedDate: '2026-05-15',
        requestedTime: '10:30',
        alternativeDate1: '2026-05-15',
        alternativeTime1: '14:30',
        duration: 60,
        sessionType: 'Consultation',
        mode: 'In-Person',
        reason: 'Regular Consultation to continue work on midlife transition and depression management.',
        urgency: 'Low',
        status: 'Pending',
        requestedAt: '2026-05-08T14:20:00',
    },
    {
        id: 4,
        patientId: 1,
        patientName: 'Sarah Johnson',
        patientEmail: 'sarah.johnson@example.com',
        patientPhone: '+1 (555) 123-4567',
        assistantId: 1,
        requestedDate: '2026-05-14',
        requestedTime: '09:00',
        duration: 60,
        sessionType: 'Consultation',
        mode: 'Video Call',
        reason: 'Continue CBT work on anxiety management. Want to discuss new work stressors.',
        urgency: 'Medium',
        status: 'Approved',
        requestedAt: '2026-05-07T16:00:00',
        respondedAt: '2026-05-07T17:30:00',
        AssistantNotes: 'Approved for requested time. Patient is making good progress.',
    },
    {
        id: 5,
        patientId: 11,
        patientName: 'Christopher Lee',
        patientEmail: 'chris.lee@example.com',
        patientPhone: '+1 (555) 890-1234',
        assistantId: 1,
        requestedDate: '2026-05-11',
        requestedTime: '16:00',
        duration: 60,
        sessionType: 'Check-in',
        mode: 'Phone Call',
        reason: 'Quick check-in after payment issue resolution. Want to resume Clinical Care.',
        urgency: 'Medium',
        status: 'Declined',
        requestedAt: '2026-05-08T10:00:00',
        respondedAt: '2026-05-08T12:00:00',
        AssistantNotes: 'Payment still showing as overdue in system. Please resolve payment before scheduling.',
    },
];

// Sample appointment actions history
export const appointmentActions: AppointmentAction[] = [
    {
        id: 1,
        appointmentId: 4,
        action: 'Approved',
        performedBy: 'Dr. Lisa Anderson',
        performedAt: '2026-05-07T17:30:00',
    },
    {
        id: 2,
        appointmentId: 5,
        action: 'Declined',
        reason: 'Payment overdue',
        performedBy: 'Dr. Lisa Anderson',
        performedAt: '2026-05-08T12:00:00',
    },
];

// Helper functions
export const getPendingRequests = (): AppointmentRequest[] => {
    return appointmentRequests.filter(req => req.status === 'Pending');
};

export const getRequestsByStatus = (status: string): AppointmentRequest[] => {
    if (status === 'All') return appointmentRequests;
    return appointmentRequests.filter(req => req.status === status);
};

export const getRequestById = (id: number): AppointmentRequest | undefined => {
    return appointmentRequests.find(req => req.id === id);
};

export const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
        case 'Emergency':
            return 'bg-red-100 text-red-700 border-red-300';
        case 'High':
            return 'bg-orange-100 text-orange-700 border-orange-300';
        case 'Medium':
            return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        case 'Low':
            return 'bg-green-100 text-green-700 border-green-300';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'Pending':
            return 'bg-yellow-100 text-yellow-700';
        case 'Approved':
            return 'bg-green-100 text-green-700';
        case 'Declined':
            return 'bg-red-100 text-red-700';
        case 'Rescheduled':
            return 'bg-blue-100 text-blue-700';
        case 'Cancelled':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

// Appointment conflict checker
export const checkTimeConflict = (date: string, time: string, duration: number, existingAppointments: any[]): boolean => {
    const requestedStart = new Date(`${date}T${time}`);
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);

    return existingAppointments.some(apt => {
        if (apt.date !== date) return false;

        const aptStart = new Date(`${apt.date}T${apt.startTime}`);
        const aptEnd = new Date(`${apt.date}T${apt.endTime}`);

        return (
            (requestedStart >= aptStart && requestedStart < aptEnd) ||
            (requestedEnd > aptStart && requestedEnd <= aptEnd) ||
            (requestedStart <= aptStart && requestedEnd >= aptEnd)
        );
    });
};

// Generate available time slots
export const generateAvailableSlots = (date: string, existingAppointments: any[]): string[] => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        if (!checkTimeConflict(date, time, 60, existingAppointments)) {
            slots.push(time);
        }
    }

    return slots;
};
