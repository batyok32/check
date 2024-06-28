import {
    IconMapPin,
    IconMenu2,
    IconUser,
    IconHeart,
    IconShoppingCart,
    IconUsersPlus,
    IconBoxSeam,
    IconWorld,
    IconMenu,
} from "@tabler/icons-react";

import "./Header.css";
import Link from "next/link";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import MenuCategoryItem from "./MenuCategoryItem/MenuCategoryItem";
import HeaderAddressSlider from "../HeaderAddressSlider/HeaderAddressSlider";
import { IconBuildingStore } from "@tabler/icons-react";
import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/selectors/shop";
import MobileOffcanvas from "../Offcanvas/MobileOffcanvas";
import { selectCartData, selectCartItemsCount } from "@/redux/selectors/cart";
import AddressAddModal from "../Addresses/AddressAddModal";
import AddressComponent from "../HeaderAddressSlider/AddressComponent";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const mapState = (state) => ({
    user: selectUserData(state),
    isAuthenticated: state.auth.isAuthenticated,
    cartAmount: selectCartItemsCount(state),
});

function Header({ offcanvasRef }) {
    const { isAuthenticated, user, cartAmount } = useAppSelector(mapState);
    // const offcanvasRef = useRef();
    const t = useTranslations("Header");
    const alltrans = useTranslations("");
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
                return t("english");
            case "ru":
                return t("russian");
            case "tm":
                return t("turkmen");
            case "cn":
                return t("chinese");
            default:
                break;
        }
    };
    const { categories } = useAppSelector((state) => state.shop);

    return (
        <>
            <MobileOffcanvas>
                <div
                    role="button"
                    ref={offcanvasRef}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight2"
                    aria-controls="offcanvasRight2"
                ></div>
            </MobileOffcanvas>
            <div className="no-break fs-13 py-1 bg-white d-none d-sm-flex flex-column ">
                {/* <div className="d-flex order-1 order-sm-0  pb-1 pb-sm-0 justify-content-between">
                    <div className="d-none d-sm-flex gap-2 text-lightgray fw-medium">
                        <Link href="/business" className="no-break">
                            {t("sell")}
                        </Link>
                        <Link href="/help" className="no-break">
                            {t("helpAndContact")}
                        </Link>
                    </div>
                    <div className="d-flex align-items-center  gap-2 w-100 justify-content-end">
                        <div className="dropdown d-none d-sm-block">
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
                                            {t("chooseLanguage")}
                                        </h6>
                                    </li>

                                    <li onClick={(e) => changeLanguage("en")}>
                                        <a className="dropdown-item " href="#">
                                            {t("english")}
                                        </a>
                                    </li>
                                    <li onClick={(e) => changeLanguage("ru")}>
                                        <a className="dropdown-item" href="#">
                                            {t("russian")}
                                        </a>
                                    </li>
                                  
                                </ul>
                            </div>
                        </div>

                        <div>
                            <AddressComponent />
                        </div>
                    </div>
                </div> */}

                <div className="container-xl d-flex py-2 align-items-center">
                    <Link
                        href="/"
                        className="d-none d-sm-flex align-items-center me-4"
                    >
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
                            style={{ marginLeft: "-8px", height: 30 }}
                        />{" "}
                    </Link>
                    {/* <MegaMenu> */}
                    {/* <div className=" order-1 order-sm-0">
                        <div
                            role="button"
                            onClick={() => offcanvasRef.current.click()}
                            className="btn btn-main btn-custom fw-bold fs-14 ms-1 mx-sm-4 d-flex align-items-center gap-1 rounded-1"
                        >
                            <IconMenu2 />{" "}
                            <span className="d-none d-lg-inline">
                                {t("menu")}
                            </span>
                        </div>
                    </div> */}

                    <HeaderSearch />

                    <div className="d-none d-lg-flex ms-3 gap-4 fw-medium user-select-none ">
                        {isAuthenticated ? (
                            <Link
                                href="/account"
                                className="d-flex justify-content-center align-items-center flex-column"
                            >
                                <IconUser height={20} />
                                <div>{t("account")}</div>
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="d-flex justify-content-center align-items-center flex-column"
                            >
                                <IconUser height={20} />
                                <div>{t("login")}</div>
                            </Link>
                        )}
                        {user?.is_verified_seller ? (
                            <Link
                                href="/seller"
                                className="d-flex justify-content-center align-items-center flex-column"
                            >
                                <IconBuildingStore height={20} />
                                <div>{t("seller")}</div>
                            </Link>
                        ) : !isAuthenticated ? (
                            <Link
                                href="/auth/register"
                                className="d-flex justify-content-center align-items-center flex-column"
                            >
                                <IconUsersPlus height={20} />
                                <div>{t("register")}</div>
                            </Link>
                        ) : (
                            <Link
                                href="/account/orders"
                                className="d-flex justify-content-center align-items-center flex-column"
                            >
                                <IconBoxSeam height={20} />
                                <div>{t("orders")}</div>
                            </Link>
                        )}
                        <Link
                            href="/wishlist"
                            className="d-flex justify-content-center align-items-center flex-column"
                        >
                            <IconHeart height={20} />
                            <div>{t("wishlist")}</div>
                        </Link>{" "}
                        <Link
                            href="/cart"
                            className="d-flex justify-content-center align-items-center flex-column position-relative me-3"
                        >
                            <IconShoppingCart height={20} />
                            <div>{t("cart")}</div>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartAmount}
                                <span className="visually-hidden">
                                    unread messages
                                </span>
                            </span>
                        </Link>{" "}
                    </div>
                </div>
                <div className="bg-halfblack py-1">
                    <div className="d-flex  container-xl text-white  pb-1 pb-sm-0 justify-content-between">
                        <div className="d-none d-sm-flex gap-2 text-white fw-medium">
                            <div class="dropdown">
                                <button
                                    class="btn text-white border-0 fw-medium  fs-13 py-0 dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <IconMenu height={20} />{" "}
                                    {alltrans("Products.allCategories")}
                                </button>
                                <ul class="dropdown-menu fs-14 rounded-bottom-1 rounded-top-0">
                                    {categories.map((cat) => (
                                        <li key={cat.id}>
                                            <Link
                                                class="dropdown-item"
                                                href={`/products?category=${cat.id}`}
                                            >
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <span className="px-2">|</span>
                            <Link href="/help">{t("helpAndContact")}</Link>
                            <Link href="/business">{t("sell")}</Link>{" "}
                            {/* <div>Get the app</div> */}
                        </div>

                        <div className="d-flex align-items-center  gap-2 w-100 justify-content-end">
                            <div className="dropdown d-none d-sm-block">
                                <div
                                    className="text-white   px-1 rounded-1 user-select-none"
                                    data-bs-toggle="dropdown"
                                    role="button"
                                    aria-expanded="false"
                                >
                                    {/* <IconWorld height={20} />  */}
                                    {getLocale()}
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
                                                {t("chooseLanguage")}
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
                                                {t("english")}
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
                                                {t("russian")}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <AddressComponent color="white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
