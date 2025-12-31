// Sidebar Component

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import {
    HomeIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    CurrencyDollarIcon,
    UsersIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { UserRole } from '@/lib/types';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: UserRole[];
}

const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/employee', icon: HomeIcon, roles: ['employee', 'manager', 'department_head', 'finance', 'admin'] },
    { name: 'My Requests', href: '/requests', icon: DocumentTextIcon, roles: ['employee', 'manager', 'department_head'] },
    { name: 'Approvals', href: '/approvals', icon: CheckCircleIcon, roles: ['manager', 'department_head', 'finance', 'admin'] },
    { name: 'Funding', href: '/finance/funding', icon: CurrencyDollarIcon, roles: ['finance', 'admin'] },
    { name: 'Users', href: '/admin/users', icon: UsersIcon, roles: ['admin'] },
    { name: 'Departments', href: '/admin/departments', icon: BuildingOfficeIcon, roles: ['admin'] },
    { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon, roles: ['admin'] },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, roles: ['admin'] },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const { user } = useAuthStore();

    if (!user) return null;

    const filteredNavigation = navigation.filter((item) =>
        item.roles.includes(user.role)
    );

    // Update dashboard href based on role
    const dashboardItem = filteredNavigation.find((item) => item.name === 'Dashboard');
    if (dashboardItem) {
        const roleRoutes: Record<UserRole, string> = {
            employee: '/employee',
            manager: '/manager',
            department_head: '/department-head',
            finance: '/finance',
            admin: '/admin',
        };
        dashboardItem.href = roleRoutes[user.role];
    }

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold">R2P System</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-700"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* User info */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-400 capitalize">
                                {user.role.replace('_', ' ')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {filteredNavigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => onClose()}
                                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }
                `}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 text-center">
                        © 2025 R2P System
                    </p>
                </div>
            </aside>
        </>
    );
};
