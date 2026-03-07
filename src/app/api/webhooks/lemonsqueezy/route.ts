import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { insertEventLog } from '@/lib/event-logs';

type SubscriptionUpdatePayload = {
  subscription_id: string;
  subscription_status: string;
  plan_type?: string;
  subscription_ends_at?: string | null;
};

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return typeof value === 'object' && value !== null ? (value as JsonRecord) : {};
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizeEmail(value: string | null) {
  return value ? value.toLowerCase() : null;
}

function getWebhookContext(payload: unknown) {
  const root = asRecord(payload);
  const meta = asRecord(root.meta);
  const data = asRecord(root.data);
  const attributes = asRecord(data.attributes);
  const customData = {
    ...asRecord(attributes.custom_data),
    ...asRecord(meta.custom_data),
  };

  return {
    eventName: readString(meta.event_name),
    entityId: readString(data.id),
    attributes,
    customData,
    email:
      normalizeEmail(readString(customData.email)) ||
      normalizeEmail(readString(attributes.user_email)) ||
      normalizeEmail(readString(attributes.email)),
    authUserId:
      readString(customData.authUserId) ||
      readString(customData.userId) ||
      readString(attributes.user_id),
  };
}

function buildProfileUpdateFields(payload: SubscriptionUpdatePayload) {
  return {
    subscription_id: payload.subscription_id,
    subscription_status: payload.subscription_status,
    plan_type: payload.plan_type || 'free',
    subscription_ends_at: payload.subscription_ends_at || null,
    updated_at: new Date().toISOString(),
  };
}

async function updateProfileByAuthUserIdOrEmail(params: {
  authUserId?: string | null;
  email?: string | null;
  payload: SubscriptionUpdatePayload;
}) {
  const supabase = createSupabaseAdminClient();
  const updateFields = buildProfileUpdateFields(params.payload);

  if (params.authUserId) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updateFields)
      .eq('id', params.authUserId)
      .select('id')
      .maybeSingle();

    if (!error && data?.id) {
      return data.id;
    }

    if (error) {
      console.warn('Failed to update by authUserId, fallback to email:', error.message);
    }
  }

  if (params.email) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updateFields)
      .eq('email', normalizeEmail(params.email))
      .select('id')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data?.id || null;
  }

  return null;
}

async function updateProfileBySubscriptionId(payload: SubscriptionUpdatePayload) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({
      subscription_status: payload.subscription_status,
      plan_type: payload.plan_type || 'free',
      subscription_ends_at: payload.subscription_ends_at || null,
      updated_at: new Date().toISOString(),
    })
    .eq('subscription_id', payload.subscription_id)
    .select('id')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id || null;
}

async function logBillingWebhookEvent(params: {
  userId?: string | null;
  eventName: string;
  webhookEventName: string;
  subscriptionId: string;
  subscriptionStatus: string;
  planType: string;
  endsAt?: string | null;
  email?: string | null;
}) {
  await insertEventLog({
    userId: params.userId,
    eventName: params.eventName,
    page: '/api/webhooks/lemonsqueezy',
    payload: {
      source: 'lemonsqueezy_webhook',
      webhook_event_name: params.webhookEventName,
      subscription_id: params.subscriptionId,
      subscription_status: params.subscriptionStatus,
      plan_type: params.planType,
      subscription_ends_at: params.endsAt || null,
      email: params.email || null,
    },
  });
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
    const context = getWebhookContext(payload);
    const eventName = context.eventName;

    if (!eventName) {
      return NextResponse.json({ error: 'Missing event name' }, { status: 400 });
    }

    switch (eventName) {
      case 'subscription_created': {
        const subscriptionId = context.entityId;
        if (!subscriptionId) {
          throw new Error('Missing subscription id for subscription_created');
        }

        const updatedUserId = await updateProfileByAuthUserIdOrEmail({
          authUserId: context.authUserId,
          email: context.email,
          payload: {
            subscription_id: subscriptionId,
            subscription_status: 'active',
            plan_type: 'pro',
            subscription_ends_at: readString(context.attributes.renews_at),
          },
        });

        await logBillingWebhookEvent({
          userId: updatedUserId,
          eventName: 'purchase_success',
          webhookEventName: eventName,
          subscriptionId,
          subscriptionStatus: 'active',
          planType: 'pro',
          endsAt: readString(context.attributes.renews_at),
          email: context.email,
        });
        break;
      }

      case 'subscription_updated': {
        const subscriptionId = context.entityId;
        if (!subscriptionId) {
          throw new Error('Missing subscription id for subscription_updated');
        }

        const subscriptionStatus = readString(context.attributes.status) || 'active';
        const planType = subscriptionStatus === 'active' ? 'pro' : 'free';
        const updatedUserId =
          (context.authUserId || context.email
            ? await updateProfileByAuthUserIdOrEmail({
                authUserId: context.authUserId,
                email: context.email,
                payload: {
                  subscription_id: subscriptionId,
                  subscription_status: subscriptionStatus,
                  plan_type: planType,
                  subscription_ends_at: readString(context.attributes.renews_at),
                },
              })
            : null) ||
          (await updateProfileBySubscriptionId({
            subscription_id: subscriptionId,
            subscription_status: subscriptionStatus,
            plan_type: planType,
            subscription_ends_at: readString(context.attributes.renews_at),
          }));

        await logBillingWebhookEvent({
          userId: updatedUserId,
          eventName: 'subscription_updated',
          webhookEventName: eventName,
          subscriptionId,
          subscriptionStatus,
          planType,
          endsAt: readString(context.attributes.renews_at),
          email: context.email,
        });
        break;
      }

      case 'subscription_cancelled': {
        const subscriptionId = context.entityId;
        if (!subscriptionId) {
          throw new Error('Missing subscription id for subscription_cancelled');
        }

        const endsAt = readString(context.attributes.ends_at);
        const updatedUserId =
          (context.authUserId || context.email
            ? await updateProfileByAuthUserIdOrEmail({
                authUserId: context.authUserId,
                email: context.email,
                payload: {
                  subscription_id: subscriptionId,
                  subscription_status: 'cancelled',
                  plan_type: 'pro',
                  subscription_ends_at: endsAt,
                },
              })
            : null) ||
          (await updateProfileBySubscriptionId({
            subscription_id: subscriptionId,
            subscription_status: 'cancelled',
            plan_type: 'pro',
            subscription_ends_at: endsAt,
          }));

        await logBillingWebhookEvent({
          userId: updatedUserId,
          eventName: 'subscription_cancelled',
          webhookEventName: eventName,
          subscriptionId,
          subscriptionStatus: 'cancelled',
          planType: 'pro',
          endsAt,
          email: context.email,
        });
        break;
      }

      case 'subscription_payment_success': {
        const subscriptionId =
          readString(context.attributes.subscription_id) || context.entityId;
        if (!subscriptionId) {
          throw new Error('Missing subscription id for subscription_payment_success');
        }

        const endsAt = readString(context.attributes.renews_at);
        const updatedUserId =
          (context.authUserId || context.email
            ? await updateProfileByAuthUserIdOrEmail({
                authUserId: context.authUserId,
                email: context.email,
                payload: {
                  subscription_id: subscriptionId,
                  subscription_status: 'active',
                  plan_type: 'pro',
                  subscription_ends_at: endsAt,
                },
              })
            : null) ||
          (await updateProfileBySubscriptionId({
            subscription_id: subscriptionId,
            subscription_status: 'active',
            plan_type: 'pro',
            subscription_ends_at: endsAt,
          }));

        await logBillingWebhookEvent({
          userId: updatedUserId,
          eventName: 'purchase_success',
          webhookEventName: eventName,
          subscriptionId,
          subscriptionStatus: 'active',
          planType: 'pro',
          endsAt,
          email: context.email,
        });
        break;
      }

      case 'subscription_expired': {
        const subscriptionId = context.entityId;
        if (!subscriptionId) {
          throw new Error('Missing subscription id for subscription_expired');
        }

        const endsAt = readString(context.attributes.ends_at);
        const updatedUserId =
          (context.authUserId || context.email
            ? await updateProfileByAuthUserIdOrEmail({
                authUserId: context.authUserId,
                email: context.email,
                payload: {
                  subscription_id: subscriptionId,
                  subscription_status: 'expired',
                  plan_type: 'free',
                  subscription_ends_at: endsAt,
                },
              })
            : null) ||
          (await updateProfileBySubscriptionId({
            subscription_id: subscriptionId,
            subscription_status: 'expired',
            plan_type: 'free',
            subscription_ends_at: endsAt,
          }));

        await logBillingWebhookEvent({
          userId: updatedUserId,
          eventName: 'subscription_expired',
          webhookEventName: eventName,
          subscriptionId,
          subscriptionStatus: 'expired',
          planType: 'free',
          endsAt,
          email: context.email,
        });
        break;
      }

      default:
        console.log('Unhandled event:', eventName);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
