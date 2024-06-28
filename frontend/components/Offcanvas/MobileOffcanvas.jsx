"use client";

import { useAppSelector } from "@/redux/hooks";
import { IconLogout, IconWorld } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import AddressComponent from "../HeaderAddressSlider/AddressComponent";
import { useTranslations } from "next-intl";

export default function MobileOffcanvas({ children }) {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const pathname = usePathname();
    const closeBtnRef = useRef();

    useEffect(() => {
        if (closeBtnRef.current) {
            closeBtnRef.current.click();
        }
    }, [pathname]);

    const t = useTranslations("MobileOffcanvas");
    const alltrans = useTranslations();

    const changeLanguage = (locale) => {
        const newPathname = window.location.pathname.replace(
            /^\/[a-z]{2}(?=\/|$)/,
            `/${locale}`
        );
        const newUrl = `${window.location.origin}${newPathname}${window.location.search}${window.location.hash}`;
        window.location.href = newUrl;

        // router.push(`/${locale}`);
    };

    const url = window.location.pathname;
    const urlSegments = url.split("/");
    const locale = urlSegments[1];
    const getLocale = () => {
        switch (locale) {
            case "en":
                return alltrans("english");
            case "ru":
                return alltrans("russian");
            case "tm":
                return alltrans("turkmen");
            case "cn":
                return alltrans("chinese");
            default:
                break;
        }
    };

    return (
        <>
            {children}

            <div
                className="offcanvas offcanvas-end fs-13"
                tabIndex="-1"
                id="offcanvasRight2"
                aria-labelledby="offcanvasRightLabel"
            >
                <div class="offcanvas-header d-flex align-items-center border-bottom">
                    <div>
                        <Link href="/" className="d-flex align-items-start">
                            <img
                                src="/logo2.jpg"
                                alt=""
                                style={{ height: 40 }}
                                // fill={true}
                                // className="w-auto"
                            />{" "}
                            <img
                                src="/logo3.jpg"
                                alt=""
                                style={{ marginLeft: "-8px", height: 35 }}
                            />{" "}
                        </Link>
                    </div>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        ref={closeBtnRef}
                    ></button>
                </div>
                <div class="offcanvas-body pt-0 d-flex flex-column">
                    <div>
                        <ul className="list-unstyled custom-list">
                            {/* <Link href="/category">
                                <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                    <span>{t("categories")}</span>{" "}
                                    <IconChevronRight size={18} />
                                </li>
                            </Link> */}

                            {!isAuthenticated && (
                                <>
                                    <Link href="/auth/login">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("login")}</span>{" "}
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                    <Link href="/auth/register">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("register")}</span>{" "}
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                    <Link href="/auth/reset-password">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("resetPassword")}</span>{" "}
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                </>
                            )}

                            <div className="dropdown py-2 border-bottom d-flex justify-content-between align-items-center ">
                                <div
                                    className="text-main fw-bold  px-1 rounded-1 user-select-none"
                                    data-bs-toggle="dropdown"
                                    role="button"
                                    aria-expanded="false"
                                >
                                    <IconWorld height={20} /> {getLocale()}
                                </div>
                                <div>
                                    <ul
                                        className="main-drop dropdown-menu fs-13 rounded-1"
                                        style={{
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <li>
                                            <h6 className="dropdown-header fs-13 fw-bold text-start pt-0 pb-1 border-bottom">
                                                {alltrans(
                                                    "Header.chooseLanguage"
                                                )}
                                            </h6>
                                        </li>

                                        <li
                                            onClick={(e) =>
                                                changeLanguage("en")
                                            }
                                        >
                                            <a
                                                className="dropdown-item "
                                                href="#"
                                            >
                                                {alltrans("english")}
                                            </a>
                                        </li>
                                        <li
                                            onClick={(e) =>
                                                changeLanguage("ru")
                                            }
                                        >
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
                                                {alltrans("russian")}
                                            </a>
                                        </li>
                                        {/* <li
                                            onClick={(e) =>
                                                changeLanguage("tm")
                                            }
                                        >
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
                                                {alltrans("turkmen")}
                                            </a>
                                        </li>
                                        <li
                                            onClick={(e) =>
                                                changeLanguage("cn")
                                            }
                                        >
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
                                                {alltrans("chinese")}
                                            </a>
                                        </li> */}
                                    </ul>
                                </div>
                            </div>
                        </ul>
                    </div>

                    {isAuthenticated && user?.is_verified_seller && (
                        <div>
                            <h6 className="text-muted fw-bold fs-15 mt-3 text-center">
                                {t("sellerAccountDetails")}
                            </h6>

                            <ul className="list-unstyled custom-list">
                                <Link href="/seller">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("dashboard")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/seller/listing">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("listing")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/seller/orders">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("orders")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/seller/cases">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("cases")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/seller/finances">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("finances")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/seller/address">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("addresses")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/seller/help">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("help")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/account/profile#logout">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("logout")} </span>
                                        <IconLogout size={18} />
                                    </li>
                                </Link>
                            </ul>
                        </div>
                    )}
                    {isAuthenticated && (
                        <div>
                            <h6 className="text-muted fw-bold fs-15 mt-3 text-center">
                                {t("accountDetails")}
                            </h6>

                            <ul className="list-unstyled custom-list">
                                <Link href="/account">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("dashboard")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/account/profile">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("editProfile")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/account/orders">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("orders")}</span>{" "}
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>

                                <Link href="/account/reviews">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("reviews")} </span>
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/account/cases">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("cases")}</span>
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>
                                <Link href="/account/profile#logout">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("logout")} </span>
                                        <IconLogout size={18} />
                                    </li>
                                </Link>

                                <Link href="/help">
                                    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                        <span>{t("help")} </span>
                                        <IconChevronRight size={18} />
                                    </li>
                                </Link>

                                {!user?.is_seller && (
                                    <Link href="/business">
                                        <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                            <span>{t("becomeSeller")} </span>
                                            <IconChevronRight size={18} />
                                        </li>
                                    </Link>
                                )}
                            </ul>
                        </div>
                    )}

                    <div className="mb-5"></div>

                    <div
                        className="position-fixed bg-white z-3 pt-2 w-100 border-top truncate-overflow-1"
                        style={{ bottom: 10 }}
                    >
                        <Link href="/account/address">
                            <AddressComponent />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

//  {/* <div className="d-flex gap-2 justify-content-center">
//                             <div>
//                                 <div className="fw-bold text-center mb-1">
//                                     Language{" "}
//                                     <IconWorld
//                                         size={20}
//                                         className="text-main"
//                                     />
//                                 </div>
//                                 <select
//                                     class="form-select pe-5 shadow-none text-lightgray border fs-14  fw-bold rounded-small"
//                                     aria-label="Default select example"
//                                 >
//                                     <option selected>English</option>
//                                     <option value="1">Russian</option>
//                                     <option value="2">Chinese</option>
//                                     <option value="3">Three</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <div className="fw-bold text-center mb-1">
//                                     Currency{" "}
//                                     <IconZoomMoney
//                                         size={20}
//                                         className="text-main"
//                                     />
//                                 </div>
//                                 <select
//                                     class="form-select pe-5 shadow-none text-lightgray border fs-14  fw-bold rounded-small"
//                                     aria-label="Default select example"
//                                 >
//                                     <option selected>USD</option>
//                                     <option value="1">CNY</option>
//                                     <option value="2">Chinese</option>
//                                     <option value="3">Three</option>
//                                 </select>
//                             </div>
//                         </div> */}

//                         {/* <div
//                             role="button"
//                             className="border-top pt-2 mt-2 truncate-overflow-1"
//                         >
//                             Ship to:{" "}
//                             <span className="text-main">
//                                 USA, Washington, Puyallup, 5110 62ND Ave E
//                             </span>
//                         </div> */}
