'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/common';

const CHECKOUT_PENDING_KEY = 'parrotkit_pending_checkout';

export default function BillingCancelPage() {
  React.useEffect(() => {
    sessionStorage.removeItem(CHECKOUT_PENDING_KEY);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-4">
      <Card className="w-full max-w-xl text-center">
        <div className="mb-4 text-5xl">↩️</div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Checkout was not completed</h1>
        <p className="text-sm text-gray-600">
          No subscription change was applied. You can return to pricing and try again whenever you are ready.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/pricing" className="block">
            <Button>Back to Pricing</Button>
          </Link>
          <Link href="/home" className="block">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
