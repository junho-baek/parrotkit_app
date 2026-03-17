'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  House,
  Link as LinkIcon,
  Search,
  User,
  type LucideIcon,
} from 'lucide-react';
import { logClientEvent } from '@/lib/client-events';
import type { ClientEventName } from '@/lib/tracking/events';

interface Tab {
  id: string;
  label: string;
  href: string;
  gaEvent: ClientEventName;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/home',
    gaEvent: 'tab_home_click',
    icon: House,
  },
  {
    id: 'explore',
    label: 'Explore',
    href: '/explore',
    gaEvent: 'tab_explore_click',
    icon: Search,
  },
  {
    id: 'paste',
    label: 'Paste',
    href: '/paste',
    gaEvent: 'tab_paste_click',
    icon: LinkIcon,
  },
  {
    id: 'recipes',
    label: 'Recipes',
    href: '/recipes',
    gaEvent: 'tab_recipes_click',
    icon: FileText,
  },
  {
    id: 'my',
    label: 'My',
    href: '/my',
    gaEvent: 'tab_my_click',
    icon: User,
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
      className="z-20 flex-shrink-0 border-t border-slate-200/80 bg-white/95 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0.6rem)',
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around gap-1 px-3 pt-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <NextLink
              key={tab.id}
              href={tab.href}
              onClick={() => handleTabClick(tab.gaEvent)}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex flex-1 flex-col items-center gap-1 rounded-[1.25rem] px-2 py-2 text-center transition-all duration-200 ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-200 bg-[linear-gradient(135deg,#eef2ff_0%,#fdf2f8_100%)] text-indigo-600 shadow-[0_10px_24px_rgba(99,102,241,0.18)]'
                    : 'border-transparent bg-slate-100/80 text-slate-500 group-hover:border-slate-200 group-hover:bg-white group-hover:text-slate-700'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                  strokeWidth={isActive ? 2.35 : 2}
                />
              </div>
              <span
                className={`text-[11px] leading-none tracking-[0.01em] ${
                  isActive ? 'font-semibold text-slate-900' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </NextLink>
          );
        })}
      </div>
    </nav>
  );
};
