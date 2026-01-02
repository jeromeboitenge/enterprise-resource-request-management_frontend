// Custom 404 Not Found Page

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-200">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
                <p className="text-gray-600 mt-2 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link href="/">
                    <Button variant="primary" leftIcon={<HomeIcon className="h-5 w-5" />}>
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
