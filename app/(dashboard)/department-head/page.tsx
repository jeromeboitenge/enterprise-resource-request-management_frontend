// Department Head Dashboard Page

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { ResourceRequest } from '@/lib/types';
import {
    BuildingOfficeIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function DepartmentHeadDashboard() {
    const router = useRouter();
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
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Department Head Dashboard 🏢
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage department-wide resource requests and budget
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-indigo-100 text-sm font-medium">Department Requests</p>
                                    <p className="text-3xl font-bold mt-2">0</p>
                                </div>
                                <BuildingOfficeIcon className="h-12 w-12 text-indigo-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm font-medium">Pending Review</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : pendingApprovals.length}
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
                                    <p className="text-green-100 text-sm font-medium">Budget Used</p>
                                    <p className="text-3xl font-bold mt-2">$0</p>
                                </div>
                                <CurrencyDollarIcon className="h-12 w-12 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Approval Rate</p>
                                    <p className="text-3xl font-bold mt-2">0%</p>
                                </div>
                                <ChartBarIcon className="h-12 w-12 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Department Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Analytics coming soon</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
