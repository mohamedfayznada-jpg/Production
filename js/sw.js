// ======================================================
// MES CORE V28 Enterprise - Service Worker
// ======================================================

const CACHE_NAME = "mes-core-v28";
const STATIC_CACHE = [
    "/", "/index.html", "/css/style.css", "/manifest.json", "/assets/logo.png",
    "/js/app.js", "/js/api.js", "/js/auth.js", "/js/config.js", "/js/firebase.js", "/js/utils.js",
    "/js/storage.js", "/js/network.js", "/js/queue.js", "/js/sync.js", "/js/permissions.js",
    "/js/production.js", "/js/quality.js", "/js/waste.js", "/js/tpm.js", "/js/analytics.js", "/js/ui.js",
    "/js/router.js", "/js/events.js", "/js/logger.js", "/js/charts.js", "/js/theme.js", "/js/notifications.js"
];

self.addEventListener("install", event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE)).catch(() => undefined));
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;
    const request = event.request;
    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request).then(response => {
            if (response && response.status === 200 && response.type === "basic") {
                const cloned = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
            }
            return response;
        }).catch(() => caches.match("/index.html")))
    );
});

self.addEventListener("message", event => {
    if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
    if (event.data?.type === "CLEAR_CACHE") event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))));
});

self.addEventListener("push", event => {
    const data = event.data?.json?.() || { title: "MES CORE", body: "New notification" };
    event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: "/assets/logo.png", badge: "/assets/logo.png" }));
});

self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
        const client = list.find(item => "focus" in item);
        return client ? client.focus() : clients.openWindow?.("/");
    }));
});
