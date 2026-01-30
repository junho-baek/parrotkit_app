import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import '@/lib/lemonsqueezy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, userId, userEmail } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: 'Product variant ID is required' },
        { status: 400 }
      );
    }

    // Lemon Squeezy Checkout 생성
    const checkout = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      variantId,
      {
        checkoutData: {
          email: userEmail,
          custom: {
            user_id: userId?.toString(),
          },
        },
      }
    );

    if (!checkout.data) {
      throw new Error('Failed to create checkout');
    }

    // GA4: 결제 시작
    return NextResponse.json({
      checkoutUrl: checkout.data.data.attributes.url,
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
