'use client';

import React from 'react';
import { ExploreContent } from '@/components/auth';
import { useEffect } from 'react';
import { logClientEvent } from '@/lib/client-events';

export default function ExplorePage() {
  useEffect(() => {
    void logClientEvent('view_explore_tab', {
      event_category: 'engagement',
      page_title: 'Explore Tab',
    });
  }, []);

  return <ExploreContent />;
}
