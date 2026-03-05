import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

type SubscriptionUpdatePayload = {
  subscription_id: string;
  subscription_status: string;
  plan_type?: string;
  subscription_ends_at?: string | null;
};

async function updateProfileByAuthUserIdOrEmail(params: {
  authUserId?: string;
  email?: string;
  payload: SubscriptionUpdatePayload;
}) {
  const supabase = createSupabaseAdminClient();

  if (params.authUserId) {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_id: params.payload.subscription_id,
        subscription_status: params.payload.subscription_status,
        plan_type: params.payload.plan_type || 'free',
        subscription_ends_at: params.payload.subscription_ends_at || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.authUserId);

    if (!error) {
      return;
    }

    console.warn('Failed to update by authUserId, fallback to email:', error.message);
  }

  if (params.email) {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_id: params.payload.subscription_id,
        subscription_status: params.payload.subscription_status,
        plan_type: params.payload.plan_type || 'free',
        subscription_ends_at: params.payload.subscription_ends_at || null,
        updated_at: new Date().toISOString(),
      })
      .eq('email', params.email.toLowerCase());

    if (error) {
      throw error;
    }
  }
}

async function updateProfileBySubscriptionId(payload: SubscriptionUpdatePayload) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: payload.subscription_status,
      plan_type: payload.plan_type || 'free',
      subscription_ends_at: payload.subscription_ends_at || null,
      updated_at: new Date().toISOString(),
    })
    .eq('subscription_id', payload.subscription_id);

  if (error) {
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 401 });
    }

    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');

    if (signature !== digest) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { meta, data } = payload;

    switch (meta.event_name) {
      case 'subscription_created': {
        const customData = data.attributes.custom_data || {};
        const authUserId = customData.authUserId || customData.userId;
        const email = customData.email || data.attributes.user_email;

        await updateProfileByAuthUserIdOrEmail({
          authUserId,
          email,
          payload: {
            subscription_id: data.id,
            subscription_status: 'active',
            plan_type: 'pro',
            subscription_ends_at: data.attributes.renews_at || null,
          },
        });
        break;
      }

      case 'subscription_updated': {
        const authUserId = data.attributes.custom_data?.authUserId || null;
        const email = data.attributes.user_email || null;
        const payload = {
          subscription_id: data.id,
          subscription_status: data.attributes.status || 'active',
          plan_type: data.attributes.status === 'active' ? 'pro' : 'free',
          subscription_ends_at: data.attributes.renews_at || null,
        };

        if (authUserId || email) {
          await updateProfileByAuthUserIdOrEmail({ authUserId, email, payload });
        } else {
          await updateProfileBySubscriptionId(payload);
        }
        break;
      }

      case 'subscription_cancelled': {
        const authUserId = data.attributes.custom_data?.authUserId || null;
        const email = data.attributes.user_email || null;
        const payload = {
          subscription_id: data.id,
          subscription_status: 'cancelled',
          plan_type: 'pro',
          subscription_ends_at: data.attributes.ends_at || null,
        };

        if (authUserId || email) {
          await updateProfileByAuthUserIdOrEmail({ authUserId, email, payload });
        } else {
          await updateProfileBySubscriptionId(payload);
        }
        break;
      }

      case 'subscription_payment_success': {
        const email = data.attributes.user_email || null;
        const authUserId = data.attributes.custom_data?.authUserId || null;
        const payload = {
          subscription_id: data.attributes.subscription_id,
          subscription_status: 'active',
          plan_type: 'pro',
          subscription_ends_at: data.attributes.renews_at || null,
        };
        if (authUserId || email) {
          await updateProfileByAuthUserIdOrEmail({ authUserId, email, payload });
        } else {
          await updateProfileBySubscriptionId(payload);
        }
        break;
      }

      case 'subscription_expired': {
        const authUserId = data.attributes.custom_data?.authUserId || null;
        const email = data.attributes.user_email || null;
        const payload = {
          subscription_id: data.id,
          subscription_status: 'expired',
          plan_type: 'free',
          subscription_ends_at: data.attributes.ends_at || null,
        };

        if (authUserId || email) {
          await updateProfileByAuthUserIdOrEmail({ authUserId, email, payload });
        } else {
          await updateProfileBySubscriptionId(payload);
        }
        break;
      }

      default:
        console.log('Unhandled event:', meta.event_name);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
