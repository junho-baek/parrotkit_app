export const PASTE_DRAWER_QUERY_KEY = 'sheet';
export const PASTE_DRAWER_QUERY_VALUE = 'paste';
export const PASTE_DRAWER_HOME_HREF = `/home?${PASTE_DRAWER_QUERY_KEY}=${PASTE_DRAWER_QUERY_VALUE}`;

const PASTE_DRAWER_BASE_PATHS = new Set(['/home', '/explore', '/recipes', '/my']);

export function getPasteDrawerHref(pathname?: string | null) {
  const normalizedPath = pathname && PASTE_DRAWER_BASE_PATHS.has(pathname) ? pathname : '/home';
  return `${normalizedPath}?${PASTE_DRAWER_QUERY_KEY}=${PASTE_DRAWER_QUERY_VALUE}`;
}

export function isPasteDrawerOpen(search: { get(name: string): string | null } | null | undefined) {
  return search?.get(PASTE_DRAWER_QUERY_KEY) === PASTE_DRAWER_QUERY_VALUE;
}

export function removePasteDrawerQuery(pathname: string, search: { toString(): string } | null | undefined) {
  const params = new URLSearchParams(search?.toString() ?? '');
  params.delete(PASTE_DRAWER_QUERY_KEY);

  const nextQuery = params.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}
