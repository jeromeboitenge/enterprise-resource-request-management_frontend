// Home Page - Redirect to Login or Dashboard

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { getDashboardRoute } from '@/lib/auth';
import { PageLoader } from '@/components/ui/Loader';

export default function HomePage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (token && user) {
      // User is authenticated, redirect to their dashboard
      const dashboardRoute = getDashboardRoute(user.role);
      router.push(dashboardRoute);
    } else {
      // User is not authenticated, redirect to login
      router.push('/login');
    }
  }, [token, user, router]);

  return <PageLoader />;
}
