'use client';

import Link from 'next/link';
import React from 'react';
import { FaqSection } from '@/components/common';
import { FAQ_ITEMS } from '@/lib/faq';
import { logClientEvent } from '@/lib/client-events';

export default function FaqPage() {
  React.useEffect(() => {
    void logClientEvent('view_faq', {
      event_category: 'engagement',
      page_title: 'FAQ Page',
      faq_count: FAQ_ITEMS.length,
    });
  }, []);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="relative flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        <Link
          href="/my"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700 transition-colors hover:text-fuchsia-500"
        >
          ← Back
        </Link>
        <h1 className="text-center text-xl font-bold text-gray-900">FAQ</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
              Support
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Answers you can reach fast
            </h2>
          </div>

          <FaqSection />

          <div className="mt-10 text-center">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-fuchsia-500 transition-colors hover:text-violet-600"
            >
              View pricing details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
