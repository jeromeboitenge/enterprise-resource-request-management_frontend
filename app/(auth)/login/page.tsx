// Login Page - Enhanced for Backend Security

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { getDashboardRoute } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading, error } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
    const [isLocked, setIsLocked] = useState(false);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

    const validate = () => {
        const errors: { email?: string; password?: string } = {};

        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }

        if (!password) {
            errors.password = 'Password is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLocked(false);
        setRemainingAttempts(null);

        try {
            await login(email, password);
            const user = useAuthStore.getState().user;
            if (user) {
                const dashboardRoute = getDashboardRoute(user.role);
                router.push(dashboardRoute);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Login failed';
            
            // Check for account lockout
            if (errorMessage.includes('locked') || errorMessage.includes('Lock')) {
                setIsLocked(true);
            }
            
            // Extract remaining attempts if mentioned
            const attemptsMatch = errorMessage.match(/(\d+)\s+attempt/);
            if (attemptsMatch) {
                setRemainingAttempts(parseInt(attemptsMatch[1]));
            }
        }
    };

    const getErrorType = () => {
        if (isLocked) return 'error';
        if (remainingAttempts !== null && remainingAttempts <= 2) return 'warning';
        return 'error';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slideUp">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600">
                            Enterprise Resource Request System
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <ErrorAlert 
                            error={error} 
                            type={getErrorType()}
                        />
                    )}

                    {/* Account Locked Warning */}
                    {isLocked && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-700 text-sm font-medium">Account Locked</p>
                            </div>
                        </div>
                    )}

                    {/* Remaining Attempts Warning */}
                    {remainingAttempts !== null && remainingAttempts > 0 && !isLocked && (
                        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                            <p className="text-yellow-700 text-sm">
                                <span className="font-semibold">{remainingAttempts}</span> attempt{remainingAttempts !== 1 ? 's' : ''} remaining before account lockout
                            </p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={validationErrors.email}
                            disabled={isLocked}
                            leftIcon={
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            }
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={validationErrors.password}
                            disabled={isLocked}
                            leftIcon={
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            disabled={isLocked}
                            className="w-full"
                        >
                            {isLocked ? 'Account Locked' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-800 font-semibold mb-2">Demo Credentials:</p>
                        <div className="space-y-1 text-xs text-blue-700">
                            <p>• Employee: employee@example.com / SecureP@ss123</p>
                            <p>• Manager: manager@example.com / SecureP@ss123</p>
                            <p>• Admin: admin@example.com / SecureP@ss123</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white text-sm mt-6">
                    © 2025 Enterprise Resource Request System
                </p>
            </div>
        </div>
    );
}
