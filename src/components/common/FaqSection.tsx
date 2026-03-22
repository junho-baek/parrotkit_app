'use client';

import Link from 'next/link';
import { FAQ_ITEMS } from '@/lib/faq';

type FaqSectionProps = {
  title?: string;
  showViewAllLink?: boolean;
  className?: string;
};

export function FaqSection({
  title = 'FAQ',
  showViewAllLink = false,
  className = '',
}: FaqSectionProps) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {showViewAllLink ? (
          <Link
            href="/faq"
            className="text-sm font-semibold text-fuchsia-500 transition-colors hover:text-violet-600"
          >
            Open FAQ
          </Link>
        ) : null}
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
          >
            <h3 className="text-base font-semibold text-gray-900">{item.question}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
