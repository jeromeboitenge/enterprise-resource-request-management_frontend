// Employee Dashboard Page

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Loader';
import { useAuthStore } from '@/lib/stores/authStore';
import api from '@/lib/api';
import { ResourceRequest, DashboardStats } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/formatters';
import {
    PlusIcon,
    DocumentTextIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function EmployeeDashboard() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentRequests, setRecentRequests] = useState<ResourceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const [statsData, requestsData] = await Promise.all([
                api.getDashboardStats(),
                api.getRequests({ page: 1, limit: 5 }),
            ]);
            setStats(statsData);
            setRecentRequests(requestsData.data);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome back, {user?.firstName}! 👋
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Here's an overview of your resource requests
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<PlusIcon className="h-5 w-5" />}
                        onClick={() => router.push('/requests/new')}
                    >
                        New Request
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Requests</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalRequests || 0}
                                    </p>
                                </div>
                                <DocumentTextIcon className="h-12 w-12 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm font-medium">Pending</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : stats?.pendingApprovals || 0}
                                    </p>
                                </div>
                                <ClockIcon className="h-12 w-12 text-yellow-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Approved</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : stats?.approvedRequests || 0}
                                    </p>
                                </div>
                                <CheckCircleIcon className="h-12 w-12 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm font-medium">Rejected</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : stats?.rejectedRequests || 0}
                                    </p>
                                </div>
                                <XCircleIcon className="h-12 w-12 text-red-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Requests */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Requests</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/requests')}
                            >
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-20 w-full" />
                                ))}
                            </div>
                        ) : recentRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">No requests yet</p>
                                <Button
                                    variant="primary"
                                    onClick={() => router.push('/requests/new')}
                                >
                                    Create Your First Request
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {recentRequests.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                    {request.title}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 capitalize">
                                                    {request.resourceType}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900">
                                                    {formatCurrency(request.estimatedCost)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <PriorityBadge priority={request.priority} />
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <StatusBadge status={request.status} />
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {formatDate(request.createdAt)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/requests/${request._id}`)}
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
