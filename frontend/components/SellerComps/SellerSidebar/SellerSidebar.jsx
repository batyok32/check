"use client";

import Link from "next/link";
import {
    IconChevronDown,
    IconChevronsDown,
    IconDeviceAnalytics,
    IconHelp,
    IconMapPin,
    IconReport,
    IconSettings,
} from "@tabler/icons-react";
import { IconBuildingBank, IconSpeakerphone } from "@tabler/icons-react";
import {
    IconBoxSeam,
    IconBuildingStore,
    IconDeviceDesktopAnalytics,
    IconHome,
    IconMessage,
    IconStars,
    IconTruckDelivery,
    IconVocabulary,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";

function SellerSidebar() {
    const pathname = usePathname();
    const { seller_profile, user } = useAppSelector((state) => state.auth);
    const t = useTranslations("SellerSidebar");
    return (
        <>
            <div className="fs-15 fw-bold flex-column text-black py-2 border-bottom mb-2 bg-white user-select-none">
                <Link
                    href="/"
                    className="d-flex align-items-center justify-content-center"
                >
                    <img src="/logo2.jpg" alt="" style={{ height: 30 }} />{" "}
                    <img
                        src="/logo3.jpg"
                        alt=""
                        style={{ marginLeft: "-8px", height: 25 }}
                    />{" "}
                </Link>

                <div className="w-100 px-2">
                    <div className="text-center text-lightgray mt-4 fs-13 fw-medium mb-1 truncate-overflow-1">
                        {user.email}
                    </div>
                    <div className="text-center fs-13 fw-medium mb-2">
                        {seller_profile.store_name}
                    </div>

                    <div className="text-center fs-13 fw-medium mb-2">
                        $
                        {(
                            parseFloat(seller_profile.available_balance) +
                            parseFloat(seller_profile.on_hold_balance)
                        ).toFixed(2)}
                    </div>
                </div>
            </div>
            <div className="interactive-sidebar-list">
                <Link href="/seller">
                    <div className={`${pathname === "/seller" && "active"}`}>
                        <IconDeviceAnalytics /> {t("Dashboard")}
                    </div>
                </Link>
                <Link href="/seller/listing">
                    <div
                        className={`${
                            ["/seller/listing"].some((prefix) =>
                                pathname.startsWith(prefix)
                            ) && "active"
                        }`}
                    >
                        <IconVocabulary /> {t("Listings")}
                    </div>
                </Link>
                <Link href="/seller/orders">
                    <div
                        className={`${
                            ["/seller/orders"].some((prefix) =>
                                pathname.startsWith(prefix)
                            ) && "active"
                        }`}
                    >
                        <IconBoxSeam /> {t("Orders")}
                    </div>
                </Link>
                <Link href="/seller/finances">
                    <div
                        className={`${
                            ["/seller/finances"].some((prefix) =>
                                pathname.startsWith(prefix)
                            ) && "active"
                        }`}
                    >
                        <IconBuildingBank /> {t("Finances")}
                    </div>
                </Link>
                <Link href="/seller/address">
                    <div
                        className={`${
                            ["/seller/address"].some((prefix) =>
                                pathname.startsWith(prefix)
                            ) && "active"
                        }`}
                    >
                        <IconMapPin /> {t("Addresses")}
                    </div>
                </Link>
                <Link href="/seller/cases">
                    <div
                        className={`${
                            ["/seller/cases"].some((prefix) =>
                                pathname.startsWith(prefix)
                            ) && "active"
                        }`}
                    >
                        <IconReport /> {t("Cases")}
                    </div>
                </Link>
                <Link href="/seller/help">
                    <div
                        className={`${
                            ["/seller/help"].some((prefix) =>
                                pathname.startsWith(prefix)
                            ) && "active"
                        }`}
                    >
                        <IconHelp /> {t("Help")}
                    </div>
                </Link>
            </div>
        </>
    );
}

export default SellerSidebar;
