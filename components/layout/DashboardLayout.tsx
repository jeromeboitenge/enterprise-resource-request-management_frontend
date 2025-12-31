// Dashboard Layout Component

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { PageLoader } from '@/components/ui/Loader';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const router = useRouter();
    const { user, token } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        if (!token || !user) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [token, user, router]);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
