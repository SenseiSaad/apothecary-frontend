'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { hasRole } from '@/lib/auth';
import {
    Notification,
    getNotificationsByUser,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
    getNotificationIcon,
    getNotificationColor,
    getPriorityColor,
    getTimeAgo,
} from '@/data/notifications';

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    useEffect(() => {
        if (!hasRole('doctor')) {
            router.push('/auth/login');
            return;
        }

        // Load notifications
        const userNotifications = getNotificationsByUser(1, 'doctor');
        setNotifications(userNotifications);
    }, [router]);

    const unreadCount = getUnreadCount(notifications);
    let filteredNotifications = getNotificationsByType(notifications, filter);

    if (showUnreadOnly) {
        filteredNotifications = filteredNotifications.filter(n => !n.isRead);
    }

    const handleMarkAsRead = (notificationId: number) => {
        setNotifications(markAsRead(notificationId, notifications));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(markAllAsRead(notifications));
    };

    const handleDeleteNotification = (notificationId: number) => {
        setNotifications(notifications.filter(n => n.id !== notificationId));
    };

    const notificationTypes = [
        { value: 'all', label: 'All', count: notifications.length },
        { value: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
        { value: 'appointment', label: 'Appointments', count: notifications.filter(n => n.type === 'appointment').length },
        { value: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
        { value: 'reminder', label: 'Reminders', count: notifications.filter(n => n.type === 'reminder').length },
        { value: 'alert', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length },
        { value: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
    ];

    return (
        <DashboardLayout role="doctor">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showUnreadOnly
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {showUnreadOnly ? 'Show All' : 'Unread Only'}
                            </button>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                                >
                                    Mark All as Read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                        {notificationTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setFilter(type.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === type.value
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {type.label} ({type.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <div className="text-6xl mb-4">🔔</div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No Notifications</h3>
                            <p className="text-gray-600">
                                {showUnreadOnly
                                    ? 'You have no unread notifications'
                                    : filter === 'all'
                                        ? 'You have no notifications yet'
                                        : `You have no ${filter} notifications`}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-md ${!notification.isRead ? 'border-l-4 border-primary' : ''
                                    }`}
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Icon */}
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                                            notification.type
                                        )}`}
                                    >
                                        <span className="text-2xl">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="text-lg font-semibold text-foreground">
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                    )}
                                                    {notification.priority === 'high' && (
                                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(notification.priority)} bg-red-50`}>
                                                            High Priority
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-400">
                                                    <span>{getTimeAgo(notification.createdAt)}</span>
                                                    <span className="capitalize">{notification.type}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-3 mt-4">
                                            {notification.actionUrl && notification.actionText && (
                                                <Link
                                                    href={notification.actionUrl}
                                                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                                                >
                                                    {notification.actionText}
                                                </Link>
                                            )}
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                                >
                                                    Mark as Read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteNotification(notification.id)}
                                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Stats Footer */}
                {notifications.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-primary">{notifications.length}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Notifications</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-primary">{unreadCount}</p>
                                <p className="text-sm text-gray-600 mt-1">Unread</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-primary">
                                    {notifications.filter(n => n.priority === 'high').length}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">High Priority</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
