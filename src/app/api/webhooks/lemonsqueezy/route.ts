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
        break;

      case 'subscription_created':
        {
          const customData = data.attributes.custom_data;
          const userId = customData?.userId;
          const userEmail = data.attributes.user_email;

          console.log('Subscription created:', { userId, userEmail, subscriptionId: data.id });

          if (userId) {
            await db.update(mvpUsers)
              .set({
                subscriptionId: data.id,
                subscriptionStatus: 'active',
                planType: 'pro',
                subscriptionEndsAt: new Date(data.attributes.renews_at),
                updatedAt: new Date(),
              })
              .where(eq(mvpUsers.id, parseInt(userId)));
            
            console.log(`✅ User ${userId} subscription activated`);
          } else if (userEmail) {
            // userId가 없으면 이메일로 찾기
            await db.update(mvpUsers)
              .set({
                subscriptionId: data.id,
                subscriptionStatus: 'active',
                planType: 'pro',
                subscriptionEndsAt: new Date(data.attributes.renews_at),
                updatedAt: new Date(),
              })
              .where(eq(mvpUsers.email, userEmail));
            
            console.log(`✅ User (${userEmail}) subscription activated`);
          }
        }
        break;

      case 'subscription_updated':
        {
          const subscriptionId = data.id;
          const status = data.attributes.status;
          
          console.log('Subscription updated:', { subscriptionId, status });

          await db.update(mvpUsers)
            .set({
              subscriptionStatus: status,
              subscriptionEndsAt: data.attributes.renews_at ? new Date(data.attributes.renews_at) : null,
              updatedAt: new Date(),
            })
            .where(eq(mvpUsers.subscriptionId, subscriptionId));
          
          console.log(`✅ Subscription ${subscriptionId} updated to ${status}`);
        }
        break;

      case 'subscription_cancelled':
        {
          const subscriptionId = data.id;
          
          console.log('Subscription cancelled:', subscriptionId);

          await db.update(mvpUsers)
            .set({
              subscriptionStatus: 'cancelled',
              updatedAt: new Date(),
            })
            .where(eq(mvpUsers.subscriptionId, subscriptionId));
          
          console.log(`✅ Subscription ${subscriptionId} cancelled`);
        }
        break;

      case 'subscription_payment_success':
        {
          const subscriptionId = data.attributes.subscription_id;
          
          console.log('Payment success:', subscriptionId);

          // 결제 성공 시 구독 연장
          await db.update(mvpUsers)
            .set({
              subscriptionStatus: 'active',
              subscriptionEndsAt: data.attributes.renews_at ? new Date(data.attributes.renews_at) : null,
              updatedAt: new Date(),
            })
            .where(eq(mvpUsers.subscriptionId, subscriptionId));
          
          console.log(`✅ Subscription ${subscriptionId} payment successful, renewed`);
        }
        break;

      case 'subscription_expired':
        {
          const subscriptionId = data.id;
          
          console.log('Subscription expired:', subscriptionId);

          await db.update(mvpUsers)
            .set({
              subscriptionStatus: 'expired',
              planType: 'free',
              updatedAt: new Date(),
            })
            .where(eq(mvpUsers.subscriptionId, subscriptionId));
          
          console.log(`✅ Subscription ${subscriptionId} expired, reverted to free plan`);
        }
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
