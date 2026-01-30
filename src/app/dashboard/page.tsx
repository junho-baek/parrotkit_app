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
import { DashboardTab } from '@/types/auth';

function DashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as DashboardTab | null;
  const activeTab = (tabParam || 'home') as DashboardTab;

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
    <DashboardLayout activeTab={activeTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
