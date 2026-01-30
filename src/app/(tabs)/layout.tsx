import React from 'react';
import { BottomTabBar, AppFrame } from '@/components/common';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppFrame>
      <div className="flex flex-col h-full">
        {/* Mobile App Style Header - Fixed */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center z-10">
          <div className="flex items-center gap-2">
            <img src="/parrot-logo.png" alt="Parrot Kit" className="w-6 h-6" />
            <h1 className="text-xl font-bold text-gray-900">Parrot Kit</h1>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-md mx-auto px-4 py-4">
            {children}
          </div>
        </div>

        {/* Bottom Tab Navigation - Fixed */}
        <BottomTabBar />
      </div>
    </AppFrame>
  );
}
