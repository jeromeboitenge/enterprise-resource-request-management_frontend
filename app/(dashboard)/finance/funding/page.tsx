// Finance Funding Page

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { ResourceRequest } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/formatters';
import {
    BanknotesIcon,
    CheckCircleIcon,
    DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';

export default function FundingPage() {
    const router = useRouter();
    const [fundingQueue, setFundingQueue] = useState<ResourceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFundModal, setShowFundModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);
    const [paymentReference, setPaymentReference] = useState('');

    useEffect(() => {
        loadFundingQueue();
    }, []);

    const loadFundingQueue = async () => {
        try {
            setIsLoading(true);
            const queue = await api.getFundingQueue();
            setFundingQueue(queue);
        } catch (error) {
            console.error('Failed to load funding queue:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFund = async () => {
        if (!selectedRequest) return;

        try {
            await api.fundRequest(selectedRequest._id, {
                paymentReference,
                paymentDate: new Date().toISOString(),
            });
            setShowFundModal(false);
            setPaymentReference('');
            setSelectedRequest(null);
            loadFundingQueue();
        } catch (error) {
            console.error('Failed to fund request:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Funding Queue</h1>
                    <p className="text-gray-600 mt-1">Process approved requests for funding</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Awaiting Funding</p>
                                    <p className="text-3xl font-bold mt-2">{fundingQueue.length}</p>
                                </div>
                                <BanknotesIcon className="h-12 w-12 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Amount</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {formatCurrency(fundingQueue.reduce((sum, r) => sum + r.estimatedCost, 0))}
                                    </p>
                                </div>
                                <BanknotesIcon className="h-12 w-12 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Funded Today</p>
                                    <p className="text-3xl font-bold mt-2">0</p>
                                </div>
                                <CheckCircleIcon className="h-12 w-12 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Funding Queue Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Requests Ready for Funding</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={5} />
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
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {fundingQueue.map((request) => (
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
                                                    <StatusBadge status={request.status} />
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {formatDate(request.updatedAt)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => router.push(`/requests/${request._id}`)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setShowFundModal(true);
                                                            }}
                                                        >
                                                            Fund
                                                        </Button>
                                                    </div>
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

            {/* Fund Modal */}
            <Modal
                isOpen={showFundModal}
                onClose={() => {
                    setShowFundModal(false);
                    setSelectedRequest(null);
                    setPaymentReference('');
                }}
                title="Fund Request"
            >
                {selectedRequest && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">{selectedRequest.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{selectedRequest.description}</p>
                            <p className="text-lg font-bold text-gray-900">
                                Amount: {formatCurrency(selectedRequest.estimatedCost)}
                            </p>
                        </div>

                        <Input
                            label="Payment Reference *"
                            placeholder="e.g., TXN-2024-001"
                            value={paymentReference}
                            onChange={(e) => setPaymentReference(e.target.value)}
                            leftIcon={<DocumentArrowUpIcon className="h-5 w-5 text-gray-400" />}
                        />

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowFundModal(false);
                                    setSelectedRequest(null);
                                    setPaymentReference('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="success"
                                onClick={handleFund}
                                disabled={!paymentReference}
                            >
                                Confirm Funding
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
