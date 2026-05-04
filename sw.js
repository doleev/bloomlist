// BloomList service worker.
// One job: receive web-push events from the notify-list-add edge function and surface
// them as native notifications on the device. Tap routes to the right list.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  // Edge function sends JSON: { title, body, url, tag, list_id }. Fall back gracefully
  // if a payload-less push ever arrives (some browsers do this if encryption hiccups).
  let data = { title: 'BloomList', body: 'New activity in a shared list', url: '/', tag: 'bloomlist' };
  if (event.data) {
    try { data = { ...data, ...event.data.json() }; } catch { data.body = event.data.text() || data.body; }
  }
  event.waitUntil(self.registration.showNotification(data.title, {
    body:  data.body,
    tag:   data.tag,           // collapse repeats for the same list
    icon:  '/icon-192.png',
    badge: '/icon-192.png',
    data:  { url: data.url },
  }));
});

// Tap behavior: if a window is already open, focus it and post a navigate hint;
// otherwise open a new window at the deep-link URL.
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (c.url.includes(self.location.origin)) {
        c.postMessage({ type: 'navigate', url });
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
