'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { URLInputForm } from '@/components/auth';
import { logClientEvent } from '@/lib/client-events';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';

export default function PasteDrawerPage() {
  const router = useRouter();

  useEffect(() => {
    void logClientEvent('view_submit_video_page', {
      event_category: 'engagement',
      page_title: 'Paste Drawer',
    });
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (window.history.length > 1) {
        router.back();
        return;
      }

      router.push('/home');
    }
  };

  return (
    <Drawer open onOpenChange={handleOpenChange} shouldScaleBackground={false}>
      <DrawerContent
        showHandle={false}
        className="mx-auto flex w-full max-w-[500px] flex-col overflow-hidden border-none bg-transparent p-0 shadow-none"
        style={{ touchAction: 'manipulation' }}
      >
        <div className="relative flex min-h-0 max-h-[92dvh] flex-col overflow-hidden rounded-t-[2rem] border border-white/80 bg-white shadow-[0_-18px_44px_rgb(15_23_42_/_0.14)]">
          <DrawerTitle className="sr-only">Add Reference</DrawerTitle>
          <DrawerDescription className="sr-only">
            Paste a TikTok, Instagram, or YouTube Shorts link and turn it into a video recipe.
          </DrawerDescription>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-0.5rem] top-0 h-24 bg-[radial-gradient(76%_70%_at_50%_0%,rgba(212,232,255,0.68)_0%,rgba(238,229,255,0.42)_44%,rgba(255,255,255,0)_80%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/95 to-transparent"
          />

          <div className="relative z-10 px-5 pb-2 pt-3">
            <div aria-hidden="true" className="mx-auto h-1.5 w-12 rounded-full bg-slate-300/80" />
            <button
              type="button"
              aria-label="Close Add Reference drawer"
              onClick={() => handleOpenChange(false)}
              className="absolute right-4 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white/92 text-slate-500 shadow-[0_10px_20px_rgb(15_23_42_/_0.05)] transition-colors duration-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-100/90"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="paste-drawer-scroll relative z-0 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1 sm:px-5">
            <URLInputForm variant="drawer" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
