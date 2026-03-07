'use client';

import React from 'react';
import { URLInputForm } from '@/components/auth';
import { useEffect } from 'react';
import { logClientEvent } from '@/lib/client-events';

export default function PastePage() {
  useEffect(() => {
    void logClientEvent('view_submit_video_page', {
      event_category: 'engagement',
      page_title: 'Paste Tab',
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Paste Reference</h2>
        <p className="text-gray-900">Add a viral video URL to analyze</p>
      </div>
      <URLInputForm />
    </div>
  );
}
