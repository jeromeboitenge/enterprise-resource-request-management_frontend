// Department Management Page

'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { Department } from '@/lib/types';
import { formatDate } from '@/lib/formatters';
import {
    PlusIcon,
    BuildingOfficeIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            setIsLoading(true);
            const data = await api.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Failed to load departments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDept) {
                await api.updateDepartment(editingDept._id, formData);
            } else {
                await api.createDepartment(formData);
            }
            setShowModal(false);
            resetForm();
            loadDepartments();
        } catch (error) {
            console.error('Failed to save department:', error);
        }
    };

    const handleEdit = (dept: Department) => {
        setEditingDept(dept);
        setFormData({
            name: dept.name,
            code: dept.code,
            description: dept.description || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (deptId: string) => {
        if (confirm('Are you sure you want to delete this department?')) {
            try {
                await api.deleteDepartment(deptId);
                loadDepartments();
            } catch (error) {
                console.error('Failed to delete department:', error);
            }
        }
    };

    const resetForm = () => {
        setEditingDept(null);
        setFormData({
            name: '',
            code: '',
            description: '',
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Department Management</h1>
                        <p className="text-gray-600 mt-1">Manage organizational departments</p>
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<PlusIcon className="h-5 w-5" />}
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        Add Department
                    </Button>
                </div>

                {/* Departments Grid */}
                {isLoading ? (
                    <Card>
                        <CardContent className="p-6">
                            <TableSkeleton rows={4} />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments.map((dept) => (
                            <Card key={dept._id} hover>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                                                <p className="text-sm text-gray-500">Code: {dept.code}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {dept.description && (
                                        <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                                    )}

                                    <div className="text-xs text-gray-500 mb-4">
                                        Created: {formatDate(dept.createdAt)}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            leftIcon={<PencilIcon className="h-4 w-4" />}
                                            onClick={() => handleEdit(dept)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            leftIcon={<TrashIcon className="h-4 w-4" />}
                                            onClick={() => handleDelete(dept._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!isLoading && departments.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No departments yet</p>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    resetForm();
                                    setShowModal(true);
                                }}
                            >
                                Create First Department
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Department Form Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                title={editingDept ? 'Edit Department' : 'Add New Department'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Department Name *"
                        placeholder="e.g., Information Technology"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <Input
                        label="Department Code *"
                        placeholder="e.g., IT"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Brief description of the department..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setShowModal(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {editingDept ? 'Update Department' : 'Create Department'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
