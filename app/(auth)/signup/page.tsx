// Signup/Registration Page

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import api from '@/lib/api';
import { ROLES } from '@/lib/constants';
import {
    UserCircleIcon,
    EnvelopeIcon,
    LockClosedIcon,
    BuildingOfficeIcon,
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/react/24/outline';

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee',
        departmentId: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    React.useEffect(() => {
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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.departmentId) {
            newErrors.departmentId = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        try {
            setIsLoading(true);
            await api.createUser({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role as any,
                departmentId: formData.departmentId,
            });

            // Redirect to login after successful signup
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-[#1976D2] to-[#00897B] rounded-lg flex items-center justify-center">
                            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">UMUTUNGO Box</h1>
                    <p className="text-gray-600 mt-2">Asset Management System</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                        <p className="text-gray-600 mt-1">Sign up to get started with UMUTUNGO Box</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="First Name *"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                error={errors.firstName}
                                leftIcon={<UserCircleIcon className="h-5 w-5 text-gray-400" />}
                            />
                            <Input
                                label="Last Name *"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                error={errors.lastName}
                                leftIcon={<UserCircleIcon className="h-5 w-5 text-gray-400" />}
                            />
                        </div>

                        {/* Email */}
                        <Input
                            type="email"
                            label="Email Address *"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={errors.email}
                            leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                        />

                        {/* Password */}
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            label="Password *"
                            placeholder="Create a password (min. 8 characters)"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={errors.password}
                            leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            }
                        />

                        {/* Confirm Password */}
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Confirm Password *"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            error={errors.confirmPassword}
                            leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            }
                        />

                        {/* Role and Department */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Role *"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                options={Object.entries(ROLES).map(([value, label]) => ({
                                    value,
                                    label,
                                }))}
                            />

                            <Select
                                label="Department *"
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                options={[
                                    { value: '', label: 'Select Department' },
                                    ...departments.map((dept) => ({
                                        value: dept._id,
                                        label: dept.name,
                                    })),
                                ]}
                                error={errors.departmentId}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#1976D2] hover:text-[#115293] font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2026 UMUTUNGO Box. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
