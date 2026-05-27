'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, MessageSquare, Calendar, DollarSign, Settings as SettingsIcon, Clock, AlertTriangle } from 'lucide-react';
import {
    Notification,
    getNotificationsByUser,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
    getNotificationColor,
    getPriorityColor,
    getTimeAgo,
} from '@/data/notifications';

interface NotificationBellProps {
    role: 'admin' | 'doctor' | 'patient';
}

export default function NotificationBell({ role }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load notifications based on role
        const userNotifications = getNotificationsByUser(1, role);
        setNotifications(userNotifications);
    }, [role]);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = getUnreadCount(notifications);
    const filteredNotifications = notifications.slice(0, 5); // Show only 5 recent notifications

    const handleMarkAsRead = (notificationId: number) => {
        setNotifications(markAsRead(notificationId, notifications));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(markAllAsRead(notifications));
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }
        setIsOpen(false);
    };

    const getNotificationIcon = (type: string) => {
        const iconClass = "w-4 h-4";
        switch (type) {
            case 'message':
                return <MessageSquare className={iconClass} />;
            case 'appointment':
                return <Calendar className={iconClass} />;
            case 'payment':
                return <DollarSign className={iconClass} />;
            case 'system':
                return <SettingsIcon className={iconClass} />;
            case 'reminder':
                return <Clock className={iconClass} />;
            case 'alert':
                return <AlertTriangle className={iconClass} />;
            default:
                return <Bell className={iconClass} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-gray-100"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[400px] flex flex-col">
                    {/* Header */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-foreground">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-primary hover:text-primary-dark font-medium"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredNotifications.length === 0 ? (
                            <div className="p-6 text-center">
                                <Bell className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                                <p className="text-gray-500 text-sm">No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-accent' : ''
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-start space-x-2">
                                            {/* Icon */}
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                                                    notification.type
                                                )}`}
                                            >
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h4 className="text-xs font-semibold text-foreground line-clamp-1">
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2 mt-0.5"></span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                                                    {notification.message}
                                                </p>
                                                <span className="text-xs text-gray-400">
                                                    {getTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-gray-200">
                        <Link
                            href={`/dashboard/${role}/notifications`}
                            className="block text-center text-sm text-primary hover:text-primary-dark font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
