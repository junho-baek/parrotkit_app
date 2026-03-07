import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { requireAuthenticatedUser } from '@/lib/auth/server-auth';
import { ensureLemonSqueezyConfigured } from '@/lib/lemonsqueezy';

function getAppUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  return new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  try {
    ensureLemonSqueezyConfigured();
    const authUser = await requireAuthenticatedUser(request);

    const body = await request.json();
    const variantId = String(body.variantId || '').trim();

    if (!variantId) {
      return NextResponse.json({ error: 'Product variant ID is required' }, { status: 400 });
    }

    if (!authUser.email) {
      return NextResponse.json({ error: 'Authenticated email is required' }, { status: 400 });
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID || process.env.LEMONSQUEEZY_PRODUCT_ID;
    if (!storeId) {
      return NextResponse.json({ error: 'Store ID or Product ID is not configured' }, { status: 500 });
    }

    const successUrl = `${getAppUrl(request)}/billing/success`;

    const checkout = await createCheckout(storeId, variantId, {
      productOptions: {
        redirectUrl: successUrl,
      },
      checkoutData: {
        email: authUser.email,
        custom: {
          authUserId: authUser.id,
          email: authUser.email,
        },
      },
    });

    if (!checkout?.data?.data?.attributes?.url) {
      throw new Error('Failed to create checkout - invalid response');
    }

    return NextResponse.json({
      checkoutUrl: checkout.data.data.attributes.url,
      successUrl,
      cancelUrl: `${getAppUrl(request)}/billing/cancel`,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Checkout creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
