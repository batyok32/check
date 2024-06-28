// self.addEventListener("fetch", (event) => {
//     if (event.request.url.startsWith("https://unpkg.com/")) {
//         const headers = new Headers(event.request.headers);
//         headers.set("Cross-Origin-Opener-Policy", "same-origin");
//         headers.set("Cross-Origin-Embedder-Policy", "require-corp");
//         const modifiedRequest = new Request(event.request, { headers });
//         event.respondWith(fetch(modifiedRequest));
//     }
// });

self.addEventListener("fetch", (event) => {
    const request = event.request;
    console.log("IN SW JS");

    if (request.url.startsWith("https://unpkg.com/")) {
        // Clone the request to avoid modifying the original request
        const modifiedRequest = new Request(request, {
            headers: new Headers({
                "Cross-Origin-Opener-Policy": "same-origin",
                "Cross-Origin-Embedder-Policy": "require-corp",
            }),
        });

        event.respondWith(fetch(modifiedRequest));
    }
});
