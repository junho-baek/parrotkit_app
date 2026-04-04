'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { URLInputForm } from '@/components/auth';
import { logClientEvent } from '@/lib/client-events';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

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
        className="mx-auto flex max-h-[88dvh] w-full max-w-[500px] flex-col overflow-hidden border-none bg-transparent p-0 shadow-none"
        style={{ touchAction: 'manipulation' }}
      >
        <div className="overflow-hidden rounded-t-[2rem] border border-white/70 bg-[image:var(--brand-soft-surface)] shadow-[0_-18px_42px_rgb(15_23_42_/_0.14)]">
          <DrawerHeader className="border-b border-white/60 px-5 pb-4 pt-3 text-left">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DrawerTitle className="text-lg font-semibold text-slate-950">Add Reference</DrawerTitle>
                <DrawerDescription className="text-sm leading-6 text-slate-600">
                  Paste a link, analyze the motion, and turn the video into a reusable recipe flow.
                </DrawerDescription>
              </div>
              <button
                type="button"
                aria-label="Close Add Reference drawer"
                onClick={() => handleOpenChange(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-500 shadow-[0_10px_20px_rgb(15_23_42_/_0.06)] transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-100/90"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </DrawerHeader>

          <div className="paste-drawer-scroll overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <URLInputForm variant="drawer" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
