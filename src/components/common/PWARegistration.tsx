'use client';

import { useEffect, useMemo, useState } from 'react';

type Platform = 'unknown' | 'android' | 'ios' | 'other';

type BeforeInstallPromptOutcome = 'accepted' | 'dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: BeforeInstallPromptOutcome }>;
}

const DISMISS_KEY = 'pwa_install_sheet_dismissed_at';
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export const PWARegistration = () => {
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [isSafari, setIsSafari] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const isDismissedRecently = () => {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) {
      return false;
    }

    const dismissedAt = Number(raw);
    if (!Number.isFinite(dismissedAt)) {
      return false;
    }

    return Date.now() - dismissedAt < DISMISS_COOLDOWN_MS;
  };

  const dismissSheet = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const nextPlatform: Platform = userAgent.includes('android')
      ? 'android'
      : /iphone|ipad|ipod/.test(userAgent)
        ? 'ios'
        : 'other';

    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const safariBrowser = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);

    setPlatform(nextPlatform);
    setIsSafari(safariBrowser);
    setIsStandalone(standaloneMode);

    if (!standaloneMode && nextPlatform === 'ios' && safariBrowser && !isDismissedRecently()) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (window.location.protocol !== 'https:' && !isLocalhost) {
      return;
    }

    void navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });

    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);

      if (!isStandalone && !isDismissedRecently()) {
        setVisible(true);
      }
    };

    const handleAppInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const canShowAndroidInstall = platform === 'android' && !!deferredPrompt && !isStandalone;
  const canShowIOSGuide = platform === 'ios' && !isStandalone;
  const shouldRenderSheet = visible && (canShowAndroidInstall || canShowIOSGuide);

  const iosMessage = useMemo(() => {
    if (isSafari) {
      return 'Tap the Share button in Safari, then choose Add to Home Screen.';
    }

    return 'On iPhone, installation is available only in Safari. Open this page in Safari and tap Add to Home Screen.';
  }, [isSafari]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'dismissed') {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }

    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!shouldRenderSheet) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-end justify-center p-4">
      <div className="w-full max-w-[500px] rounded-2xl bg-white shadow-2xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Install as an App</h3>
            <p className="mt-1 text-sm text-gray-700">
              Add ParrotKit to your home screen for faster access.
            </p>
            <p className="mt-1 text-xs font-medium text-amber-700">
              Without PWA installation, shooting and layout UI may break on some devices.
            </p>
          </div>
          <button
            type="button"
            onClick={dismissSheet}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {canShowAndroidInstall ? (
          <button
            type="button"
            onClick={() => {
              void handleInstallClick();
            }}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            Install
          </button>
        ) : null}

        {canShowIOSGuide ? (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <p className="text-sm text-blue-900 font-medium">
              {iosMessage}
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={dismissSheet}
          className="mt-3 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};
