'use client';

import React from 'react';
import { ExploreContent } from '@/components/auth';
import { useEffect } from 'react';

export default function ExplorePage() {
  useEffect(() => {
    // GA4: Explore 탭 조회
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_explore_tab', {
        event_category: 'engagement',
        page_title: 'Explore Tab'
      });
    }
  }, []);

  return <ExploreContent />;
}
