// ======================================================
// MES CORE V27 Enterprise
// File: /js/sw.js
// Part 1 / 4
// ======================================================

const CACHE_NAME = "mes-core-v27";

const STATIC_CACHE = [

    "/",

    "/index.html",

    "/css/style.css",

    "/manifest.json",

    "/assets/logo.png"

];

self.addEventListener(

    "install",

    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)

                .then(cache =>

                    cache.addAll(STATIC_CACHE)

                )

        );

        self.skipWaiting();

    }

);

self.addEventListener(

    "activate",

    event => {

        event.waitUntil(

            caches.keys()

                .then(keys =>

                    Promise.all(

                        keys.map(key => {

                            if (key !== CACHE_NAME) {

                                return caches.delete(key);

                            }

                        })

                    )

                )

        );

        self.clients.claim();

    }

);
// ======================================================
// MES CORE V27 Enterprise
// File: /js/sw.js
// Part 2 / 4
// ======================================================

self.addEventListener(

    "fetch",

    event => {

        event.respondWith(

            caches.match(event.request)

                .then(response => {

                    if (response) {

                        return response;

                    }

                    return fetch(event.request)

                        .then(networkResponse => {

                            if (

                                !networkResponse ||

                                networkResponse.status !== 200 ||

                                networkResponse.type !== "basic"

                            ) {

                                return networkResponse;

                            }

                            const cloned = networkResponse.clone();

                            caches.open(CACHE_NAME)

                                .then(cache => {

                                    cache.put(

                                        event.request,

                                        cloned

                                    );

                                });

                            return networkResponse;

                        });

                })

                .catch(() => caches.match("/index.html"))

        );

    }

);
// ======================================================
// MES CORE V27 Enterprise
// File: /js/sw.js
// Part 3 / 4
// ======================================================

self.addEventListener(

    "message",

    event => {

        if (!event.data) return;

        switch (event.data.type) {

            case "SKIP_WAITING":

                self.skipWaiting();

                break;

            case "CLEAR_CACHE":

                caches.keys().then(keys =>

                    Promise.all(

                        keys.map(key =>

                            caches.delete(key)

                        )

                    )

                );

                break;

            default:

                break;

        }

    }

);

self.addEventListener(

    "sync",

    event => {

        if (

            event.tag === "background-sync"

        ) {

            event.waitUntil(

                Promise.resolve()

            );

        }

    }

);

self.addEventListener(

    "push",

    event => {

        const data =

            event.data?.json() || {

                title: "MES CORE",

                body: "New notification"

            };

        event.waitUntil(

            self.registration.showNotification(

                data.title,

                {

                    body: data.body,

                    icon: "/assets/logo.png",

                    badge: "/assets/logo.png"

                }

            )

        );

    }

);
// ======================================================
// MES CORE V27 Enterprise
// File: /js/sw.js
// Part 4 / 4
// ======================================================

self.addEventListener(

    "notificationclick",

    event => {

        event.notification.close();

        event.waitUntil(

            clients.matchAll({

                type: "window",

                includeUncontrolled: true

            }).then(clientList => {

                for (const client of clientList) {

                    if ("focus" in client) {

                        return client.focus();

                    }

                }

                if (clients.openWindow) {

                    return clients.openWindow("/");

                }

            })

        );

    }

);

self.addEventListener(

    "notificationclose",

    () => {}

);

self.addEventListener(

    "error",

    event => {

        console.error(

            "Service Worker Error:",

            event.message

        );

    }

);

self.addEventListener(

    "unhandledrejection",

    event => {

        console.error(

            "Unhandled Promise:",

            event.reason

        );

    }

);
