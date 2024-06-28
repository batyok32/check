// middleware.js

import { NextResponse } from "next/server";

export function middleware(request) {
    const requestUrl = new URL(request.url);

    // Check if the request is to unpkg.com
    if (requestUrl.hostname === "unpkg.com") {
        // Clone the request headers and set new headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
        requestHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");

        // You can also set request headers in NextResponse.rewrite
        const response = NextResponse.next({
            request: {
                // New request headers
                headers: requestHeaders,
            },
        });

        return response;
    }

    // If the request is not to unpkg.com, pass it through
    return NextResponse.next();
}
