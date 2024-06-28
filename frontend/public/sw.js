self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.hostname === "localhost" && url.port === "8000") {
        // Allow the request without modifying headers
        return;
    }

    const pathMatch = /^\/[a-z]{2}\/seller\/listing\/new/.test(url.pathname);

    // My url is ->  /:locale/seller/listing/new
    if (pathMatch) {
        const newHeaders = new Headers(request.headers);
        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
        newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");

        const newRequest = new Request(request, {
            headers: newHeaders,
        });

        event.respondWith(fetch(newRequest));
    }
});
