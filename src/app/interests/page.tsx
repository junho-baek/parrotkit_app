'use client';

import { InterestsForm } from '@/components/auth';
import { TopNav } from '@/components/common';
import { useEffect } from 'react';

export default function InterestsPage() {
  useEffect(() => {
    // GA4: 관심사 페이지 조회
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_interests_page', {
        event_category: 'engagement',
        page_title: 'Interests Selection'
      });
    }
  }, []);

  return (
    <>
      <TopNav showNav={false} />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <InterestsForm />
      </div>
    </>
  );
}
