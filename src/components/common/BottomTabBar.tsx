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
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [isViewportCompressed, setIsViewportCompressed] = React.useState(false);
  const baselineHeightRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const getViewportHeight = () => window.visualViewport?.height || window.innerHeight;

    baselineHeightRef.current = getViewportHeight();

    const isTextInput = (node: EventTarget | null): boolean => {
      if (!(node instanceof HTMLElement)) {
        return false;
      }

      const tagName = node.tagName;
      if (tagName === 'TEXTAREA' || tagName === 'SELECT') {
        return true;
      }

      if (tagName === 'INPUT') {
        const inputType = (node as HTMLInputElement).type;
        const nonTextTypes = new Set(['button', 'checkbox', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit']);
        return !nonTextTypes.has(inputType);
      }

      return node.isContentEditable;
    };

    const updateViewportState = () => {
      const currentHeight = getViewportHeight();
      const baselineHeight = baselineHeightRef.current || currentHeight;

      // 키보드가 올라오면 visual viewport가 유의미하게 줄어든다.
      const compressed = currentHeight < baselineHeight * 0.8;
      setIsViewportCompressed(compressed);

      if (!compressed && currentHeight > baselineHeightRef.current) {
        baselineHeightRef.current = currentHeight;
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (isTextInput(event.target)) {
        setIsInputFocused(true);
      }
    };

    const handleFocusOut = () => {
      window.setTimeout(() => {
        const activeElement = document.activeElement;
        setIsInputFocused(isTextInput(activeElement));
      }, 0);
    };

    updateViewportState();

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    window.addEventListener('resize', updateViewportState);
    window.visualViewport?.addEventListener('resize', updateViewportState);

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('resize', updateViewportState);
      window.visualViewport?.removeEventListener('resize', updateViewportState);
    };
  }, []);

  const handleTabClick = (gaEvent: ClientEventName) => {
    void logClientEvent(gaEvent, {
      event_category: 'navigation',
      event_label: gaEvent,
    });
  };

  const shouldHideForKeyboard = isInputFocused || isViewportCompressed;

  if (shouldHideForKeyboard) {
    return null;
  }

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
