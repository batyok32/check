import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

// const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";

// export default createMiddleware({
//     // A list of all locales that are supported
//     locales: ["en", "de"],

//     // Used when no locale matches
//     defaultLocale: locale,
// });

export default async function middleware(request) {
    // const requestUrl = new URL(request.url);

    // // Check if the request is to unpkg.com
    // if (requestUrl.hostname === "unpkg.com") {
    //     // Clone the request headers and set new headers
    //     const requestHeaders = new Headers(request.headers);
    //     requestHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
    //     requestHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");

    //     // You can also set request headers in NextResponse.rewrite
    //     const response = NextResponse.next({
    //         request: {
    //             // New request headers
    //             headers: requestHeaders,
    //         },
    //     });

    //     return response;
    // }

    const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";

    const handleI18nRouting = createMiddleware({
        locales: ["en", "ru", "tm", "cn"],
        defaultLocale: locale,
    });

    return handleI18nRouting(request);
}

export const config = {
    // Match only internationalized pathnames

    matcher: ["/((?!_next|.*\\..*).*)"],

    // matcher: ["/", "/(de|en)/:path*"],
};
