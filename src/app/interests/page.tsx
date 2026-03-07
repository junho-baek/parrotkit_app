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
    <div className="flex flex-col h-full">
      {/* Mobile App Style Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center">
        <h1 className="text-xl font-bold text-gray-900">Explore Interests</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <InterestsForm />
        </div>
      </div>
    </div>
  );
}
