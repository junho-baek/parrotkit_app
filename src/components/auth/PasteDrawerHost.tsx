'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PasteDrawer } from './PasteDrawer';
import { logClientEvent } from '@/lib/client-events';
import { isPasteDrawerOpen, removePasteDrawerQuery } from '@/lib/paste-drawer';

export function PasteDrawerHost() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const open = isPasteDrawerOpen(searchParams);

  useEffect(() => {
    if (!open) {
      return;
    }

    void logClientEvent('view_submit_video_page', {
      event_category: 'engagement',
      page_title: 'Paste Drawer',
    });
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      return;
    }

    const target = removePasteDrawerQuery(pathname || '/home', searchParams);
    router.replace(target);
  };

  if (!open) {
    return null;
  }

  return <PasteDrawer open={open} onOpenChange={handleOpenChange} />;
}
