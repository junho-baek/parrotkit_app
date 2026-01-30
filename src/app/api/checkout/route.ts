import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import '@/lib/lemonsqueezy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, userId, userEmail } = body;

    console.log('Checkout request:', { variantId, userId, userEmail });
    console.log('Store ID:', process.env.LEMONSQUEEZY_STORE_ID);
    console.log('Product ID:', process.env.LEMONSQUEEZY_PRODUCT_ID);

    if (!variantId) {
      return NextResponse.json(
        { error: 'Product variant ID is required' },
        { status: 400 }
      );
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID || process.env.LEMONSQUEEZY_PRODUCT_ID;
    
    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID or Product ID is not configured' },
        { status: 500 }
      );
    }

    // Lemon Squeezy Checkout 생성
    const checkout = await createCheckout(
      storeId,
      variantId,
      {
        checkoutData: {
          email: userEmail || undefined,
          custom: userId ? {
            userId: userId.toString(),
          } : undefined,
        },
      }
    );

    console.log('Checkout response:', checkout);

    if (!checkout || !checkout.data || !checkout.data.data) {
      console.error('Invalid checkout response:', checkout);
      throw new Error('Failed to create checkout - invalid response');
    }

    // GA4: 결제 시작
    return NextResponse.json({
      checkoutUrl: checkout.data.data.attributes.url,
    });
  } catch (error: any) {
    console.error('Checkout creation error:', error);
    console.error('Error details:', error.cause || error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
