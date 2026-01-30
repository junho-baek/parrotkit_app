'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardTab } from '@/types/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs: { id: DashboardTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'recipes', label: 'My Recipes', icon: '📋' },
    { id: 'projects', label: 'Project', icon: '📁' },
    { id: 'templates', label: 'Template', icon: '🎨' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleTabClick = (tabId: DashboardTab) => {
    // GA4: 대시보드 탭 전환
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'dashboard_tab_change', {
        event_category: 'engagement',
        tab_name: tabId,
        from_tab: activeTab
      });
    }
    
    router.push(`/dashboard?tab=${tabId}`);
  };

  const handleLogout = () => {
    // GA4: 로그아웃
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'logout', {
        event_category: 'engagement'
      });
    }
    
    // localStorage 정리
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 로그인 페이지로 이동
    router.push('/signin');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-500 text-2xl"
        >
          ☰
        </button>
        <div className="flex items-center gap-2">
          <img src="/parrot-logo.png" alt="Parrot Kit" className="w-6 h-6" />
          <h1 className="text-xl font-bold text-gray-900">Parrot Kit</h1>
        </div>
        <div className="w-6" />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 transform md:transform-none transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <img src="/parrot-logo.png" alt="Parrot Kit" className="w-8 h-8" />
            <h2 className="text-2xl font-bold text-gray-900">Parrot Kit</h2>
          </div>

          <nav className="space-y-2 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  handleTabClick(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          <Link
            href="/pricing"
            onClick={() => {
              // GA4: 대시보드에서 프라이싱 버튼 클릭
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'click_pricing_from_dashboard', {
                  event_category: 'engagement',
                  event_label: 'dashboard_view_pricing'
                });
              }
            }}
            className="w-full px-4 py-3 text-center bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 block mb-4"
          >
            View Pricing
          </Link>

          <button 
            onClick={handleLogout}
            className="w-full px-4 py-3 text-center text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-0 mt-16 md:mt-0 p-4 md:p-8">
        <div className="max-w-6xl">{children}</div>
      </div>

    </div>
  );
};
