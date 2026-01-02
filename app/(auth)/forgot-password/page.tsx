// Forgot Password Page

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setIsLoading(true);
            await api.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
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
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
                            <p className="text-gray-600 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                If you don't see the email, check your spam folder.
                            </p>
                            <Link href="/login">
                                <Button variant="primary" className="w-full">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
                                <p className="text-gray-600 mt-1">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    type="email"
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                                />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    isLoading={isLoading}
                                >
                                    Send Reset Link
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center text-[#1976D2] hover:text-[#115293] font-semibold"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
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
