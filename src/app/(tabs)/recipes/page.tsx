'use client';

import React from 'react';
import { Recipes } from '@/components/auth';
import { useEffect } from 'react';
import { logClientEvent } from '@/lib/client-events';

export default function RecipesPage() {
  useEffect(() => {
    void logClientEvent('view_recipes_tab', {
      event_category: 'engagement',
      page_title: 'Recipes Tab',
    });
  }, []);

  return <Recipes />;
}
