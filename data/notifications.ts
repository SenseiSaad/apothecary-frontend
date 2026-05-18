// Mock data for notifications
export interface Notification {
    id: number;
    userId: number;
    userRole: 'admin' | 'doctor' | 'patient';
    type: 'message' | 'appointment' | 'payment' | 'system' | 'reminder' | 'alert';
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    readAt?: string;
    metadata?: {
        patientName?: string;
        appointmentDate?: string;
        amount?: number;
        [key: string]: any;
    };
}

// Sample notifications for Assistant
export const AssistantNotifications: Notification[] = [
    {
        id: 1,
        userId: 1,
        userRole: 'doctor',
        type: 'appointment',
        title: 'New Appointment Request',
        message: 'Jennifer Taylor has requested an appointment for May 12, 2026 at 10:00 AM',
        actionUrl: '/dashboard/doctor/appointments',
        actionText: 'View Request',
        isRead: false,
        priority: 'high',
        createdAt: '2026-05-08T09:30:00',
        metadata: {
            patientName: 'Jennifer Taylor',
            appointmentDate: '2026-05-12',
        },
    },
    {
        id: 2,
        userId: 1,
        userRole: 'doctor',
        type: 'message',
        title: 'New Message from Sarah Johnson',
        message: 'Sarah sent you a message: "Thank you for the session today. The breathing exercises really helped!"',
        actionUrl: '/dashboard/doctor/chat',
        actionText: 'Reply',
        isRead: false,
        priority: 'medium',
        createdAt: '2026-05-08T10:15:00',
        metadata: {
            patientName: 'Sarah Johnson',
        },
    },
    {
        id: 3,
        userId: 1,
        userRole: 'doctor',
        type: 'reminder',
        title: 'Upcoming Session Reminder',
        message: 'You have a session with Michael Chen starting in 30 minutes (10:30 AM)',
        actionUrl: '/dashboard/doctor/schedule',
        actionText: 'View Schedule',
        isRead: false,
        priority: 'high',
        createdAt: '2026-05-08T10:00:00',
        metadata: {
            patientName: 'Michael Chen',
            appointmentDate: '2026-05-08',
        },
    },
    {
        id: 4,
        userId: 1,
        userRole: 'doctor',
        type: 'appointment',
        title: 'Appointment Cancelled',
        message: 'Christopher Lee has cancelled the appointment scheduled for May 11, 2026',
        actionUrl: '/dashboard/doctor/appointments',
        actionText: 'View Details',
        isRead: true,
        priority: 'medium',
        createdAt: '2026-05-08T08:00:00',
        readAt: '2026-05-08T08:30:00',
        metadata: {
            patientName: 'Christopher Lee',
            appointmentDate: '2026-05-11',
        },
    },
    {
        id: 5,
        userId: 1,
        userRole: 'doctor',
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of $150 received from Emily Rodriguez for session on May 7, 2026',
        actionUrl: '/dashboard/doctor/profile',
        actionText: 'View Earnings',
        isRead: true,
        priority: 'low',
        createdAt: '2026-05-07T18:00:00',
        readAt: '2026-05-07T19:00:00',
        metadata: {
            patientName: 'Emily Rodriguez',
            amount: 150,
        },
    },
    {
        id: 6,
        userId: 1,
        userRole: 'doctor',
        type: 'system',
        title: 'Profile Update Required',
        message: 'Your license information will expire in 60 days. Please update your credentials.',
        actionUrl: '/dashboard/doctor/profile',
        actionText: 'Update Profile',
        isRead: true,
        priority: 'medium',
        createdAt: '2026-05-07T09:00:00',
        readAt: '2026-05-07T10:00:00',
    },
    {
        id: 7,
        userId: 1,
        userRole: 'doctor',
        type: 'message',
        title: 'New Message from David Kim',
        message: 'David sent you a message: "Can we reschedule tomorrow\'s session?"',
        actionUrl: '/dashboard/doctor/chat',
        actionText: 'Reply',
        isRead: true,
        priority: 'medium',
        createdAt: '2026-05-07T16:30:00',
        readAt: '2026-05-07T17:00:00',
        metadata: {
            patientName: 'David Kim',
        },
    },
    {
        id: 8,
        userId: 1,
        userRole: 'doctor',
        type: 'alert',
        title: 'Session Notes Pending',
        message: 'You have 2 sessions without completed notes. Please complete documentation.',
        actionUrl: '/dashboard/doctor/notes',
        actionText: 'Complete Notes',
        isRead: false,
        priority: 'high',
        createdAt: '2026-05-08T07:00:00',
    },
];

// Sample notifications for admin
export const adminNotifications: Notification[] = [
    {
        id: 101,
        userId: 1,
        userRole: 'admin',
        type: 'system',
        title: 'New Assistant Registration',
        message: 'Dr. Robert Martinez has submitted an application to join as an Assistant',
        actionUrl: '/dashboard/admin/doctors',
        actionText: 'Review Application',
        isRead: false,
        priority: 'high',
        createdAt: '2026-05-08T11:00:00',
    },
    {
        id: 102,
        userId: 1,
        userRole: 'admin',
        type: 'payment',
        title: 'Payment Issue Detected',
        message: 'Payment failed for patient Christopher Lee. Account on hold.',
        actionUrl: '/dashboard/admin/patients',
        actionText: 'View Details',
        isRead: false,
        priority: 'high',
        createdAt: '2026-05-08T10:30:00',
        metadata: {
            patientName: 'Christopher Lee',
        },
    },
    {
        id: 103,
        userId: 1,
        userRole: 'admin',
        type: 'alert',
        title: 'High Session Volume',
        message: 'Platform experiencing 25% increase in session bookings this week',
        actionUrl: '/dashboard/admin/analytics',
        actionText: 'View Analytics',
        isRead: true,
        priority: 'medium',
        createdAt: '2026-05-08T09:00:00',
        readAt: '2026-05-08T09:30:00',
    },
    {
        id: 104,
        userId: 1,
        userRole: 'admin',
        type: 'system',
        title: 'System Maintenance Scheduled',
        message: 'Platform maintenance scheduled for May 15, 2026 from 2:00 AM - 4:00 AM',
        actionUrl: '/dashboard/admin/settings',
        actionText: 'View Schedule',
        isRead: true,
        priority: 'low',
        createdAt: '2026-05-07T14:00:00',
        readAt: '2026-05-07T15:00:00',
    },
];

// Helper functions
export const getNotificationsByUser = (userId: number, role: 'admin' | 'doctor' | 'patient'): Notification[] => {
    if (role === 'admin') return adminNotifications;
    if (role === 'doctor') return AssistantNotifications;
    return []; // Mock patient notifications for now
};

export const getUnreadCount = (notifications: Notification[]): number => {
    return notifications.filter(n => !n.isRead).length;
};

export const getUnreadNotifications = (notifications: Notification[]): Notification[] => {
    return notifications.filter(n => !n.isRead);
};

export const getNotificationsByType = (notifications: Notification[], type: string): Notification[] => {
    if (type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
};

export const markAsRead = (notificationId: number, notifications: Notification[]): Notification[] => {
    return notifications.map(n =>
        n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
    );
};

export const markAllAsRead = (notifications: Notification[]): Notification[] => {
    return notifications.map(n => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date().toISOString(),
    }));
};

export const getNotificationIcon = (type: string): string => {
    switch (type) {
        case 'message':
            return '💬';
        case 'appointment':
            return '📅';
        case 'payment':
            return '💰';
        case 'system':
            return '⚙️';
        case 'reminder':
            return '⏰';
        case 'alert':
            return '⚠️';
        default:
            return '🔔';
    }
};

export const getNotificationColor = (type: string): string => {
    switch (type) {
        case 'message':
            return 'bg-blue-100 text-blue-700';
        case 'appointment':
            return 'bg-green-100 text-green-700';
        case 'payment':
            return 'bg-purple-100 text-purple-700';
        case 'system':
            return 'bg-gray-100 text-gray-700';
        case 'reminder':
            return 'bg-yellow-100 text-yellow-700';
        case 'alert':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export const getPriorityColor = (priority: string): string => {
    switch (priority) {
        case 'high':
            return 'text-red-600';
        case 'medium':
            return 'text-yellow-600';
        case 'low':
            return 'text-green-600';
        default:
            return 'text-gray-600';
    }
};

export const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
};
