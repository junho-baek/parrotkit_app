'use client';

import { URLInputForm } from './URLInputForm';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';

interface PasteDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasteDrawer({ open, onOpenChange }: PasteDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent
        showHandle={false}
        className="mx-auto flex w-full max-w-[500px] flex-col overflow-hidden border-none bg-transparent p-0 shadow-none"
        style={{ touchAction: 'manipulation' }}
      >
        <div className="relative flex h-[min(733px,92dvh)] min-h-0 max-h-[92dvh] flex-col overflow-hidden rounded-t-[2rem] border border-white/80 bg-white shadow-[0_-18px_44px_rgb(15_23_42_/_0.14)]">
          <DrawerTitle className="sr-only">Add Reference</DrawerTitle>
          <DrawerDescription className="sr-only">
            Paste a viral TikTok, Instagram Reels, or YouTube Shorts link, then turn it into your own content recipe.
          </DrawerDescription>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-0.75rem] top-0 h-48 bg-[radial-gradient(74%_62%_at_50%_0%,rgba(213,232,255,0.74)_0%,rgba(238,228,255,0.46)_40%,rgba(255,255,255,0)_80%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/90 to-transparent"
          />

          <div className="relative z-10 px-5 pb-1 pt-4">
            <div aria-hidden="true" className="mx-auto h-1.5 w-12 rounded-full bg-slate-300/80" />
          </div>

          <div className="paste-drawer-scroll relative z-0 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:px-5">
            <URLInputForm variant="drawer" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
