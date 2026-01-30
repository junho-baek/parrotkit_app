'use client';

import { URLInputForm } from '@/components/auth';
import { TopNav } from '@/components/common';
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
    <>
      <TopNav showNav={true} />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 pt-24">
        <URLInputForm />
      </div>
    </>
  );
}
