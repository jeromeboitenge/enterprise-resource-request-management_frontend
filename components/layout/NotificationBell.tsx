// Notification Bell Component

'use client';

import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { formatRelativeTime } from '@/lib/formatters';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';

export const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleNotificationClick = (id: string) => {
        markAsRead(id);
    };

    const recentNotifications = notifications.slice(0, 5);

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
                {unreadCount > 0 ? (
                    <BellIconSolid className="h-6 w-6 text-blue-600" />
                ) : (
                    <BellIcon className="h-6 w-6" />
                )}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 animate-slideDown">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* Notifications list */}
                        <div className="max-h-96 overflow-y-auto">
                            {recentNotifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <BellIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                    <p>No notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {recentNotifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            onClick={() => handleNotificationClick(notification._id)}
                                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatRelativeTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="ml-2 h-2 w-2 bg-blue-600 rounded-full"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 5 && (
                            <div className="p-3 border-t text-center">
                                <a
                                    href="/notifications"
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    View all notifications
                                </a>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
