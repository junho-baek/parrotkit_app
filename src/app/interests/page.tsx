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
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,_rgba(140,103,255,0.14),_transparent_30%),linear-gradient(180deg,_#fffefe_0%,_#fff_44%,_#fff9fc_100%)]">
      <div className="sticky top-0 z-10 flex-shrink-0 border-b border-white/80 bg-white/92 px-4 py-2.5 backdrop-blur-xl">
        <h1 className="text-center text-lg font-bold tracking-[-0.03em] text-gray-900">Explore Interests</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-3">
        <div className="mx-auto w-full max-w-md">
          <InterestsForm />
        </div>
      </div>
    </div>
  );
}
