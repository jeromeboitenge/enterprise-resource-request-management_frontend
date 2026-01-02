// User Management Page

'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { User, Department } from '@/lib/types';
import { ROLES } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'employee' as any,
        departmentId: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [usersData, deptsData] = await Promise.all([
                api.getUsers({ page: 1, limit: 100 }),
                api.getDepartments(),
            ]);
            setUsers(usersData.data);
            setDepartments(deptsData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await api.updateUser(editingUser._id, formData);
            } else {
                await api.createUser(formData);
            }
            setShowModal(false);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: '',
            role: user.role,
            departmentId: user.department._id,
        });
        setShowModal(true);
    };

    const handleDeactivate = async (userId: string) => {
        if (confirm('Are you sure you want to deactivate this user?')) {
            try {
                await api.deactivateUser(userId);
                loadData();
            } catch (error) {
                console.error('Failed to deactivate user:', error);
            }
        }
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: 'employee',
            departmentId: '',
        });
    };

    const filteredUsers = users.filter((user) =>
        `${user.firstName} ${user.lastName} ${user.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                        <p className="text-gray-600 mt-1">Manage system users and permissions</p>
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<PlusIcon className="h-5 w-5" />}
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        Add User
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                        />
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={5} />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {user.firstName} {user.lastName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                                                <td className="px-4 py-4 text-sm">
                                                    <Badge variant="blue">{ROLES[user.role]}</Badge>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{user.department.name}</td>
                                                <td className="px-4 py-4 text-sm">
                                                    <Badge variant={user.isActive ? 'green' : 'gray'}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {formatDate(user.createdAt)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeactivate(user._id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
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

            {/* User Form Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                title={editingUser ? 'Edit User' : 'Add New User'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name *"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                        <Input
                            label="Last Name *"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        type="email"
                        label="Email *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    {!editingUser && (
                        <Input
                            type="password"
                            label="Password *"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!editingUser}
                        />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Role *"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            options={Object.entries(ROLES).map(([value, label]) => ({
                                value,
                                label,
                            }))}
                        />

                        <Select
                            label="Department *"
                            value={formData.departmentId}
                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            options={departments.map((dept) => ({
                                value: dept._id,
                                label: dept.name,
                            }))}
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
                            {editingUser ? 'Update User' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
