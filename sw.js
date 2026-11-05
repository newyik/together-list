// Replace the old app's service worker with a one-time cleanup worker.
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try {
      await self.registration.unregister();
    } catch (error) {}
    try {
      const keys = await caches.keys();
      await Promise.all(keys
        .filter(function (key) { return key.indexOf('together-list') !== -1; })
        .map(function (key) { return caches.delete(key); }));
    } catch (error) {}
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      try { client.navigate(client.url); } catch (error) {}
    }
  }()));
});
