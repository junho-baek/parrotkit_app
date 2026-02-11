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
      <div className="flex-shrink-0 bg-white border-b-2 border-gray-200 px-4 py-3 z-10 relative shadow-sm">
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-md mx-auto px-4 py-4">
          {children}
        </div>
      </div>

      {/* Bottom Tab Navigation - Fixed */}
      <BottomTabBar />
    </div>
  );
}
