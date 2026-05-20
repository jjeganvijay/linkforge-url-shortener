export const PENDING_URL_KEY = 'pendingShortenUrl';

export function savePendingUrl(url) {
  if (url?.trim()) {
    sessionStorage.setItem(PENDING_URL_KEY, url.trim());
  }
}

export function readPendingUrl() {
  return sessionStorage.getItem(PENDING_URL_KEY) || null;
}

export function clearPendingUrl() {
  sessionStorage.removeItem(PENDING_URL_KEY);
}

/** Route where a pending URL should be completed */
export const CREATE_LINK_PATH = '/dashboard/create';

export function resolvePendingUrl(locationState) {
  return locationState?.pendingUrl || readPendingUrl();
}
