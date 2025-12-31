// Create Request Page

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useRequestStore } from '@/lib/stores/requestStore';
import { RESOURCE_TYPES, PRIORITIES } from '@/lib/constants';
import api from '@/lib/api';
import { Department } from '@/lib/types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateRequestPage() {
    const router = useRouter();
    const { createRequest, isLoading } = useRequestStore();
    const [departments, setDepartments] = useState<Department[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        resourceType: '',
        quantity: 1,
        estimatedCost: 0,
        departmentId: '',
        priority: 'medium',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const depts = await api.getDepartments();
            setDepartments(depts);
        } catch (error) {
            console.error('Failed to load departments:', error);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.resourceType) {
            newErrors.resourceType = 'Resource type is required';
        }

        if (formData.quantity < 1) {
            newErrors.quantity = 'Quantity must be at least 1';
        }

        if (formData.estimatedCost <= 0) {
            newErrors.estimatedCost = 'Estimated cost must be greater than 0';
        }

        if (!formData.departmentId) {
            newErrors.departmentId = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const request = await createRequest(formData);
            router.push(`/requests/${request._id}`);
        } catch (error) {
            console.error('Failed to create request:', error);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
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
                        <h1 className="text-3xl font-bold text-gray-800">Create New Request</h1>
                        <p className="text-gray-600 mt-1">Submit a resource request for approval</p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Request Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <Input
                                label="Request Title *"
                                placeholder="e.g., New Laptop for Development"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                error={errors.title}
                            />

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    rows={4}
                                    placeholder="Provide detailed information about your request..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Resource Type & Priority */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="Resource Type *"
                                    value={formData.resourceType}
                                    onChange={(e) => handleChange('resourceType', e.target.value)}
                                    options={Object.entries(RESOURCE_TYPES).map(([value, label]) => ({
                                        value,
                                        label,
                                    }))}
                                    error={errors.resourceType}
                                />

                                <Select
                                    label="Priority *"
                                    value={formData.priority}
                                    onChange={(e) => handleChange('priority', e.target.value)}
                                    options={Object.entries(PRIORITIES).map(([value, { label }]) => ({
                                        value,
                                        label,
                                    }))}
                                />
                            </div>

                            {/* Quantity & Cost */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    type="number"
                                    label="Quantity *"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                                    error={errors.quantity}
                                />

                                <Input
                                    type="number"
                                    label="Estimated Cost (USD) *"
                                    min="0"
                                    step="0.01"
                                    value={formData.estimatedCost}
                                    onChange={(e) => handleChange('estimatedCost', parseFloat(e.target.value) || 0)}
                                    error={errors.estimatedCost}
                                    leftIcon={
                                        <span className="text-gray-400">$</span>
                                    }
                                />
                            </div>

                            {/* Department */}
                            <Select
                                label="Department *"
                                value={formData.departmentId}
                                onChange={(e) => handleChange('departmentId', e.target.value)}
                                options={departments.map((dept) => ({
                                    value: dept._id,
                                    label: dept.name,
                                }))}
                                error={errors.departmentId}
                            />

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={isLoading}
                                >
                                    Submit Request
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
