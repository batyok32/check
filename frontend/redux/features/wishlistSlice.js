import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishItems: [], // List of products in the wishlist
    wishStores: [], // List of stores associated with wishlist items
};

export const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const product = action.payload;

            // Check if the product is already in the wishlist
            const existingItem = state.wishItems.find(
                (item) => item.id === product?.id
            );

            if (!existingItem) {
                state.wishItems.push(product);
            }
        },
        addToWishStore: (state, action) => {
            const existingStore = state.wishStores.find(
                (storeItem) => storeItem.id === store.id
            );

            if (!existingStore) {
                state.wishStores.push(store);
            }
        },
        removeFromWishlistItem: (state, action) => {
            const product = action.payload;

            // Remove the product from wishItems
            state.wishItems = state.wishItems.filter(
                (item) => item.id !== product?.id
            );
        },

        removeFromWishlistStore: (state, action) => {
            const { storeId } = action.payload;

            // Remove the store from wishStores
            state.wishStores = state.wishStores.filter(
                (store) => store.id !== storeId
            );
        },
    },
});

export const {
    addToWishStore,
    addToWishlist,
    removeFromWishlistItem,
    removeFromWishlistStore,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
