// Thin wrappers around the Express API. In development Vite proxies /api to
// the server. For a separate deployment, set VITE_API_URL to the server's URL.
const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const getMe = () => request('/me');

export const getFeed = () => request('/feed');

export const getMatches = () => request('/matches');

export const sendSwipe = (profileId, action) =>
  request('/swipe', { method: 'POST', body: JSON.stringify({ profileId, action }) });
