import type { TrackingAutoContext } from './events';

const FIRST_TOUCH_KEY = 'parrotkit_tracking_first_touch_v1';
const LAST_TOUCH_KEY = 'parrotkit_tracking_last_touch_v1';

const ATTR_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
  'ttclid',
] as const;

type AttributionParamKey = (typeof ATTR_PARAM_KEYS)[number];

type AttributionSnapshot = {
  captured_at: string;
  landing_page?: string;
  referrer?: string;
} & Partial<Record<AttributionParamKey, string>>;

function isBrowser() {
  return typeof window !== 'undefined';
}

function readStorage(key: string): AttributionSnapshot | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AttributionSnapshot;
  } catch {
    return null;
  }
}

function writeStorage(key: string, snapshot: AttributionSnapshot) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(snapshot));
}

function buildSnapshotFromWindow(): AttributionSnapshot {
  const searchParams = new URLSearchParams(window.location.search);
  const snapshot: AttributionSnapshot = {
    captured_at: new Date().toISOString(),
    landing_page: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || undefined,
  };

  for (const key of ATTR_PARAM_KEYS) {
    const value = searchParams.get(key);
    if (value) {
      snapshot[key] = value;
    }
  }

  return snapshot;
}

function hasCampaignIdentifiers(snapshot: AttributionSnapshot) {
  return ATTR_PARAM_KEYS.some((key) => Boolean(snapshot[key]));
}

function toTrackingContext(snapshot: AttributionSnapshot | null, prefix = ''): Partial<TrackingAutoContext> {
  if (!snapshot) {
    return {};
  }

  const context: Partial<TrackingAutoContext> = {};

  const landingPageKey =
    prefix === 'first_touch_' ? 'first_touch_landing_page' : 'landing_page';
  const referrerKey = prefix === 'first_touch_' ? 'first_touch_referrer' : 'referrer';

  if (snapshot.landing_page) {
    context[landingPageKey] = snapshot.landing_page;
  }

  if (snapshot.referrer) {
    context[referrerKey] = snapshot.referrer;
  }

  for (const key of ATTR_PARAM_KEYS) {
    const value = snapshot[key];
    if (!value) {
      continue;
    }

    const contextKey =
      prefix === 'first_touch_'
        ? (`first_touch_${key}` as keyof TrackingAutoContext)
        : (key as keyof TrackingAutoContext);

    context[contextKey] = value;
  }

  return context;
}

export function captureMarketingAttribution() {
  if (!isBrowser()) {
    return;
  }

  const currentSnapshot = buildSnapshotFromWindow();
  const existingFirstTouch = readStorage(FIRST_TOUCH_KEY);
  const existingLastTouch = readStorage(LAST_TOUCH_KEY);

  if (!existingFirstTouch) {
    writeStorage(FIRST_TOUCH_KEY, currentSnapshot);
  }

  if (!existingLastTouch || hasCampaignIdentifiers(currentSnapshot)) {
    writeStorage(LAST_TOUCH_KEY, currentSnapshot);
  }
}

export function getTrackingAutoContext(): TrackingAutoContext {
  if (!isBrowser()) {
    return {};
  }

  const lastTouch = readStorage(LAST_TOUCH_KEY);
  const firstTouch = readStorage(FIRST_TOUCH_KEY);

  return {
    ...toTrackingContext(lastTouch),
    ...toTrackingContext(firstTouch, 'first_touch_'),
  };
}

