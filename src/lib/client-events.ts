'use client';

import { getTrackingAutoContext } from '@/lib/tracking/attribution';
import { ensureValidAccessToken } from '@/lib/auth/client-session';
import type {
  ClientEventName,
  ClientEventPayload,
  ClientEventPayloadWithContext,
} from '@/lib/tracking/events';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type StoredUser = {
  id?: unknown;
};

function readStoredUserId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = window.localStorage.getItem('user');
  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as StoredUser;
    return typeof parsed.id === 'string' ? parsed.id : null;
  } catch {
    return null;
  }
}

function buildEventPayload<TEventName extends ClientEventName>(
  payload: ClientEventPayload<TEventName>
): ClientEventPayloadWithContext<TEventName> {
  const authUserId = readStoredUserId();
  const pagePath = typeof window !== 'undefined' ? window.location.pathname : undefined;
  const trackingContext = getTrackingAutoContext();

  return {
    ...payload,
    ...trackingContext,
    ...(pagePath ? { page_path: pagePath } : {}),
    ...(authUserId ? { auth_user_id: authUserId } : {}),
  } as ClientEventPayloadWithContext<TEventName>;
}

export async function logClientEvent<TEventName extends ClientEventName>(
  eventName: TEventName,
  payload: ClientEventPayload<TEventName>
) {
  const normalizedPayload =
    typeof window !== 'undefined' ? buildEventPayload(payload) : payload;

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...normalizedPayload,
    });
  }

  try {
    const token = await ensureValidAccessToken();
    await fetch('/api/events', {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        eventName,
        payload: normalizedPayload,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      }),
    });
  } catch {
    // Event logging should never block user flow.
  }
}
