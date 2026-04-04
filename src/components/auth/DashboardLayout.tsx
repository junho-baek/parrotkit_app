'use client';

import React from 'react';
import { DashboardTab } from '@/types/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile App Style Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center z-40">
        <div className="flex items-center gap-2">
          <img src="/parrot-logo.png" alt="Parrot Kit" className="w-6 h-6" />
          <h1 className="text-xl font-bold text-gray-900">Parrot Kit</h1>
        </div>
      </div>

      {/* Main Content - Mobile App Style */}
      <div className="pt-14 pb-20 min-h-screen">
        <div className="max-w-[500px] mx-auto px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};
