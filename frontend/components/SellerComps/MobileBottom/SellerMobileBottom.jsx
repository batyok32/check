"use client";
import {
    IconBoxSeam,
    IconBuildingBank,
    IconBuildingStore,
    IconCoin,
    IconHearts,
    IconHelp,
    IconMessage,
    IconSettings,
    IconVocabulary,
    IconZoomScan,
} from "@tabler/icons-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome } from "@tabler/icons-react";
import { IconChartArrowsVertical } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { IconShoppingCart } from "@tabler/icons-react";

export default function SellerMobileBottom() {
    const pathname = usePathname();
    const t = useTranslations("SellerMobileBottom");
    const normalizedPathname = pathname.split("/").slice(2).join("/");
    console.log("normalizedPathname 1111 ", normalizedPathname);

    return (
        <div className="position-fixed bottom-0 bg-white py-2  z-2 w-100 fs-12">
            <div className="d-flex  justify-content-evenly fw-bold">
                <Link
                    href="/seller"
                    className={`${
                        normalizedPathname === "seller"
                            ? "text-main"
                            : "text-secondary"
                    } d-flex flex-column justify-content-center align-items-center`}
                >
                    <IconHome />
                    <div>{t("Home")}</div>
                </Link>
                <Link
                    href="/seller/listing"
                    className={`${
                        ["seller/listing"].some((prefix) =>
                            normalizedPathname.includes(prefix)
                        )
                            ? "text-main"
                            : "text-secondary"
                    } d-flex flex-column justify-content-center align-items-center`}
                >
                    <IconVocabulary />
                    <div>{t("Listing")}</div>
                </Link>
                <Link
                    href="/seller/finances"
                    className={`${
                        ["seller/finances"].some((prefix) =>
                            normalizedPathname.includes(prefix)
                        )
                            ? "text-main"
                            : "text-secondary"
                    } d-flex flex-column justify-content-center align-items-center`}
                >
                    <IconBuildingBank />
                    <div>{t("Finances")}</div>
                </Link>
                <Link
                    href="/seller/orders"
                    className={`${
                        ["seller/orders"].some((prefix) =>
                            normalizedPathname.includes(prefix)
                        )
                            ? "text-main"
                            : "text-secondary"
                    } d-flex flex-column justify-content-center align-items-center`}
                >
                    <IconBoxSeam />
                    <div>{t("Orders")}</div>
                </Link>
                <Link
                    href="/"
                    className={`${
                        ["/"].includes(normalizedPathname)
                            ? "text-main"
                            : "text-secondary"
                    } d-flex flex-column justify-content-center align-items-center`}
                >
                    <IconShoppingCart />
                    <div>Shop</div>
                </Link>
                {/* <div className="dropdown">
                    <div
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        className="d-flex text-secondary flex-column justify-content-center align-items-center"
                    >
                        <IconSettings />
                        <div>{t('Settings')}</div>
                    </div>
                    <ul class="main-drop dropdown-menu fs-14 rounded-1">
                        <Link href="/seller/" className="dropdown-item py-2">
                            <li className="d-flex align-items-center gap-2">
                                <IconHelp className="text-main" /> {t('Help')}
                            </li>
                        </Link>
                        <Link href="/seller/" className="dropdown-item py-2">
                            <li className="d-flex align-items-center gap-2">
                                <IconChartArrowsVertical className="text-main" />{" "}
                                Marketing
                            </li>
                        </Link>
                        <Link href="/seller/" className="dropdown-item py-2">
                            <li className="d-flex align-items-center gap-2">
                                <IconChartArrowsVertical className="text-main" />{" "}
                                Leave review
                            </li>
                        </Link>
                    </ul>
                </div> */}
            </div>
        </div>
    );
}
