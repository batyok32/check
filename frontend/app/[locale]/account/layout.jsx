"use client";
import LogoutModal from "@/components/AccountPageComponents/LogoutModal/LogoutModal";
import { IconLogout } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRef } from "react";
import { useTranslations } from "next-intl";

export default function AccountLayout({ children }) {
    const t = useTranslations("AccountLayout");
    const logoutModalRef = useRef();

    return (
        <>
            <LogoutModal>
                <div ref={logoutModalRef}></div>
            </LogoutModal>
            <div className="container-xxl">
                <div className="row mx-0">
                    <div className="order-1 order-md-0 col-lg-3  d-none d-md-block ">
                        <div
                            className="bg-white px-3 pb-3 pt-2 rounded-1 fs-14 mt-3 position-sticky"
                            style={{ top: 10 }}
                        >
                            <div>
                                <ul className="list-unstyled custom-list">
                                    <Link href="/account">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("dashboard")}</span>{" "}
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                    <Link href="/account/orders">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("orders")}</span>{" "}
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                    <Link href="/account/address">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("addresses")}</span>
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                    <Link href="/account/cases">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("supportCases")}</span>
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                    <Link href="/account/reviews">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("reviews")}</span>
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                    <Link href="/help">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("help")}</span>
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                    <li
                                        onClick={() =>
                                            logoutModalRef.current.click()
                                        }
                                        className="py-2 border-bottom d-flex justify-content-between align-items-center"
                                    >
                                        <span>{t("logout")}</span>
                                        <IconLogout size={18} />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="order-0 order-md-1 px-0 px-md-3 col-lg-9 pb-md-5">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
