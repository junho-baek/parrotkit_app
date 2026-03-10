'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { captureMarketingAttribution } from '@/lib/tracking/attribution';

export function TrackingInitializer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serializedSearchParams = searchParams?.toString() || '';

  useEffect(() => {
    captureMarketingAttribution();
  }, [pathname, serializedSearchParams]);

  return null;
}
