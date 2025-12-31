// Manager Dashboard Page

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
import { ResourceRequest } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/formatters';
import {
    ClockIcon,
    CheckCircleIcon,
    UsersIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function ManagerDashboard() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [pendingApprovals, setPendingApprovals] = useState<ResourceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const approvals = await api.getPendingApprovals();
            setPendingApprovals(approvals);
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
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manager Dashboard 📊
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Review and approve team resource requests
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Pending Approvals</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : pendingApprovals.length}
                                    </p>
                                </div>
                                <ClockIcon className="h-12 w-12 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Approved Today</p>
                                    <p className="text-3xl font-bold mt-2">0</p>
                                </div>
                                <CheckCircleIcon className="h-12 w-12 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Team Requests</p>
                                    <p className="text-3xl font-bold mt-2">0</p>
                                </div>
                                <UsersIcon className="h-12 w-12 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Approvals */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Pending Approvals</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/approvals')}
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
                        ) : pendingApprovals.length === 0 ? (
                            <div className="text-center py-12">
                                <CheckCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No pending approvals</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pendingApprovals.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                    {request.title}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {request.requestedBy.firstName} {request.requestedBy.lastName}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900">
                                                    {formatCurrency(request.estimatedCost)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <PriorityBadge priority={request.priority} />
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {formatDate(request.createdAt)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => router.push(`/requests/${request._id}`)}
                                                    >
                                                        Review
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
