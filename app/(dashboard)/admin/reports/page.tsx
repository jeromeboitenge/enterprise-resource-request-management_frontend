// Reports and Analytics Page

'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import api from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';
import {
    ChartBarIcon,
    DocumentArrowDownIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';

export default function ReportsPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [reportType, setReportType] = useState('monthly');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setIsLoading(true);
            const data = await api.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async (type: string) => {
        try {
            const blob = await api.generateReport(type);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to export report:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
                        <p className="text-gray-600 mt-1">System-wide insights and reports</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            options={[
                                { value: 'monthly', label: 'Monthly Report' },
                                { value: 'quarterly', label: 'Quarterly Report' },
                                { value: 'yearly', label: 'Yearly Report' },
                            ]}
                        />
                        <Button
                            variant="primary"
                            leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
                            onClick={() => handleExport(reportType)}
                        >
                            Export PDF
                        </Button>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <p className="text-blue-100 text-sm font-medium">Total Requests</p>
                            <p className="text-3xl font-bold mt-2">{stats?.totalRequests || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <p className="text-green-100 text-sm font-medium">Approved</p>
                            <p className="text-3xl font-bold mt-2">{stats?.approvedRequests || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-6">
                            <p className="text-yellow-100 text-sm font-medium">Pending</p>
                            <p className="text-3xl font-bold mt-2">{stats?.pendingApprovals || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <p className="text-purple-100 text-sm font-medium">Total Budget</p>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats?.totalBudget || 0)}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Requests by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Chart visualization coming soon</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Integrate with Chart.js or Recharts
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Budget Utilization</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Chart visualization coming soon</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Integrate with Chart.js or Recharts
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Requests by Department</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Chart visualization coming soon</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Integrate with Chart.js or Recharts
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Chart visualization coming soon</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Integrate with Chart.js or Recharts
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Reports */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => handleExport('requests-by-status')}
                            >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                Requests by Status
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => handleExport('budget-report')}
                            >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                Budget Report
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => handleExport('department-summary')}
                            >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                Department Summary
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => handleExport('approval-metrics')}
                            >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                Approval Metrics
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => handleExport('user-activity')}
                            >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                User Activity
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => handleExport('financial-summary')}
                            >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                Financial Summary
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
