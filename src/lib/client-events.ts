'use client';

type EventPayload = Record<string, string | number | boolean | null | undefined>;

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

function buildEventPayload(payload: EventPayload) {
  const authUserId = readStoredUserId();
  const pagePath = typeof window !== 'undefined' ? window.location.pathname : undefined;

  return {
    ...payload,
    ...(pagePath ? { page_path: pagePath } : {}),
    ...(authUserId ? { auth_user_id: authUserId } : {}),
  };
}

export async function logClientEvent(eventName: string, payload: EventPayload = {}) {
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
    const token = localStorage.getItem('token');
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
