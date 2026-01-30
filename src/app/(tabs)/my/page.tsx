'use client';

import React from 'react';
import { Settings } from '@/components/auth';
import { useEffect } from 'react';

export default function MyPage() {
  useEffect(() => {
    // GA4: My 탭 조회
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_my_tab', {
        event_category: 'engagement',
        page_title: 'My Page Tab'
      });
    }
  }, []);

  return <Settings />;
}
