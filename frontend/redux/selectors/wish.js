import { createDraftSafeSelector } from "@reduxjs/toolkit";

export const selectWishData = (state) => state.wishlist;

export const selectWishItems = createDraftSafeSelector(
    [selectWishData],
    (wishData) => {
        console.log("WISH ITEMS", wishData.wishItems);
        return wishData.wishItems;
    }
);
export const selectWishStores = createDraftSafeSelector(
    [selectWishData],
    (wishData) => wishData.wishStores
);
