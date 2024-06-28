"use client";
import { useAppSelector } from "@/redux/hooks";
import { selectCartItemsCount } from "@/redux/selectors/cart";
import { selectUserData } from "@/redux/selectors/shop";
import {
    IconBuildingStore,
    IconHearts,
    IconHome,
    IconListSearch,
    IconShoppingCart,
    IconUser,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const mapState = (state) => ({
    user: selectUserData(state),
    isAuthenticated: state.auth.isAuthenticated,
    cartAmount: selectCartItemsCount(state),
});

function MobileBottom() {
    const pathname = usePathname();
    const { isAuthenticated, user, cartAmount } = useAppSelector(mapState);
    const t = useTranslations("MobileBottom");
    // const normalizedPathname = pathname;
    const normalizedPathname = pathname.split("/").slice(2).join("/");
    // console.log("pathname", pathname);
    // console.log("normalizedPathname", normalizedPathname);
    return (
        <div className="position-fixed bottom-0 bg-white py-2  z-2 w-100 fs-12">
            <div className="d-flex  justify-content-evenly fw-bold">
                <Link
                    href="/"
                    className={`${
                        !normalizedPathname ? "text-main" : "text-secondary"
                    } d-flex flex-column justify-content-center align-items-center`}
                >
                    <IconHome />
                    <div>{t("home")}</div>
                </Link>
                <Link
                    href="/category"
                    className={`${
                        ["category", "search", "products"].some((prefix) =>
                            normalizedPathname.includes(prefix)
                        )
                            ? "text-main"
                            : "text-secondary"
                    } d-flex flex-column justify-content-center align-items-center`}
                >
                    <IconListSearch />
                    <div>{t("catalog")}</div>
                </Link>
                <Link
                    href="/cart"
                    className={`${
                        ["cart"].includes(normalizedPathname)
                            ? "text-main"
                            : "text-secondary"
                    } d-flex flex-column justify-content-center align-items-center position-relative`}
                >
                    <IconShoppingCart />
                    <div>
                        {t("cart")}{" "}
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartAmount}
                            <span class="visually-hidden">
                                {t("unreadMessages")}
                            </span>
                        </span>
                    </div>
                </Link>
                <Link
                    href="/wishlist"
                    className={`${
                        ["wishlist"].includes(normalizedPathname)
                            ? "text-main"
                            : "text-secondary"
                    } d-flex flex-column justify-content-center align-items-center`}
                >
                    <IconHearts />
                    <div>{t("wishlist")}</div>
                </Link>

                {isAuthenticated ? (
                    user?.is_verified_seller ? (
                        <Link
                            href="seller"
                            className={`${
                                ["auth", "account", "seller"].some((prefix) =>
                                    normalizedPathname.includes(prefix)
                                )
                                    ? "text-main"
                                    : "text-secondary"
                            } d-flex flex-column justify-content-center align-items-center`}
                        >
                            <IconBuildingStore />
                            <div>{t("seller")}</div>
                        </Link>
                    ) : (
                        <Link
                            href="account"
                            className={`${
                                ["auth", "account"].some((prefix) =>
                                    normalizedPathname.includes(prefix)
                                )
                                    ? "text-main"
                                    : "text-secondary"
                            } d-flex flex-column justify-content-center align-items-center`}
                        >
                            <IconUser />
                            <div>{t("account")}</div>
                        </Link>
                    )
                ) : (
                    <Link
                        href="/auth/login"
                        className={`${
                            ["auth", "account"].some((prefix) =>
                                normalizedPathname.includes(prefix)
                            )
                                ? "text-main"
                                : "text-secondary"
                        } d-flex flex-column justify-content-center align-items-center`}
                    >
                        <IconUser />
                        <div>{t("login")}</div>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default MobileBottom;
