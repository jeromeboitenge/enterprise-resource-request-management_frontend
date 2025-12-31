// Request Details Page

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge, Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loader';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRequestStore } from '@/lib/stores/requestStore';
import api from '@/lib/api';
import { formatDate, formatCurrency, formatRelativeTime } from '@/lib/formatters';
import { canApproveRequest, canEditRequest, canCancelRequest } from '@/lib/permissions';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

export default function RequestDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const { currentRequest, fetchRequestById, isLoading } = useRequestStore();
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
    const [approvalComment, setApprovalComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchRequestById(params.id as string);
        }
    }, [params.id]);

    const handleApproval = async () => {
        if (!currentRequest) return;

        try {
            setIsSubmitting(true);
            await api.approveRequest(currentRequest._id, {
                action: approvalAction,
                comments: approvalComment,
            });
            setShowApprovalModal(false);
            setApprovalComment('');
            // Refresh request data
            fetchRequestById(currentRequest._id);
        } catch (error) {
            console.error('Failed to process approval:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!currentRequest) return;

        if (confirm('Are you sure you want to cancel this request?')) {
            try {
                await api.cancelRequest(currentRequest._id);
                fetchRequestById(currentRequest._id);
            } catch (error) {
                console.error('Failed to cancel request:', error);
            }
        }
    };

    if (isLoading || !currentRequest) {
        return (
            <DashboardLayout>
                <PageLoader />
            </DashboardLayout>
        );
    }

    const canApprove = user && canApproveRequest(user, currentRequest);
    const canEdit = user && canEditRequest(user, currentRequest);
    const canCancel = user && canCancelRequest(user, currentRequest);

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{currentRequest.title}</h1>
                            <p className="text-gray-600 mt-1">
                                Request ID: {currentRequest._id.slice(-8).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {canEdit && (
                            <Button
                                variant="secondary"
                                onClick={() => router.push(`/requests/${currentRequest._id}/edit`)}
                            >
                                Edit
                            </Button>
                        )}
                        {canCancel && (
                            <Button variant="danger" onClick={handleCancel}>
                                Cancel Request
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Request Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Description</label>
                                    <p className="mt-1 text-gray-800">{currentRequest.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Resource Type</label>
                                        <p className="mt-1 text-gray-800 capitalize">{currentRequest.resourceType}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Quantity</label>
                                        <p className="mt-1 text-gray-800">{currentRequest.quantity}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Estimated Cost</label>
                                        <p className="mt-1 text-gray-800 font-semibold">
                                            {formatCurrency(currentRequest.estimatedCost)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Department</label>
                                        <p className="mt-1 text-gray-800">{currentRequest.department.name}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Approval Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Approval Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {currentRequest.approvals.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No approvals yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {currentRequest.approvals.map((approval, index) => (
                                            <div key={approval._id} className="flex items-start space-x-4">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${approval.action === 'approve' ? 'bg-green-100' : 'bg-red-100'
                                                    }`}>
                                                    {approval.action === 'approve' ? (
                                                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                                    ) : (
                                                        <XCircleIcon className="h-6 w-6 text-red-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-gray-800">
                                                            {approval.approver.firstName} {approval.approver.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatRelativeTime(approval.timestamp)}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        {approval.approverRole.replace('_', ' ')} • {approval.action}d
                                                    </p>
                                                    {approval.comments && (
                                                        <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                            {approval.comments}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Approval Actions */}
                        {canApprove && (
                            <Card className="border-2 border-blue-200 bg-blue-50">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">Your Approval Required</h3>
                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="success"
                                            leftIcon={<CheckCircleIcon className="h-5 w-5" />}
                                            onClick={() => {
                                                setApprovalAction('approve');
                                                setShowApprovalModal(true);
                                            }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            leftIcon={<XCircleIcon className="h-5 w-5" />}
                                            onClick={() => {
                                                setApprovalAction('reject');
                                                setShowApprovalModal(true);
                                            }}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Metadata */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Current Status</label>
                                    <div className="mt-2">
                                        <StatusBadge status={currentRequest.status} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Priority</label>
                                    <div className="mt-2">
                                        <PriorityBadge priority={currentRequest.priority} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <label className="font-medium text-gray-500">Requested By</label>
                                    <p className="mt-1 text-gray-800">
                                        {currentRequest.requestedBy.firstName} {currentRequest.requestedBy.lastName}
                                    </p>
                                </div>
                                <div>
                                    <label className="font-medium text-gray-500">Created</label>
                                    <p className="mt-1 text-gray-800">{formatDate(currentRequest.createdAt)}</p>
                                </div>
                                <div>
                                    <label className="font-medium text-gray-500">Last Updated</label>
                                    <p className="mt-1 text-gray-800">{formatDate(currentRequest.updatedAt)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Approval Modal */}
            <Modal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                title={`${approvalAction === 'approve' ? 'Approve' : 'Reject'} Request`}
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        {approvalAction === 'approve'
                            ? 'Are you sure you want to approve this request?'
                            : 'Please provide a reason for rejecting this request.'}
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comments {approvalAction === 'reject' && '*'}
                        </label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="Add your comments..."
                            value={approvalComment}
                            onChange={(e) => setApprovalComment(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-end space-x-3">
                        <Button variant="ghost" onClick={() => setShowApprovalModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant={approvalAction === 'approve' ? 'success' : 'danger'}
                            onClick={handleApproval}
                            isLoading={isSubmitting}
                        >
                            {approvalAction === 'approve' ? 'Approve' : 'Reject'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
