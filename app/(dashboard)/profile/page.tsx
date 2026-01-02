// User Profile Page

'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/stores/authStore';
import { formatDate } from '@/lib/formatters';
import {
    UserCircleIcon,
    EnvelopeIcon,
    BuildingOfficeIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement profile update
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <Card>
                    <CardContent className="p-8">
                        <div className="flex items-start space-x-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <p className="text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <EnvelopeIcon className="h-5 w-5 mr-2" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                                        {user.department.name}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <ShieldCheckIcon className="h-5 w-5 mr-2" />
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <Button
                                variant={isEditing ? 'ghost' : 'primary'}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                {isEditing && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="First Name"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                    <Input
                                        label="Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>

                                <Input
                                    type="email"
                                    label="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />

                                <div className="flex items-center justify-end space-x-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Account Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">User ID</span>
                                <span className="font-mono text-sm">{user._id}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Account Created</span>
                                <span>{formatDate(user.createdAt)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Last Updated</span>
                                <span>{formatDate(user.updatedAt)}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Account Status</span>
                                <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-800 mb-2">Password</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Change your password to keep your account secure
                                </p>
                                <Button variant="secondary" size="sm">
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
