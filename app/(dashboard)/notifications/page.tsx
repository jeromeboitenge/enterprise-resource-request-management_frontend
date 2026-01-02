// Notifications Page

'use client';

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { formatRelativeTime } from '@/lib/formatters';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function NotificationsPage() {
    const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const readNotifications = notifications.filter((n) => n.isRead);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
                        <p className="text-gray-600 mt-1">
                            {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {unreadNotifications.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                            <CheckIcon className="h-5 w-5 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {/* Unread Notifications */}
                {unreadNotifications.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Unread ({unreadNotifications.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {unreadNotifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => markAsRead(notification._id)}
                                        className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {formatRelativeTime(notification.createdAt)}
                                                </p>
                                            </div>
                                            <div className="ml-4 h-2 w-2 bg-blue-600 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Read Notifications */}
                {readNotifications.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Earlier</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {readNotifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className="p-4 bg-gray-50 border-l-4 border-gray-300 rounded-lg"
                                    >
                                        <h3 className="font-semibold text-gray-700">{notification.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {formatRelativeTime(notification.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {notifications.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No notifications</h3>
                            <p className="text-gray-600">You're all caught up!</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
