// Requests List Page

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
import { useRequestStore } from '@/lib/stores/requestStore';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { STATUSES, PRIORITIES } from '@/lib/constants';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';

export default function RequestsPage() {
    const router = useRouter();
    const { requests, isLoading, fetchRequests } = useRequestStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = () => {
        fetchRequests({ page: 1, limit: 50 });
    };

    const filteredRequests = requests.filter((request) => {
        const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || request.status === statusFilter;
        const matchesPriority = !priorityFilter || request.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Requests</h1>
                        <p className="text-gray-600 mt-1">Manage your resource requests</p>
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<PlusIcon className="h-5 w-5" />}
                        onClick={() => router.push('/requests/new')}
                    >
                        New Request
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                    ...Object.entries(STATUSES).map(([value, { label }]) => ({
                                        value,
                                        label,
                                    })),
                                ]}
                            />
                            <Select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Priorities' },
                                    ...Object.entries(PRIORITIES).map(([value, { label }]) => ({
                                        value,
                                        label,
                                    })),
                                ]}
                            />
                            <Button
                                variant="ghost"
                                leftIcon={<FunnelIcon className="h-5 w-5" />}
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('');
                                    setPriorityFilter('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Requests Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            All Requests ({filteredRequests.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={5} />
                        ) : filteredRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500 mb-4">
                                    {searchTerm || statusFilter || priorityFilter
                                        ? 'No requests match your filters'
                                        : 'No requests yet'}
                                </p>
                                {!searchTerm && !statusFilter && !priorityFilter && (
                                    <Button
                                        variant="primary"
                                        onClick={() => router.push('/requests/new')}
                                    >
                                        Create Your First Request
                                    </Button>
                                )}
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
                                        {filteredRequests.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{request.title}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-xs">
                                                            {request.description}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 capitalize">
                                                    {request.resourceType}
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
