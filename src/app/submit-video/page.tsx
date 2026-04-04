'use client';

import { URLInputForm } from '@/components/auth';
import { useEffect } from 'react';
import { logClientEvent } from '@/lib/client-events';

export default function SubmitVideoPage() {
  useEffect(() => {
    void logClientEvent('view_submit_video_page', {
      event_category: 'engagement',
      page_title: 'Submit Video',
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Mobile App Style Header */}
      <div className="flex h-12 flex-shrink-0 items-center justify-center bg-white px-4">
        <h1 className="text-xl font-bold text-gray-900">Add Reference</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <div className="max-w-[500px] w-full">
          <URLInputForm />
        </div>
      </div>
    </div>
  );
}
