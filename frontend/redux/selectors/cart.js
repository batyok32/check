import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { parseAndFormatDecimal } from "../utils/opts";

export const selectCartData = (state) => state.cart;

export const selectCartItems = createDraftSafeSelector(
    [selectCartData],
    (cartData) => cartData.items
);

export const selectCartItemsCount = createDraftSafeSelector(
    [selectCartItems],
    (cartItems) => {
        return cartItems.reduce(
            (quantity, cartItem) => quantity + cartItem.quantity,
            0
        );
    }
);

export const selectCartItemsTotal = createDraftSafeSelector(
    [selectCartItems],
    (cartItems) => {
        return cartItems.reduce((total, cartItem) => {
            const itemTotalPrice = parseFloat(cartItem.totalPrice);
            if (isNaN(itemTotalPrice)) {
                console.error("Invalid totalPrice for item:", cartItem);
                return total;
            }
            return total + itemTotalPrice;
        }, 0);
    }
);
export const selectCartItemsShippingTotal = createDraftSafeSelector(
    [selectCartItems],
    (cartItems) => {
        return cartItems.reduce((total, cartItem) => {
            const itemShippingCharge = parseFloat(
                cartItem.shipping?.total_charge
            );
            if (isNaN(itemShippingCharge)) {
                console.error(
                    "Invalid total_charge for shipping:",
                    cartItem.shipping
                );
                return total.toFixed(2);
            }
            return total + itemShippingCharge;
        }, 0);
    }
);

export const selectCartItemsTaxTotal = createDraftSafeSelector(
    [selectCartItems],
    (cartItems) => {
        return cartItems.reduce((total, cartItem) => {
            // (item?.tax_rate * priceAmount) / 100
            const itemTotalPrice =
                (parseFloat(cartItem.tax_rate) *
                    parseFloat(cartItem.totalPrice)) /
                100;
            if (isNaN(itemTotalPrice)) {
                console.error("Invalid totalPrice for item:", cartItem);
                return total;
            }
            return total + itemTotalPrice;
        }, 0);
    }
);
