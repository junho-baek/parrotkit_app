'use client';

import { InterestsForm } from '@/components/auth';
import { useEffect } from 'react';
import { logClientEvent } from '@/lib/client-events';

export default function InterestsPage() {
  useEffect(() => {
    void logClientEvent('view_interests_page', {
      event_category: 'engagement',
      page_title: 'Interests Selection',
    });
  }, []);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="sticky top-0 z-10 flex-shrink-0 border-b border-gray-100 bg-white px-4 py-2.5">
        <h1 className="text-center text-lg font-bold tracking-[-0.03em] text-gray-900">Explore Interests</h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3">
        <div className="mx-auto h-full w-full max-w-[500px]">
          <InterestsForm />
        </div>
      </div>
    </div>
  );
}
