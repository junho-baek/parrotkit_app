import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import '@/lib/lemonsqueezy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const variantId = String(body.variantId || '').trim();
    const authUserId = String(body.authUserId || body.userId || '').trim();
    const userEmail = String(body.userEmail || '').trim();

    if (!variantId) {
      return NextResponse.json({ error: 'Product variant ID is required' }, { status: 400 });
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID || process.env.LEMONSQUEEZY_PRODUCT_ID;
    if (!storeId) {
      return NextResponse.json({ error: 'Store ID or Product ID is not configured' }, { status: 500 });
    }

    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: userEmail || undefined,
        custom: {
          ...(authUserId ? { authUserId } : {}),
          ...(userEmail ? { email: userEmail } : {}),
        },
      },
    });

    if (!checkout?.data?.data?.attributes?.url) {
      throw new Error('Failed to create checkout - invalid response');
    }

    return NextResponse.json({
      checkoutUrl: checkout.data.data.attributes.url,
    });
  } catch (error: unknown) {
    console.error('Checkout creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
