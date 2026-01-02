// Activity Feed Page

'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { AuditLog } from '@/lib/types';
import { formatRelativeTime } from '@/lib/formatters';
import {
    ClockIcon,
    UserCircleIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function ActivityPage() {
    const [activities, setActivities] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            setIsLoading(true);
            const data = await api.getAuditLogs({ page: 1, limit: 50 });
            setActivities(data.data);
        } catch (error) {
            console.error('Failed to load activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getActivityIcon = (action: string) => {
        if (action.includes('create')) return <DocumentTextIcon className="h-5 w-5 text-green-600" />;
        if (action.includes('approve')) return <CheckCircleIcon className="h-5 w-5 text-blue-600" />;
        if (action.includes('reject')) return <XCircleIcon className="h-5 w-5 text-red-600" />;
        if (action.includes('update')) return <DocumentTextIcon className="h-5 w-5 text-yellow-600" />;
        return <UserCircleIcon className="h-5 w-5 text-gray-600" />;
    };

    const getActivityColor = (action: string) => {
        if (action.includes('create')) return 'green';
        if (action.includes('approve')) return 'blue';
        if (action.includes('reject')) return 'red';
        if (action.includes('update')) return 'yellow';
        return 'gray';
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Activity Feed</h1>
                    <p className="text-gray-600 mt-1">Recent activities and updates</p>
                </div>

                {/* Activity Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={8} />
                        ) : activities.length === 0 ? (
                            <div className="text-center py-12">
                                <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No recent activities</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activities.map((activity, index) => (
                                    <div key={activity._id} className="relative">
                                        {/* Timeline line */}
                                        {index !== activities.length - 1 && (
                                            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                                        )}

                                        {/* Activity item */}
                                        <div className="flex items-start space-x-4">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                {getActivityIcon(activity.action)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="font-semibold text-gray-800">
                                                                {activity.user.firstName} {activity.user.lastName}
                                                            </span>
                                                            <Badge variant={getActivityColor(activity.action)} size="sm">
                                                                {activity.action.replace(/_/g, ' ')}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            {activity.resource} • {activity.resourceId}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                                        {formatRelativeTime(activity.timestamp)}
                                                    </span>
                                                </div>

                                                {/* Details */}
                                                {activity.details && Object.keys(activity.details).length > 0 && (
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <pre className="bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                                                            {JSON.stringify(activity.details, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
