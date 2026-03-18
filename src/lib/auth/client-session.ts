'use client';

const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRES_AT_KEY = 'tokenExpiresAt';
const USER_KEY = 'user';
const REFRESH_BUFFER_MS = 90_000;

type PersistSessionInput = {
  token?: string | null;
  refreshToken?: string | null;
  expiresAt?: number | string | null;
  user?: unknown;
};

let refreshPromise: Promise<string | null> | null = null;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readNumber(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function mergeHeaders(headersInit: HeadersInit | undefined, token: string | null) {
  const headers = new Headers(headersInit);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers.delete('Authorization');
  }

  return headers;
}

export function persistClientSession({
  token,
  refreshToken,
  expiresAt,
  user,
}: PersistSessionInput) {
  if (!canUseStorage()) {
    return;
  }

  if (typeof token === 'string' && token.length > 0) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  if (typeof refreshToken === 'string' && refreshToken.length > 0) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (expiresAt !== undefined && expiresAt !== null && String(expiresAt).length > 0) {
    window.localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  }

  if (user !== undefined) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearClientSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function readAccessToken() {
  return canUseStorage() ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null;
}

export function readRefreshToken() {
  return canUseStorage() ? window.localStorage.getItem(REFRESH_TOKEN_KEY) : null;
}

export function readTokenExpiresAt() {
  return canUseStorage()
    ? readNumber(window.localStorage.getItem(TOKEN_EXPIRES_AT_KEY))
    : null;
}

function shouldRefreshToken(token: string | null, refreshToken: string | null, expiresAt: number | null, force: boolean) {
  if (!refreshToken) {
    return false;
  }

  if (force || !token) {
    return true;
  }

  if (!expiresAt) {
    return false;
  }

  return Date.now() >= expiresAt * 1000 - REFRESH_BUFFER_MS;
}

async function refreshAccessToken(force: boolean) {
  const token = readAccessToken();
  const refreshToken = readRefreshToken();
  const expiresAt = readTokenExpiresAt();

  if (!shouldRefreshToken(token, refreshToken, expiresAt, force)) {
    return token;
  }

  if (!refreshToken) {
    return token;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          clearClientSession();
          return null;
        }

        const data = await response.json();
        persistClientSession({
          token: typeof data.token === 'string' ? data.token : null,
          refreshToken: typeof data.refreshToken === 'string' ? data.refreshToken : null,
          expiresAt: data.expiresAt,
        });

        return typeof data.token === 'string' ? data.token : null;
      } catch {
        return token;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

export async function ensureValidAccessToken(options?: { force?: boolean }) {
  if (!canUseStorage()) {
    return null;
  }

  return refreshAccessToken(Boolean(options?.force));
}

export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const initialToken = await ensureValidAccessToken();
  let response = await fetch(input, {
    ...init,
    headers: mergeHeaders(init.headers, initialToken),
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshedToken = await ensureValidAccessToken({ force: true });
  if (!refreshedToken) {
    return response;
  }

  response = await fetch(input, {
    ...init,
    headers: mergeHeaders(init.headers, refreshedToken),
  });

  return response;
}
