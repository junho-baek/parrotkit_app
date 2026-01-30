import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { mvpUsers } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 401 });
    }

    // Webhook 서명 검증
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');

    if (signature !== digest) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { meta, data } = payload;

    // 이벤트 타입별 처리
    switch (meta.event_name) {
      case 'order_created':
        console.log('Order created:', data.attributes.first_order_item);
        // 주문 생성 처리
        break;

      case 'subscription_created':
        // 구독 생성 처리
        const userId = data.attributes.custom_data?.user_id;
        if (userId) {
          // TODO: users 테이블에 subscription_status 컬럼 추가 후 업데이트
          console.log(`Subscription created for user ${userId}`);
        }
        break;

      case 'subscription_updated':
        // 구독 업데이트 처리
        console.log('Subscription updated:', data.attributes);
        break;

      case 'subscription_cancelled':
        // 구독 취소 처리
        console.log('Subscription cancelled:', data.attributes);
        break;

      case 'subscription_payment_success':
        // 결제 성공 처리
        console.log('Payment success:', data.attributes);
        break;

      default:
        console.log('Unhandled event:', meta.event_name);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
