'use client';

import { URLInputForm } from '@/components/auth';
import { useEffect } from 'react';

export default function SubmitVideoPage() {
  useEffect(() => {
    // GA4: 비디오 제출 페이지 조회
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_submit_video_page', {
        event_category: 'engagement',
        page_title: 'Submit Video'
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Mobile App Style Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center">
        <h1 className="text-xl font-bold text-gray-900">Add Reference</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <URLInputForm />
        </div>
      </div>
    </div>
  );
}
