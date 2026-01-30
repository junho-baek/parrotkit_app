'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  DashboardLayout,
  Home,
  Recipes,
  Projects,
  Templates,
  AIAssistant,
  Settings,
} from '@/components/auth';
import { PromoModal } from '@/components/common';
import { DashboardTab } from '@/types/auth';

function DashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as DashboardTab | null;
  const activeTab = (tabParam || 'home') as DashboardTab;
  const [showPromoModal, setShowPromoModal] = React.useState(false);

  // 프로모션 모달 표시 체크 (온보딩 완료 후 첫 접속)
  React.useEffect(() => {
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

  // GA4: 대시보드 페이지 조회
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_dashboard', {
        event_category: 'engagement',
        active_tab: activeTab
      });
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'recipes':
        return <Recipes />;
      case 'projects':
        return <Projects />;
      case 'templates':
        return <Templates />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <DashboardLayout activeTab={activeTab}>
        {renderContent()}
      </DashboardLayout>
      {showPromoModal && <PromoModal onClose={handleClosePromoModal} />}
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
