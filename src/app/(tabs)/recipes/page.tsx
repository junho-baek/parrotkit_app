'use client';

import React from 'react';
import { Recipes } from '@/components/auth';
import { useEffect } from 'react';

export default function RecipesPage() {
  useEffect(() => {
    // GA4: Recipes 탭 조회
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_recipes_tab', {
        event_category: 'engagement',
        page_title: 'Recipes Tab'
      });
    }
  }, []);

  return <Recipes />;
}
