'use client';

import React from 'react';
import { URLInputForm } from '@/components/auth';
import { useEffect } from 'react';

export default function PastePage() {
  useEffect(() => {
    // GA4: Paste 탭 조회 (기존 submit-video 이벤트 재사용)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_submit_video_page', {
        event_category: 'engagement',
        page_title: 'Paste Tab'
      });
    }
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
