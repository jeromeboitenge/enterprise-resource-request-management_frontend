// Finance Dashboard Page

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { ResourceRequest } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/formatters';
import {
    CurrencyDollarIcon,
    ClockIcon,
    CheckCircleIcon,
    BanknotesIcon,
} from '@heroicons/react/24/outline';

export default function FinanceDashboard() {
    const router = useRouter();
    const [fundingQueue, setFundingQueue] = useState<ResourceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const queue = await api.getFundingQueue();
            setFundingQueue(queue);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Finance Dashboard 💰
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage budget approvals and funding
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Awaiting Funding</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : fundingQueue.length}
                                    </p>
                                </div>
                                <ClockIcon className="h-12 w-12 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Budget</p>
                                    <p className="text-3xl font-bold mt-2">$0</p>
                                </div>
                                <CurrencyDollarIcon className="h-12 w-12 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Funded This Month</p>
                                    <p className="text-3xl font-bold mt-2">$0</p>
                                </div>
                                <BanknotesIcon className="h-12 w-12 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-100 text-sm font-medium">Completed</p>
                                    <p className="text-3xl font-bold mt-2">0</p>
                                </div>
                                <CheckCircleIcon className="h-12 w-12 text-teal-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Funding Queue</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/finance/funding')}
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
                        ) : fundingQueue.length === 0 ? (
                            <div className="text-center py-12">
                                <CheckCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No requests awaiting funding</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {fundingQueue.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                    {request.title}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {request.department.name}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900 font-semibold">
                                                    {formatCurrency(request.estimatedCost)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <StatusBadge status={request.status} />
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {formatDate(request.createdAt)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => router.push(`/requests/${request._id}`)}
                                                    >
                                                        Fund
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
