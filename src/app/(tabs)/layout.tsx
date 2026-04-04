import React from 'react';
import { BottomTabBar } from '@/components/common';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Mobile App Style Header - Fixed */}
      <div className="app-shell-header flex h-12 flex-shrink-0 items-center justify-center bg-white px-4 z-10 relative">
        {/* Logo - Left */}
        <a href="/home" className="absolute left-4 top-1/2 -translate-y-1/2">
          <img src="/parrot-logo.png" alt="Parrot Kit" className="w-7 h-7 hover:scale-110 transition-transform" />
        </a>
        
        {/* Title - Center */}
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-gray-900">ParrotKit</h1>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="app-shell-main flex-1 overflow-y-auto overflow-x-hidden">
        <div className="app-shell-content max-w-[500px] mx-auto px-4 py-4">
          {children}
        </div>
      </div>

      {/* Bottom Tab Navigation - Fixed */}
      <div className="app-shell-bottom-nav">
        <BottomTabBar />
      </div>
    </div>
  );
}
