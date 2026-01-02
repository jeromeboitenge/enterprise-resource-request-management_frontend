// Reset Password Page

'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Password is required');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) {
            setError('Invalid reset token');
            return;
        }

        try {
            setIsLoading(true);
            await api.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
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

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
                    {success ? (
                        <div className="text-center">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h2>
                            <p className="text-gray-600 mb-6">
                                Your password has been reset successfully. Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
                                <p className="text-gray-600 mt-1">
                                    Enter your new password below.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    label="New Password"
                                    placeholder="Enter new password (min. 8 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    label="Confirm Password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    isLoading={isLoading}
                                >
                                    Reset Password
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/login"
                                    className="text-[#1976D2] hover:text-[#115293] font-semibold"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2026 UMUTUNGO Box. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
