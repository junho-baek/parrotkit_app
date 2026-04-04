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
    <div className="mx-auto flex w-full max-w-[500px] flex-col justify-start">
      <URLInputForm />
    </div>
  );
}
