'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/common';
import { authenticatedFetch, ensureValidAccessToken } from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';

const CHECKOUT_PENDING_KEY = 'parrotkit_pending_checkout';
const PURCHASE_LOGGED_KEY = 'parrotkit_purchase_success_logged';
const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 10;

type BillingState = 'checking' | 'active' | 'pending' | 'unauthorized' | 'error';

type ProfileResponse = {
  user?: {
    id: string;
    email: string;
    planType: string;
    subscriptionStatus: string;
    subscriptionEndsAt?: string | null;
  };
};

export default function BillingSuccessPage() {
  const [status, setStatus] = React.useState<BillingState>('checking');
  const [subscriptionEndsAt, setSubscriptionEndsAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const pollProfile = async () => {
      attempts += 1;

      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          setStatus('unauthorized');
          return;
        }

        const response = await authenticatedFetch('/api/user/profile');

        if (cancelled) {
          return;
        }

        if (response.status === 401) {
          setStatus('unauthorized');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = (await response.json()) as ProfileResponse;
        const planType = data.user?.planType;
        const subscriptionStatus = data.user?.subscriptionStatus;

        if (planType === 'pro' || subscriptionStatus === 'active') {
          setSubscriptionEndsAt(data.user?.subscriptionEndsAt || null);
          setStatus('active');

          const isPendingCheckout = sessionStorage.getItem(CHECKOUT_PENDING_KEY) === 'pro';
          const alreadyLogged = sessionStorage.getItem(PURCHASE_LOGGED_KEY) === '1';
          if (isPendingCheckout && !alreadyLogged) {
            sessionStorage.setItem(PURCHASE_LOGGED_KEY, '1');
            sessionStorage.removeItem(CHECKOUT_PENDING_KEY);
            await logClientEvent('purchase_success', {
              plan_name: 'Pro Plan',
              currency: 'USD',
              value: 9.99,
            });
          }
          return;
        }

        if (attempts >= MAX_POLL_ATTEMPTS) {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Billing success polling error:', error);
        if (attempts >= MAX_POLL_ATTEMPTS) {
          setStatus('error');
        }
      }
    };

    void pollProfile();
    const intervalId = window.setInterval(() => {
      if (attempts >= MAX_POLL_ATTEMPTS || cancelled) {
        window.clearInterval(intervalId);
        return;
      }

      void pollProfile();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-4">
      <Card className="w-full max-w-xl text-center">
        {status === 'checking' ? (
          <>
            <div className="mb-4 text-5xl">⏳</div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Verifying your subscription</h1>
            <p className="text-sm text-gray-600">
              Lemon Squeezy webhook is updating your profile. This usually takes a few seconds.
            </p>
          </>
        ) : null}

        {status === 'active' ? (
          <>
            <div className="mb-4 text-5xl">✅</div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Pro is active</h1>
            <p className="text-sm text-gray-600">
              Your profile has been upgraded. You can return to the app and keep creating.
            </p>
            {subscriptionEndsAt ? (
              <p className="mt-3 text-xs font-medium text-gray-500">
                Current renewal date: {new Date(subscriptionEndsAt).toLocaleString()}
              </p>
            ) : null}
          </>
        ) : null}

        {status === 'pending' ? (
          <>
            <div className="mb-4 text-5xl">🔄</div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Payment received, sync pending</h1>
            <p className="text-sm text-gray-600">
              Checkout completed but the webhook has not updated your profile yet. Refresh this page in a
              moment, or check your subscription from My Page.
            </p>
          </>
        ) : null}

        {status === 'unauthorized' ? (
          <>
            <div className="mb-4 text-5xl">🔐</div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Sign in required</h1>
            <p className="text-sm text-gray-600">
              We need your active session to confirm the upgraded plan on this device.
            </p>
          </>
        ) : null}

        {status === 'error' ? (
          <>
            <div className="mb-4 text-5xl">⚠️</div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">We could not verify the upgrade yet</h1>
            <p className="text-sm text-gray-600">
              The payment may still be valid. Check My Page in a few seconds or contact support if the plan
              does not update.
            </p>
          </>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/my" className="block">
            <Button>Go to My Page</Button>
          </Link>
          <Link href="/home" className="block">
            <Button variant="secondary">Back to Home</Button>
          </Link>
          {(status === 'pending' || status === 'error') ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Refresh status
            </button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
