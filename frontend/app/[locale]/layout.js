import BootstrapClient from "@/components/BootstrapClient";
import { LayoutProvider } from "./layout_provider";
import ReduxProvider from "@/redux/provider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthValidateLayout } from "./authValidateLayout";
import { NextIntlClientProvider, useMessages } from "next-intl";

import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "YuuSell.com - Explore, Shop, and Sell in a Vibrant Marketplace",
    description:
        "Discover a world of unique products and exciting deals on YuuSell.com, the ultimate destination for buyers and sellers to connect in a dynamic online marketplace. Shop now and experience the joy of finding just what you need!",
    keywords:
        "YuuSell, online marketplace, multi-vendor ecommerce, shopping, online shopping, buy online, sell online, deals, products, unique products",
};

function RootLayout({ children, params: { locale } }) {
    const messages = useMessages();
    return (
        <NextIntlClientProvider messages={messages}>
            <html lang={locale}>
                <body className={inter.className}>
                    <BootstrapClient />
                    <ReduxProvider>
                        <AuthValidateLayout>
                            <LayoutProvider>
                                <ToastContainer />

                                <main>{children}</main>
                            </LayoutProvider>
                        </AuthValidateLayout>
                    </ReduxProvider>
                </body>
            </html>
        </NextIntlClientProvider>
    );
}

export default RootLayout;
