// Audit Logs Page

'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { AuditLog } from '@/lib/types';
import { formatDateTime } from '@/lib/formatters';
import { MagnifyingGlassIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('');

    useEffect(() => {
        loadAuditLogs();
    }, []);

    const loadAuditLogs = async () => {
        try {
            setIsLoading(true);
            const data = await api.getAuditLogs({ page: 1, limit: 100 });
            setLogs(data.data);
        } catch (error) {
            console.error('Failed to load audit logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLogs = logs.filter((log) => {
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = !actionFilter || log.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    const getActionColor = (action: string) => {
        if (action.includes('create')) return 'green';
        if (action.includes('update')) return 'blue';
        if (action.includes('delete')) return 'red';
        if (action.includes('approve')) return 'purple';
        return 'gray';
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Audit Logs</h1>
                    <p className="text-gray-600 mt-1">Track all system activities and changes</p>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                            />
                            <Select
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Actions' },
                                    { value: 'create_request', label: 'Create Request' },
                                    { value: 'update_request', label: 'Update Request' },
                                    { value: 'approve_request', label: 'Approve Request' },
                                    { value: 'reject_request', label: 'Reject Request' },
                                    { value: 'create_user', label: 'Create User' },
                                    { value: 'update_user', label: 'Update User' },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Log ({filteredLogs.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={10} />
                        ) : filteredLogs.length === 0 ? (
                            <div className="text-center py-12">
                                <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No audit logs found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredLogs.map((log) => (
                                            <tr key={log._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {formatDateTime(log.timestamp)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {log.user.firstName} {log.user.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{log.user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <Badge variant={getActionColor(log.action)}>
                                                        {log.action.replace(/_/g, ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {log.resourceType}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    <div className="max-w-xs truncate">
                                                        {JSON.stringify(log.details)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 font-mono">
                                                    {log.ipAddress}
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
