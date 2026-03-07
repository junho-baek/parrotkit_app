'use client';

import React from 'react';
import { Settings } from '@/components/auth';
import { useEffect } from 'react';
import { logClientEvent } from '@/lib/client-events';

export default function MyPage() {
  useEffect(() => {
    void logClientEvent('view_my_tab', {
      event_category: 'engagement',
      page_title: 'My Page Tab',
    });
  }, []);

  return <Settings />;
}
