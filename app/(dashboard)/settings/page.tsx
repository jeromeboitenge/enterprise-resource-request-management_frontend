// Settings Page

'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
    Cog6ToothIcon,
    BellIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        language: 'en',
        timezone: 'Africa/Kigali',
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: false,
    });

    const handleSave = () => {
        // TODO: Implement settings save
        alert('Settings saved successfully!');
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your application preferences</p>
                </div>

                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
                            <CardTitle>General Settings</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select
                            label="Language"
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            options={[
                                { value: 'en', label: 'English' },
                                { value: 'fr', label: 'Français' },
                                { value: 'rw', label: 'Kinyarwanda' },
                            ]}
                        />

                        <Select
                            label="Timezone"
                            value={settings.timezone}
                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            options={[
                                { value: 'Africa/Kigali', label: 'Africa/Kigali (CAT)' },
                                { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT)' },
                                { value: 'UTC', label: 'UTC' },
                            ]}
                        />
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <BellIcon className="h-6 w-6 text-gray-600" />
                            <CardTitle>Notification Preferences</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                            <div>
                                <p className="font-medium text-gray-800">Email Notifications</p>
                                <p className="text-sm text-gray-600">Receive email updates for important events</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b">
                            <div>
                                <p className="font-medium text-gray-800">Push Notifications</p>
                                <p className="text-sm text-gray-600">Receive in-app notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.pushNotifications}
                                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-gray-800">Weekly Reports</p>
                                <p className="text-sm text-gray-600">Receive weekly summary reports via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.weeklyReports}
                                    onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
                            <CardTitle>Security</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-800 mb-2">Change Password</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Update your password to keep your account secure
                            </p>
                            <Button variant="secondary">Change Password</Button>
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="font-medium text-gray-800 mb-2">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Add an extra layer of security to your account
                            </p>
                            <Button variant="secondary">Enable 2FA</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* System Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <GlobeAltIcon className="h-6 w-6 text-gray-600" />
                            <CardTitle>System Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Version</span>
                                <span className="font-medium">1.0.0</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Environment</span>
                                <span className="font-medium">Production</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Last Updated</span>
                                <span className="font-medium">January 2, 2026</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex items-center justify-end">
                    <Button variant="primary" onClick={handleSave}>
                        Save Settings
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
}
