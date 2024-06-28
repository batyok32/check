"use client";
import CartItem from "@/components/CartItems/CartItem";
import { removeFromCart } from "@/redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    selectCartItems,
    selectCartItemsShippingTotal,
    selectCartItemsTaxTotal,
    selectCartItemsTotal,
} from "@/redux/selectors/cart";
import { parseAndFormatDecimal } from "@/redux/utils/opts";
import { useTranslations } from "next-intl";

import Link from "next/link";
import { useEffect, useState } from "react";

const mapState = (state) => ({
    cartItems: selectCartItems(state),
    cartTotal: selectCartItemsTotal(state),
    cartShipTotal: selectCartItemsShippingTotal(state),
    cartTaxTotal: selectCartItemsTaxTotal(state),
});

function Cart() {
    const t = useTranslations("Cart");
    const { cartItems, cartTotal, cartShipTotal, cartTaxTotal } =
        useAppSelector(mapState);
    const [selectAll, setSelectAll] = useState(false);
    const [localCartItems, setLocalCartItems] = useState([]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (cartItems) {
            setLocalCartItems(
                [...cartItems].sort((a, b) => a.product.id - b.product.id)
            );
        }
    }, [cartItems]);

    useEffect(() => {
        // Check if all items are selected
        if (localCartItems && localCartItems.length > 0) {
            const allSelected = localCartItems.every((item) => item.selected);
            setSelectAll(allSelected);
        }
    }, [localCartItems]);

    const handleSelectAll = (e) => {
        const selected = e.target.checked;
        setSelectAll(selected);
        setLocalCartItems(
            localCartItems
                .sort((a, b) => a.product.id - b.product.id)
                .map((item) => ({ ...item, selected }))
        );
    };

    const handleRemoveSelected = () => {
        const newCartItems = localCartItems.filter((item) => item.selected);
        dispatch(removeFromCart(newCartItems));
    };
    const handleItemSelect = (index, selected) => {
        const newCartItems = localCartItems
            .sort((a, b) => a.product.id - b.product.id)
            .map((item, idx) => {
                if (idx === index) {
                    console.log("EXIST");
                    return { ...item, selected: selected };
                }
                console.log("NOT EXIST");
                return item;
            });
        setLocalCartItems(newCartItems);
    };

    return (
        <div className="container-xxl mt-md-3 px-sm-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="fw-bold fs-5 ">
                    {t("Cart")} ({localCartItems?.length})
                </div>
            </div>

            <div className="row align-items-start mx-0 ">
                <div className="col-md-8 order-1 order-md-0 bg-white rounded-1">
                    <div className="d-flex align-items-center gap-3 fs-14 user-select-none pt-2 border-bottom ps-4 m-0">
                        <div className="form-check col-auto">
                            <input
                                className="form-check-input customcheckbox fs-6 rounded-small border-main"
                                role="button"
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                id="flexCheckDefault"
                            />
                            <label
                                className="form-check-label fw-medium fs-15 pt-1"
                                role="button"
                                for="flexCheckDefault"
                            >
                                {t("Choose all")}
                            </label>
                        </div>
                        <span
                            className="text-danger fw-bold "
                            role="button"
                            onClick={() => handleRemoveSelected()}
                        >
                            | {t("Delete chosen")}
                        </span>
                    </div>

                    <div className="px-2 pe-4 d-md-block">
                        {localCartItems && localCartItems.length > 0 ? (
                            [...localCartItems]
                                .sort((a, b) => a.product.id - b.product.id)
                                .map((cartItem, index) => {
                                    const hasSameIdAsPrevious =
                                        index > 0 &&
                                        cartItem.product.id ===
                                            localCartItems[index - 1].product
                                                .id;

                                    return (
                                        <CartItem
                                            key={index} // Assuming product.id is unique
                                            item={cartItem}
                                            handleItemSelect={handleItemSelect}
                                            index={index}
                                            isChild={hasSameIdAsPrevious}
                                        />
                                    );
                                })
                        ) : (
                            <div className="w-100 w-md-30 mx-auto  text-center py-3 py-md-5">
                                <div className="fs-14 text-muted">
                                    All cart items will be here
                                </div>
                            </div>
                            // <div className="w-50 mx-auto  text-center py-5">
                            //     <div className="fw-medium text-dark fs-4 mb-5">
                            //         Nothing in cart
                            //     </div>
                            //     <img
                            //         src="/no-products.svg"
                            //         className="img-fluid"
                            //         alt=""
                            //     />
                            // </div>
                        )}
                    </div>
                    {/* <div className="d-md-none">
                        <MobileCartItem />
                        <MobileCartItem />
                    </div> */}
                </div>

                <div className="col-md-4 order-0 order-md-1 px-md-2  top-0 px-0 mb-2">
                    <div className="bg-white rounded-1 h-100 px-4 py-3 ">
                        <Link href="/checkout">
                            <button className="btn-main  btn w-100 fw-bold fs-14 py-2">
                                {t("Checkout")}
                            </button>
                        </Link>
                        <div className="fs-14 pt-3">
                            <div className="d-flex justify-content-between py-1">
                                <div>
                                    {t("Items")} ({cartItems?.length})
                                </div>
                                <div className="fw-bold">
                                    ${parseAndFormatDecimal(cartTotal)}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-1">
                                <div>{t("Shipping")} </div>
                                <div className="fw-bold">
                                    ${parseAndFormatDecimal(cartShipTotal)}
                                </div>
                            </div>

                            <div className="d-flex justify-content-between py-1">
                                <div>{t("tax")} </div>
                                <div className="fw-bold">
                                    ${parseAndFormatDecimal(cartTaxTotal)}
                                </div>
                            </div>

                            <hr />
                            <div className="d-flex justify-content-between py-1">
                                <div>{t("Total")}</div>
                                <div className="fw-bold">
                                    $
                                    {parseAndFormatDecimal(
                                        cartTotal + cartShipTotal + cartTaxTotal
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="bg-white mt-4 p-sm-3 p-1 px-3 rounded-1 d-none">
                <div className="fw-bold mt-3 ms-3 fs-5 mb-0 ">
                    Similar items
                </div>
                {/* <RecommendedProductSlider />
            </div> */}
        </div>
    );
}

export default Cart;
