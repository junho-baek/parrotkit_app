'use client';

import { useEffect } from 'react';
import { ensureValidAccessToken, readRefreshToken } from '@/lib/auth/client-session';

const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

export function AuthSessionSync() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncSession = () => {
      if (!readRefreshToken()) {
        return;
      }

      void ensureValidAccessToken();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncSession();
      }
    };

    syncSession();

    const intervalId = window.setInterval(syncSession, REFRESH_INTERVAL_MS);
    window.addEventListener('focus', syncSession);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', syncSession);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
