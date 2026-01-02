// Approvals Page

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { ResourceRequest } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ApprovalsPage() {
    const router = useRouter();
    const [pendingApprovals, setPendingApprovals] = useState<ResourceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadApprovals();
    }, []);

    const loadApprovals = async () => {
        try {
            setIsLoading(true);
            const approvals = await api.getPendingApprovals();
            setPendingApprovals(approvals);
        } catch (error) {
            console.error('Failed to load approvals:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Pending Approvals</h1>
                    <p className="text-gray-600 mt-1">
                        Review and approve resource requests
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm font-medium">Pending Review</p>
                                    <p className="text-3xl font-bold mt-2">{pendingApprovals.length}</p>
                                </div>
                                <ClockIcon className="h-12 w-12 text-yellow-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">High Priority</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {pendingApprovals.filter((r) => r.priority === 'high' || r.priority === 'urgent').length}
                                    </p>
                                </div>
                                <CheckCircleIcon className="h-12 w-12 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Total Value</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {formatCurrency(
                                            pendingApprovals.reduce((sum, r) => sum + r.estimatedCost, 0)
                                        )}
                                    </p>
                                </div>
                                <CheckCircleIcon className="h-12 w-12 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Approvals Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Requests Awaiting Your Approval</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={5} />
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
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pendingApprovals.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{request.title}</p>
                                                        <p className="text-xs text-gray-500 capitalize">{request.resourceType}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {request.requestedBy.firstName} {request.requestedBy.lastName}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {request.department.name}
                                                </td>
                                                <td className="px-4 py-4 text-sm font-semibold text-gray-900">
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
