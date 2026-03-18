'use client';

import React from 'react';
import { Settings } from '@/components/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ensureValidAccessToken } from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';

export default function MyPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    void (async () => {
      const token = await ensureValidAccessToken();

      if (!token) {
        router.replace('/signin');
        setAuthChecked(true);
        return;
      }

      setIsAuthenticated(true);
      setAuthChecked(true);
    })();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void logClientEvent('view_my_tab', {
      event_category: 'engagement',
      page_title: 'My Page Tab',
    });
  }, [isAuthenticated]);

  if (!authChecked || !isAuthenticated) {
    return null;
  }

  return <Settings />;
}
