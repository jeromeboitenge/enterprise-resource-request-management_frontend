// Help & Documentation Page

'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
    QuestionMarkCircleIcon,
    BookOpenIcon,
    VideoCameraIcon,
    ChatBubbleLeftRightIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function HelpPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const faqItems = [
        {
            question: 'How do I create a new resource request?',
            answer: 'Navigate to "My Requests" and click the "New Request" button. Fill in all required fields including title, description, resource type, quantity, and estimated cost.',
        },
        {
            question: 'How long does the approval process take?',
            answer: 'The approval process typically takes 3-5 business days, depending on the request priority and approval chain. High priority requests are processed faster.',
        },
        {
            question: 'Can I edit a request after submission?',
            answer: 'You can edit a request only if it is still in "Draft" status. Once submitted, you cannot edit it, but you can cancel and create a new request.',
        },
        {
            question: 'How do I track my request status?',
            answer: 'Go to "My Requests" to see all your requests with their current status. Click on any request to view detailed approval timeline and comments.',
        },
        {
            question: 'Who can approve my request?',
            answer: 'Requests go through a multi-level approval: Manager → Department Head → Finance → Admin. Each level must approve before moving to the next.',
        },
        {
            question: 'What happens after my request is funded?',
            answer: 'Once funded by Finance, the request moves to "Funded" status. The procurement team will then process the purchase and update the status to "Fulfilled".',
        },
    ];

    const filteredFAQ = faqItems.filter((item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Help & Documentation</h1>
                    <p className="text-gray-600 mt-2">
                        Find answers to common questions and learn how to use UMUTUNGO Box
                    </p>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-6">
                        <Input
                            placeholder="Search for help..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                        />
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card hover className="cursor-pointer">
                        <CardContent className="p-6 text-center">
                            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <BookOpenIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800">User Guide</h3>
                            <p className="text-sm text-gray-600 mt-1">Complete documentation</p>
                        </CardContent>
                    </Card>

                    <Card hover className="cursor-pointer">
                        <CardContent className="p-6 text-center">
                            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <VideoCameraIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800">Video Tutorials</h3>
                            <p className="text-sm text-gray-600 mt-1">Step-by-step guides</p>
                        </CardContent>
                    </Card>

                    <Card hover className="cursor-pointer">
                        <CardContent className="p-6 text-center">
                            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <QuestionMarkCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800">FAQs</h3>
                            <p className="text-sm text-gray-600 mt-1">Common questions</p>
                        </CardContent>
                    </Card>

                    <Card hover className="cursor-pointer">
                        <CardContent className="p-6 text-center">
                            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800">Contact Support</h3>
                            <p className="text-sm text-gray-600 mt-1">Get personalized help</p>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredFAQ.map((item, index) => (
                                <div key={index} className="border-b pb-4 last:border-b-0">
                                    <h3 className="font-semibold text-gray-800 mb-2 flex items-start">
                                        <QuestionMarkCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                        {item.question}
                                    </h3>
                                    <p className="text-gray-600 ml-7">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Getting Started */}
                <Card>
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">1. Create Your First Request</h3>
                                <p className="text-gray-600">
                                    Click on "My Requests" in the sidebar, then click "New Request". Fill in the required information about the resource you need.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">2. Track Approval Progress</h3>
                                <p className="text-gray-600">
                                    View your request details to see the approval timeline. You'll receive notifications at each approval stage.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">3. Manage Your Profile</h3>
                                <p className="text-gray-600">
                                    Update your profile information and notification preferences in the "Profile" section.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                    <CardContent className="p-8 text-center">
                        <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Need More Help?</h3>
                        <p className="mb-4">Our support team is here to assist you</p>
                        <div className="flex items-center justify-center space-x-4">
                            <div>
                                <p className="text-sm opacity-90">Email</p>
                                <p className="font-semibold">support@umutungobox.com</p>
                            </div>
                            <div className="h-8 w-px bg-white opacity-30"></div>
                            <div>
                                <p className="text-sm opacity-90">Phone</p>
                                <p className="font-semibold">+250 XXX XXX XXX</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
