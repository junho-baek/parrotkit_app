'use client';

type EventPayload = Record<string, string | number | boolean | null | undefined>;
type GtagFn = (command: string, eventName: string, payload?: EventPayload) => void;

export async function logClientEvent(eventName: string, payload: EventPayload = {}) {
  if (typeof window !== 'undefined') {
    const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
    if (gtag) {
      gtag('event', eventName, payload);
    }
  }

  try {
    const token = localStorage.getItem('token');
    await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        eventName,
        payload,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      }),
    });
  } catch {
    // Event logging should never block user flow.
  }
}
