// /** @type {import('next').NextConfig} */
// import withNextIntl from "next-intl/plugin";
// const nextConfig = { reactStrictMode: false };
// const nextIntlConfig = withNextIntl();

// module.exports = nextIntlConfig(nextConfig);

const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // async headers() {
    //     return [
    //         {
    //             source: "/sw.js",
    //             headers: [
    //                 { key: "Service-Worker-Allowed", value: "/" },
    //                 { key: "Cache-Control", value: "no-cache" },
    //             ],
    //         },
    //         // Other headers
    //     ];
    // },
    // async headers() {
    //     return [
    //         // {
    //         //     // Apply COOP header only to the /[locale]/seller/listing/new route
    //         //     source: "/:locale/seller/listing/new",
    //         //     headers: [
    //         //         { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    //         //         {
    //         //             key: "Cross-Origin-Embedder-Policy",
    //         //             value: "require-corp",
    //         //         },
    //         //     ],
    //         // },
    //         // {
    //         //     // For all other pages, set a different policy or no policy
    //         //     source: "/:path*",
    //         //     headers: [
    //         //         {
    //         //             key: "Access-Control-Allow-Origin",
    //         //             value: "*",
    //         //         },
    //         //         // You can omit COOP header or set a different policy here
    //         //     ],
    //         // },
    //     ];
    // },
};

module.exports = withNextIntl(nextConfig);
