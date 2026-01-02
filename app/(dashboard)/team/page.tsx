// My Team Page (for Managers)

'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Loader';
import api from '@/lib/api';
import { User } from '@/lib/types';
import { formatDate } from '@/lib/formatters';
import { UsersIcon, EnvelopeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function MyTeamPage() {
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTeamMembers();
    }, []);

    const loadTeamMembers = async () => {
        try {
            setIsLoading(true);
            const data = await api.getTeamMembers();
            setTeamMembers(data);
        } catch (error) {
            console.error('Failed to load team members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const activeMembers = teamMembers.filter(m => m.isActive).length;
    const inactiveMembers = teamMembers.filter(m => !m.isActive).length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Team</h1>
                    <p className="text-gray-600 mt-1">Manage and view your team members</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Members</p>
                                    <p className="text-3xl font-bold mt-2">{teamMembers.length}</p>
                                </div>
                                <UsersIcon className="h-12 w-12 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Active</p>
                                    <p className="text-3xl font-bold mt-2">{activeMembers}</p>
                                </div>
                                <UsersIcon className="h-12 w-12 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-100 text-sm font-medium">Inactive</p>
                                    <p className="text-3xl font-bold mt-2">{inactiveMembers}</p>
                                </div>
                                <UsersIcon className="h-12 w-12 text-gray-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Team Members */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={5} />
                        ) : teamMembers.length === 0 ? (
                            <div className="text-center py-12">
                                <UsersIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No team members found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teamMembers.map((member) => (
                                    <Card key={member._id} hover>
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <div className="h-12 w-12 bg-gradient-to-br from-[#1976D2] to-[#00897B] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-800 truncate">
                                                        {member.firstName} {member.lastName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        {member.role.replace('_', ' ')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                                                    <span className="truncate">{member.email}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                                                    <span className="truncate">{member.department.name}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <Badge variant={member.isActive ? 'green' : 'gray'}>
                                                    {member.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                    Joined {formatDate(member.createdAt)}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
