import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    lastCartItemAmount: 0,
    lastChosenAddress: null,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const {
                product,
                selectedVariations,
                quantity,
                totalPrice,
                shipping,
                is_active = true,
                chosenAddress,
                tax_rate,
                selectedBulkPolicy,
            } = action.payload;
            // const existingItem = state.items.find(
            //     (item) =>
            //         item.product.id === product.id &&
            //         JSON.stringify(item.selectedVariations) ===
            //             JSON.stringify(selectedVariations)
            // );

            const existingItem = state.items.find(
                (item) =>
                    item.product.id === product.id &&
                    JSON.stringify(item.selectedVariations) ===
                        JSON.stringify(selectedVariations) &&
                    (!product.sell_in_containers ||
                        (item?.selectedBulkPolicy &&
                            item?.selectedBulkPolicy.id ===
                                selectedBulkPolicy?.id))
            );

            // console.log("TAX RATEE", tax_rate);

            if (existingItem) {
                existingItem.quantity = quantity;
                existingItem.totalPrice = totalPrice;
                existingItem.shipping = shipping;
                existingItem.is_active = is_active;
                existingItem.chosenAddress = chosenAddress;
                existingItem.tax_rate = tax_rate;
                existingItem.selectedBulkPolicy = selectedBulkPolicy;
            } else {
                state.items.push({
                    product,
                    selectedVariations,
                    quantity,
                    totalPrice,
                    shipping,
                    is_active,
                    chosenAddress,
                    tax_rate,
                    selectedBulkPolicy,
                });
            }
        },
        removeFromCart: (state, action) => {
            // state.items = state.items.filter((cartItem) => {
            //     return !action.payload.some((payloadItem) => {
            //         return (
            //             cartItem.product.id === payloadItem.product.id &&
            //             JSON.stringify(cartItem.selectedVariations) ===
            //                 JSON.stringify(payloadItem.selectedVariations)
            //         );
            //     });
            // });

            state.items = state.items.filter((cartItem) => {
                return !action.payload.some((payloadItem) => {
                    return (
                        cartItem.product.id === payloadItem.product.id &&
                        JSON.stringify(cartItem.selectedVariations) ===
                            JSON.stringify(payloadItem.selectedVariations) &&
                        (!payloadItem.product.sell_in_containers ||
                            (cartItem.selectedBulkPolicy &&
                                cartItem.selectedBulkPolicy.id ===
                                    payloadItem.selectedBulkPolicy?.id))
                    );
                });
            });
        },

        adjustQuantity: (state, action) => {
            const {
                product,
                selectedVariations,
                quantity,
                totalPrice,
                shipping,
            } = action.payload;
            const existingItem = state.items.find(
                (item) =>
                    item.product.id === product.id &&
                    JSON.stringify(item.selectedVariations) ===
                        JSON.stringify(selectedVariations)
            );

            if (existingItem) {
                existingItem.quantity = quantity;
                existingItem.totalPrice = totalPrice;
                existingItem.shipping = shipping;
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
        setLastSeenData: (state, action) => {
            state.lastCartItemAmount = action.payload.amount;
            state.lastChosenAddress = action.payload.address;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    adjustQuantity,
    clearCart,
    setLastSeenData,
} = cartSlice.actions;

export default cartSlice.reducer;
