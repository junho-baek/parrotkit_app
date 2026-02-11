'use client';

import React, { Suspense, useState } from 'react';
import { Home } from '@/components/auth';
import { PromoModal } from '@/components/common';
import { useEffect } from 'react';

function HomeContent() {
  const [showPromoModal, setShowPromoModal] = useState(false);

  useEffect(() => {
    // GA4: Home 탭 조회
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_home_tab', {
        event_category: 'engagement',
        page_title: 'Home Tab'
      });
    }

    // 프로모션 모달 표시 체크 (온보딩 완료 후 첫 접속)
    const hasSeenPromo = localStorage.getItem('hasSeenPromoModal');
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    
    // 온보딩 완료했고, 프로모션 모달을 본 적 없으면 표시
    if (hasCompletedOnboarding && !hasSeenPromo) {
      // 1초 딜레이 후 표시 (자연스러운 UX)
      setTimeout(() => {
        setShowPromoModal(true);
      }, 1000);
    }
  }, []);

  const handleClosePromoModal = () => {
    setShowPromoModal(false);
    localStorage.setItem('hasSeenPromoModal', 'true');
  };

  return (
    <>
      <Home />
      {showPromoModal && <PromoModal onClose={handleClosePromoModal} />}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="py-12 text-center">
        <div className="mb-4 inline-block">
          <img src="/parrot-logo.png" alt="Loading" className="w-16 h-16 animate-bounce-logo" />
        </div>
        <p className="text-gray-600 font-semibold">Loading...</p>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
