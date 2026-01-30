'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  id: string;
  label: string;
  href: string;
  gaEvent: string;
  renderIcon: (isActive: boolean) => React.ReactNode;
}

const tabs: Tab[] = [
  { 
    id: 'home', 
    label: 'Home', 
    href: '/home', 
    gaEvent: 'tab_home_click',
    renderIcon: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={isActive ? 'currentColor' : 'none'}/>
        <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    id: 'explore', 
    label: 'Explore', 
    href: '/explore', 
    gaEvent: 'tab_explore_click',
    renderIcon: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill={isActive ? 'currentColor' : 'none'}/>
        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  { 
    id: 'paste', 
    label: 'Paste', 
    href: '/paste', 
    gaEvent: 'tab_paste_click',
    renderIcon: (isActive) => (
      <div className={`p-2 rounded-lg ${isActive ? 'bg-yellow-400' : 'bg-yellow-300'}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 3C17 3 17 3 17 3L7 3C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3Z" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 7H15" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 11H15" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 15H13" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    )
  },
  { 
    id: 'recipes', 
    label: 'Recipes', 
    href: '/recipes', 
    gaEvent: 'tab_recipes_click',
    renderIcon: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={isActive ? 'currentColor' : 'none'}/>
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18V12" stroke={isActive ? 'white' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 15H15" stroke={isActive ? 'white' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    id: 'my', 
    label: 'My Page', 
    href: '/my', 
    gaEvent: 'tab_my_click',
    renderIcon: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill={isActive ? 'currentColor' : 'none'}/>
        <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill={isActive ? 'currentColor' : 'none'}/>
      </svg>
    )
  },
];

export const BottomTabBar: React.FC = () => {
  const pathname = usePathname();

  const handleTabClick = (gaEvent: string) => {
    // GA4 이벤트 전송
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', gaEvent, {
        event_category: 'navigation',
        event_label: gaEvent,
      });
    }
  };

  return (
    <nav 
      className="flex-shrink-0 bg-white border-t border-gray-200 z-20"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)',
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => handleTabClick(tab.gaEvent)}
              className={`flex-1 flex flex-col items-center py-2.5 transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="mb-1">
                {tab.renderIcon(isActive)}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
