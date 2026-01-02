// Request History Page

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { ResourceRequest } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { MagnifyingGlassIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function RequestHistoryPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<ResourceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setIsLoading(true);
            const data = await api.getRequests({ page: 1, limit: 1000 });
            setRequests(data.data);
        } catch (error) {
            console.error('Failed to load requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRequests = requests.filter((request) => {
        const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || request.status === statusFilter;
        const matchesYear = !yearFilter || new Date(request.createdAt).getFullYear().toString() === yearFilter;
        return matchesSearch && matchesStatus && matchesYear;
    });

    const years = Array.from(new Set(requests.map(r => new Date(r.createdAt).getFullYear()))).sort((a, b) => b - a);

    const stats = {
        total: filteredRequests.length,
        approved: filteredRequests.filter(r => r.status === 'approved' || r.status === 'funded' || r.status === 'fulfilled').length,
        rejected: filteredRequests.filter(r => r.status === 'rejected').length,
        pending: filteredRequests.filter(r => r.status === 'submitted' || r.status === 'under_review').length,
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Request History</h1>
                    <p className="text-gray-600 mt-1">View all historical requests and their outcomes</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <p className="text-blue-100 text-sm font-medium">Total Requests</p>
                            <p className="text-3xl font-bold mt-2">{stats.total}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <p className="text-green-100 text-sm font-medium">Approved</p>
                            <p className="text-3xl font-bold mt-2">{stats.approved}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <CardContent className="p-6">
                            <p className="text-red-100 text-sm font-medium">Rejected</p>
                            <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-6">
                            <p className="text-yellow-100 text-sm font-medium">Pending</p>
                            <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                placeholder="Search requests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                            />
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Statuses' },
                                    { value: 'submitted', label: 'Submitted' },
                                    { value: 'under_review', label: 'Under Review' },
                                    { value: 'approved', label: 'Approved' },
                                    { value: 'rejected', label: 'Rejected' },
                                    { value: 'funded', label: 'Funded' },
                                    { value: 'fulfilled', label: 'Fulfilled' },
                                    { value: 'cancelled', label: 'Cancelled' },
                                ]}
                            />
                            <Select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Years' },
                                    ...years.map(year => ({ value: year.toString(), label: year.toString() })),
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* History Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Request History ({filteredRequests.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={10} />
                        ) : filteredRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No requests found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredRequests.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {formatDate(request.createdAt)}
                                                </td>
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
