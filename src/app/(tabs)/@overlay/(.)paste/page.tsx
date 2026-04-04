'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PasteDrawer } from '@/components/auth';
import { logClientEvent } from '@/lib/client-events';

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

  return <PasteDrawer open onOpenChange={handleOpenChange} />;
}
