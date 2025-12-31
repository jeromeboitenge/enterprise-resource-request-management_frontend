// Admin Dashboard Page

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import {
    UsersIcon,
    DocumentTextIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const statsData = await api.getDashboardStats();
            setStats(statsData);
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
                        Admin Dashboard ⚙️
                    </h1>
                    <p className="text-gray-600 mt-1">
                        System-wide overview and management
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                    <p className="text-yellow-100 text-sm font-medium">Pending Approvals</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : stats?.pendingApprovals || 0}
                                    </p>
                                </div>
                                <ChartBarIcon className="h-12 w-12 text-yellow-200" />
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

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Total Budget</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : `$${stats?.totalBudget || 0}`}
                                    </p>
                                </div>
                                <CurrencyDollarIcon className="h-12 w-12 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-indigo-100 text-sm font-medium">Budget Used</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : `$${stats?.usedBudget || 0}`}
                                    </p>
                                </div>
                                <ChartBarIcon className="h-12 w-12 text-indigo-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-100 text-sm font-medium">Active Users</p>
                                    <p className="text-3xl font-bold mt-2">0</p>
                                </div>
                                <UsersIcon className="h-12 w-12 text-teal-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div onClick={() => router.push('/admin/users')}>
                        <Card hover className="cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <UsersIcon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Manage Users</h3>
                                        <p className="text-sm text-gray-600">Add, edit, or deactivate users</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div onClick={() => router.push('/admin/departments')}>
                        <Card hover className="cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Manage Departments</h3>
                                        <p className="text-sm text-gray-600">Configure departments</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div onClick={() => router.push('/admin/reports')}>
                        <Card hover className="cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <ChartBarIcon className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">View Reports</h3>
                                        <p className="text-sm text-gray-600">Analytics and insights</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
