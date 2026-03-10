'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logClientEvent } from '@/lib/client-events';
import type { ClientEventName } from '@/lib/tracking/events';

interface Tab {
  id: string;
  label: string;
  href: string;
  gaEvent: ClientEventName;
  icon: string;
}

const tabs: Tab[] = [
  { 
    id: 'home', 
    label: 'Home', 
    href: '/home', 
    gaEvent: 'tab_home_click',
    icon: '/Home.png'
  },
  { 
    id: 'explore', 
    label: 'Explore', 
    href: '/explore', 
    gaEvent: 'tab_explore_click',
    icon: '/Explore.png'
  },
  { 
    id: 'paste', 
    label: 'Paste', 
    href: '/paste', 
    gaEvent: 'tab_paste_click',
    icon: '/Paste.png'
  },
  { 
    id: 'recipes', 
    label: 'Recipes', 
    href: '/recipes', 
    gaEvent: 'tab_recipes_click',
    icon: '/Recipes.png'
  },
  { 
    id: 'my', 
    label: 'My Page', 
    href: '/my', 
    gaEvent: 'tab_my_click',
    icon: '/My.png'
  },
];

export const BottomTabBar: React.FC = () => {
  const pathname = usePathname();

  const handleTabClick = (gaEvent: ClientEventName) => {
    void logClientEvent(gaEvent, {
      event_category: 'navigation',
      event_label: gaEvent,
    });
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
              className={`flex-1 flex flex-col items-center py-2.5 transition-all ${
                isActive
                  ? 'text-blue-600 scale-110'
                  : 'text-gray-900 hover:text-blue-500'
              }`}
            >
              <div className="mb-1 relative w-7 h-7">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={28}
                  height={28}
                  className={`object-contain transition-all ${
                    isActive ? 'brightness-110 drop-shadow-md' : 'opacity-70'
                  }`}
                  priority
                />
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
