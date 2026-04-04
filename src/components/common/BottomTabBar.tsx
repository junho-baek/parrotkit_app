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
      className="z-20 flex-shrink-0 backdrop-blur-2xl"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0.6rem)',
        borderTop: '1px solid var(--border-bottom-nav)',
        background: 'var(--surface-bottom-nav)',
        boxShadow: 'var(--shadow-bottom-nav)',
      }}
    >
      <div className="mx-auto flex max-w-[500px] items-center justify-around gap-1 px-3 pt-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <NextLink
              key={tab.id}
              href={tab.href}
              onClick={() => handleTabClick(tab.gaEvent)}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex flex-1 select-none overflow-hidden rounded-[1.35rem] px-2 py-2 text-center outline-none transition-all duration-300 ${
                isActive
                  ? 'border border-white/40 text-slate-900 backdrop-blur-[18px]'
                  : 'border border-transparent text-slate-500 hover:bg-white/70 hover:text-slate-700 active:bg-white/40'
              }`}
              style={
                {
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  ...(isActive
                    ? {
                        backgroundColor: 'var(--surface-bottom-nav-active)',
                        backgroundImage: 'var(--gradient-brand-nav-glass)',
                        boxShadow: 'var(--shadow-bottom-nav-active)',
                      }
                    : {}),
                }
              }
            >
              {isActive ? (
                <>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-[1px] rounded-[1.28rem]"
                    style={{ background: 'var(--surface-bottom-nav-active-overlay)' }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-2 right-2 top-1 h-4 rounded-full blur-md"
                    style={{ background: 'var(--surface-bottom-nav-active-highlight)' }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-1/2 h-8 w-12 -translate-x-1/2 rounded-full blur-xl"
                    style={{ background: 'var(--surface-bottom-nav-active-bloom)' }}
                  />
                </>
              ) : null}

              <div className="relative z-10 flex w-full flex-col items-center gap-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center text-slate-500 transition-all duration-300 ${
                    isActive ? 'text-slate-950' : 'group-hover:text-slate-700 group-active:text-slate-700'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-300 ${
                      isActive ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                    strokeWidth={isActive ? 2.2 : 2}
                  />
                </div>
                <span
                  className={`text-[11px] leading-none tracking-[0.01em] ${
                    isActive ? 'font-semibold text-slate-950' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </NextLink>
          );
        })}
      </div>
    </nav>
  );
};
