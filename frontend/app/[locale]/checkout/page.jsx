"use client";
import Link from "next/link";
import "./styles.css";
import { IconLock } from "@tabler/icons-react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    selectCartItems,
    selectCartItemsShippingTotal,
    selectCartItemsTaxTotal,
    selectCartItemsTotal,
} from "@/redux/selectors/cart";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { order } from "@/redux/actions/shopActions";
import { clearCart, removeFromCart } from "@/redux/features/cartSlice";
import { parseAndFormatDecimal } from "@/redux/utils/opts";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import SaveCardModal from "@/components/Checkout/SaveCardModal";
import { loadUserCards } from "@/redux/actions/authActions";

const mapState = (state) => ({
    cartItems: selectCartItems(state),
    cartTotal: selectCartItemsTotal(state),
    cartShipTotal: selectCartItemsShippingTotal(state),
    cartTaxTotal: selectCartItemsTaxTotal(state),

    chosenAddress: state.addressBook.chosenAddress,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
});

function Checkout() {
    const {
        cartItems,
        cartTotal,
        cartShipTotal,
        cartTaxTotal,
        chosenAddress,
        isAuthenticated,
        user,
    } = useAppSelector(mapState);
    const t = useTranslations("Checkout");
    const router = useRouter();
    const dispatch = useAppDispatch();
    // const handlePriceAmount = (item) => {
    //     let priceValue;
    //     if (item?.product?.bulk) {
    //         const selectedBulkPolicy = getBulkPolicy(item);
    //         priceValue = parseAndFormatDecimal(selectedBulkPolicy.price);
    //     } else {
    //         priceValue = parseAndFormatDecimal(item?.product.min_price);
    //     }
    //     priceValue = parseAndFormatDecimal(priceValue);
    //     return priceValue;
    // };
    const getBulkPolicy = (item) => {
        const sortedBulks = [...(item?.product?.bulks || [])] // Create a new array
            .sort((a, b) => b.minimum_quantity - a.minimum_quantity);
        for (const bulk of sortedBulks) {
            if (item.quantity >= bulk.minimum_quantity) {
                return bulk;
            }
        }
    };

    const handlePriceAmount = (item) => {
        let priceValue;
        if (item?.product?.bulk) {
            if (item?.product?.sell_in_containers) {
                const selectedBulkPolicy = item.selectedBulkPolicy;
                if (selectedBulkPolicy) {
                    priceValue = parseAndFormatDecimal(
                        selectedBulkPolicy.price
                    );
                } else {
                    priceValue = parseAndFormatDecimal(item?.product.min_price);
                }
            } else {
                const selectedBulkPolicy = getBulkPolicy(item);
                if (selectedBulkPolicy) {
                    priceValue = parseAndFormatDecimal(
                        selectedBulkPolicy.price
                    );
                } else {
                    priceValue = 0;
                }
            }
        } else {
            priceValue = parseAndFormatDecimal(item?.product.min_price);
        }
        return parseAndFormatDecimal(priceValue);
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        // const notification = toast.loading("Ordering...", {
        //     className: "fs-14",
        // });

        if (cartItems.length < 1) {
            toast.error(t("cartIsEmpty"), {
                // id: notification,
                className: "fs-14",
            });
            return;
        }

        const inactiveItem = cartItems.some((item) => !item.is_active);
        if (inactiveItem) {
            toast.error(t("inactiveItems"), {
                // id: notification,
                className: "fs-14",
            });
            return;
        }

        if (!paymentMethod) {
            toast.error("Choose one payment card or add new", {
                // id: notification,
                className: "fs-14",
            });
            return;
        }

        if (isAuthenticated) {
            const data = {
                destination_full_name: user?.first_name + " " + user?.last_name,
                destination_address_line1: chosenAddress.address_line1,
                destination_address_line2: chosenAddress.address_line2,
                destination_city: chosenAddress.city,
                destination_state: chosenAddress.state,
                destination_zip_code: chosenAddress.zip_code,
                destination_country: chosenAddress.country,
                destination_phone_number: chosenAddress?.phoneNumber
                    ? chosenAddress?.phoneNumber
                    : "No phone number",
                total_price: parseAndFormatDecimal(
                    cartTotal + cartShipTotal + cartTaxTotal
                ),
                total_shipping_price: parseAndFormatDecimal(cartShipTotal),
                total_item_amount: cartItems.length,
                items: [],
                total_tax_price: parseAndFormatDecimal(cartTaxTotal),
                card_id: paymentMethod,
            };

            cartItems.map((cartItem) => {
                let item = {
                    product: cartItem.product.id,
                    seller: cartItem.product.seller.id,
                    seller_name: cartItem.product.seller.name,
                    quantity: cartItem.quantity,
                    price: handlePriceAmount(cartItem),
                    shipping_courier_id: cartItem.shipping.id
                        ? cartItem.shipping.id
                        : cartItem.shipping.courier_id,
                    shipping_courier_name: cartItem.shipping.name
                        ? cartItem.shipping.name
                        : cartItem.shipping.courier_name,
                    shipping_price: parseAndFormatDecimal(
                        cartItem.shipping.total_charge
                    ),
                    shipping_courier_type: cartItem.shipping.id
                        ? "YUUSELL"
                        : "EASYSHIP",
                    total_price: parseAndFormatDecimal(cartItem.totalPrice),
                    tax_rate: parseAndFormatDecimal(cartItem.tax_rate),
                    total_tax_price: parseAndFormatDecimal(
                        (cartItem.tax_rate * cartItem.quantity) / 100
                    ),
                    variations: cartItem?.selectedVariations
                        ? Object.entries(cartItem.selectedVariations).length >
                              0 &&
                          Object.entries(cartItem.selectedVariations)
                              .map(([key, variation]) => variation.name)
                              .join(" / ")
                        : null,
                    product_name: cartItem.product.name,
                    bulk: cartItem.product.bulk,
                    origin_address_line1:
                        cartItem.product.shipping_address.address_line1,
                    origin_address_line2:
                        cartItem.product.shipping_address.address_line2,
                    origin_city: cartItem.product.shipping_address.city,
                    origin_state: cartItem.product.shipping_address.state,
                    origin_zip_code: cartItem.product.shipping_address.zip_code,
                    origin_country: cartItem.product.shipping_address.country,
                    bought_in_containers: cartItem.product.sell_in_containers,
                };
                if (cartItem.product.sell_in_containers) {
                    item["items_inside_container"] =
                        cartItem.selectedBulkPolicy.minimum_quantity;
                    item["container_name"] =
                        cartItem.selectedBulkPolicy.container_name;
                    item["container_length"] =
                        cartItem.selectedBulkPolicy.container_length;
                    item["container_width"] =
                        cartItem.selectedBulkPolicy.container_width;
                    item["container_height"] =
                        cartItem.selectedBulkPolicy.container_height;
                    item["container_weight"] =
                        cartItem.selectedBulkPolicy.container_weight;
                }
                data.items.push(item);
            });
            setIsLoading(true);

            dispatch(order(data)).then((result) => {
                setIsLoading(false);

                if (result?.status === 201) {
                    dispatch(clearCart());
                    toast.success(t("orderSucceed"), {
                        // id: notification,
                        className: "fs-14",
                    });
                    router.push("/");
                } else if (result?.response?.status === 409) {
                    toast.error(t("orderFailed"), {
                        // id: notification,
                        className: "fs-14",
                    });
                    return;
                } else if (result?.response?.status === 401) {
                    toast.warning(`Try again`, {
                        // id: notification,
                        className: "fs-14",
                    });
                } else {
                    // console.log("RESULT", result.response.data.errors.product);

                    if (result.response?.data?.errors?.product) {
                        let text = result.response.data.errors.product[0];
                        let match = text.match(/pk \"(\d+)\"/);
                        let pkValue = 1;
                        if (match) {
                            pkValue = match[1];
                            console.log(
                                `The extracted pk value is: ${pkValue}`
                            );
                        } else {
                            console.log("No pk value found in the text.");
                        }
                        toast.error(
                            t("orderNotCompleted", { pkValue: pkValue }),
                            {
                                // id: notification,
                                className: "fs-14",
                            }
                        );
                        const newCartItems = cartItems.filter(
                            (cartItem) => cartItem.product.id === pkValue
                        );

                        console.log("DELETING ONES", newCartItems);
                        dispatch(removeFromCart(newCartItems));
                        toast.warning(
                            t("productRemovedFromCart", { pkValue: pkValue }),
                            { className: "fs-14" }
                        );
                        console.log(
                            "NEW CART ITEMS",
                            cartItems.filter(
                                (item) => item.product.id === pkValue
                            )
                        );
                        return;
                    } else if (result.response?.data?.errors?.quantity) {
                        let pkValue = result.response?.data?.errors?.product_id;
                        toast.error(
                            t("orderNotCompleted", { pkValue: pkValue }),
                            {
                                // id: notification,
                                className: "fs-14",
                            }
                        );
                        const newCartItems = cartItems.filter(
                            (cartItem) => cartItem.product.id === pkValue
                        );

                        console.log("DELETING ONES", newCartItems);
                        dispatch(removeFromCart(newCartItems));
                        toast.warning(
                            t("productRemovedFromCart", { pkValue: pkValue }),
                            { className: "fs-14" }
                        );
                        console.log(
                            "NEW CART ITEMS",
                            cartItems.filter(
                                (item) => item.product.id === pkValue
                            )
                        );
                        return;
                    }
                    console.log("RESULT RESPONSE", result);

                    toast.error(t("orderDidntComplete"), {
                        // id: notification,
                        className: "fs-14",
                    });
                    return;
                }
            });
            // } else {
            //     toast.error("Неправильно заполнено информация!", {
            //         id: notification,
            //     });
            // }
        } else {
            toast.error(t("loginRequired"), {
                // id: notification,
                className: "fs-14",
            });
            router.push("/auth/login");
            return;
        }
    };

    const [paymentMethod, setPaymentMethod] = useState(null);

    const openSaveCardModalRef = useRef();
    const [loadedPage, setLoadedPage] = useState(false);
    const [cards, setCards] = useState([]);
    const [refetchCards, setRefetchCards] = useState(null);
    useEffect(() => {
        dispatch(loadUserCards()).then((res) => {
            if (res?.status > 205) {
                setCards([]);
            } else {
                if (res.data.length > 0) {
                    setPaymentMethod(res.data[0]?.id);
                } else {
                    setPaymentMethod(null);
                }
                setCards(res.data);
            }
        });
    }, [refetchCards]);

    return (
        <>
            {/* <Head> */}
            <Script
                src={process.env.NEXT_PUBLIC_SQUARE_JS}
                onLoad={() => {
                    setLoadedPage(true);
                }}
            />
            <SaveCardModal
                loadedPage={loadedPage}
                setRefetchCardsTrigger={setRefetchCards}
            >
                <div ref={openSaveCardModalRef}></div>
            </SaveCardModal>
            {/* </Head> */}
            <div className="container py-4 mb-5">
                <div className="bg-white rounded-1 p-2 px-4">
                    <div className="d-flex align-items-center justify-content-between flex-wrap ">
                        <Link
                            href="/"
                            className="d-flex align-items-center justify-content-center"
                        >
                            <img src="/logo2.jpg" alt="" height={40} />{" "}
                            <div className="fw-bold ms-1 fs-4">
                                {t("checkout")}
                            </div>
                        </Link>
                        <div className="d-none d-md-flex">
                            <Link
                                href="/"
                                className="fw-medium fs-14 text-decoration-underline me-1"
                            >
                                {t("home")}
                            </Link>
                            <Link
                                href="/cart"
                                className="fw-medium fs-14 text-decoration-underline me-1"
                            >
                                {t("cart")}
                            </Link>
                            <Link
                                href="/"
                                className="fw-medium fs-14 text-decoration-underline me-1"
                            >
                                {t("help")}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="row mx-0 mt-3 mt-md-5">
                    <div className="col-12 col-md-8 pe-0 pe-md-2 ps-0">
                        <div className="bg-white p-3 rounded-1 ">
                            <div className="border-bottom pb-2 ps-2 fw-medium">
                                {t("shipTo")}
                            </div>
                            <ul className="list-unstyled">
                                <li className="px-3 pt-3 border-bottom pb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input customradio"
                                            type="radio"
                                            name="shipRadio"
                                            id="shipRadio1"
                                            checked
                                        />
                                        <label
                                            className="form-check-label ms-2 w-100 fs-14 fw-medium"
                                            for="shipRadio1"
                                        >
                                            <div>
                                                {user?.first_name}{" "}
                                                {user?.last_name}
                                            </div>
                                            <div>
                                                {chosenAddress?.address_line1}
                                            </div>
                                            <div>
                                                {chosenAddress?.address_line2?.trim()
                                                    ? chosenAddress?.address_line2
                                                    : null}
                                            </div>
                                            <div>
                                                {" "}
                                                {chosenAddress?.city},{" "}
                                                {chosenAddress?.state},{" "}
                                                {chosenAddress?.zip_code}
                                            </div>
                                            <div> {chosenAddress?.country}</div>
                                            <div>
                                                {chosenAddress?.phoneNumber}
                                            </div>
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white p-3 rounded-1 mt-3">
                            <div className="border-bottom pb-2 ps-2 fw-medium">
                                {t("payWith")}
                            </div>
                            <ul className="list-unstyled">
                                {cards.map((card) => (
                                    <li
                                        key={card.id}
                                        className="px-3 pt-3 border-bottom pb-2"
                                    >
                                        <div className="form-check">
                                            <input
                                                className="form-check-input customradio"
                                                type="radio"
                                                name="flexRadioDefault"
                                                checked={
                                                    paymentMethod === card.id
                                                }
                                                onChange={() =>
                                                    setPaymentMethod(card.id)
                                                }
                                                id={card.id}
                                            />
                                            <label
                                                className="form-check-label ms-2 w-100"
                                                for={card.id}
                                            >
                                                <span
                                                    className={`${card.card_brand} medium`}
                                                ></span>
                                                <span className="ms-2 fw-medium">
                                                    x-{card.last_4}
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                ))}

                                <li className="px-3 pt-3 border-bottom pb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input customradio"
                                            type="radio"
                                            name="flexRadioDefault"
                                            onClick={() =>
                                                openSaveCardModalRef.current.click()
                                            }
                                            id="flexRadioDefault4"
                                        />
                                        <label
                                            className="form-check-label ms-2 w-100"
                                            for="flexRadioDefault4"
                                        >
                                            <div className=" fw-medium">
                                                {t("Add a new card")}
                                            </div>
                                            <span className="VISA x-small me-1"></span>
                                            <span className="MASTERCARD x-small me-1"></span>
                                            <span className="AM_EX x-small me-1"></span>
                                            <span className="DISCOVER x-small me-1"></span>
                                        </label>
                                    </div>
                                </li>

                                {/* <li className="px-3 pt-3  ">
                                <div className="form-check">
                                    <input
                                        className="form-check-input customradio"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="flexRadioDefault5"
                                    />
                                    <label
                                        className="form-check-label ms-2 w-100"
                                        for="flexRadioDefault5"
                                    >
                                        <span className="PAYPAL medium"></span>
                                        <span className="ms-2 fw-medium">
                                            {t("Payapl")}
                                        </span>
                                    </label>
                                </div>
                            </li> */}
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 mt-3 mt-md-0 col-md-4 p-0 ps-md-2">
                        <div className="bg-white py-3 px-1 rounded-1">
                            <div className="row mx-0 w-100 fs-14 fw-medium">
                                <div className="col-6">
                                    {t("subtotal", { count: cartItems.length })}
                                </div>
                                <div className="col-6 d-flex  justify-content-end">
                                    ${parseAndFormatDecimal(cartTotal)}
                                </div>
                            </div>
                            <div className="row mx-0 w-100 fs-14 fw-medium py-1">
                                <div className="col-6">{t("shipping")}</div>
                                <div className="col-6 d-flex  justify-content-end">
                                    ${parseAndFormatDecimal(cartShipTotal)}
                                </div>
                            </div>
                            {cartTaxTotal && cartTaxTotal > 0 ? (
                                <div className="row mx-0 w-100 fs-14 fw-medium py-1">
                                    <div className="col-6">{t("tax")}</div>
                                    <div className="col-6 d-flex  justify-content-end">
                                        ${parseAndFormatDecimal(cartTaxTotal)}
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}

                            <div className="px-5">
                                <hr />
                            </div>
                            <div className="row mx-0 w-100  fw-medium">
                                <div className="col-6 fw-bold">
                                    {t("orderTotal")}
                                </div>
                                <div className="col-6 d-flex fw-bold justify-content-end">
                                    $
                                    {parseAndFormatDecimal(
                                        cartTotal + cartShipTotal + cartTaxTotal
                                    )}
                                </div>
                            </div>

                            <div className="p-3 ">
                                <div className="bg-slightgray p-3 fs-13">
                                    <div>
                                        {t("orderAgreement")}
                                        <Link
                                            href="/"
                                            className="text-decoration-underline text-primary"
                                        >
                                            {t("learnMore")}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4">
                                <div
                                    role="button"
                                    onClick={() => {
                                        if (!isLoading) {
                                            handleSubmit();
                                        }
                                    }}
                                    className="btn btn-main fs-14 w-100  fw-bold rounded-5"
                                >
                                    {isLoading ? (
                                        <>
                                            <div
                                                class="spinner-border text-main"
                                                role="status"
                                            >
                                                <span class="visually-hidden">
                                                    Loading...
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <IconLock size={18} />
                                            {t("confirmAndPay")}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;
