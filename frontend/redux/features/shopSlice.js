import { createSlice } from "@reduxjs/toolkit";
import { useTranslations } from "next-intl";

const initialState = {
    categories: [],
    products: [],
    next: null,
    prev: null,
    count: null,
    fullCategories: [],
};

export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        gotCategories: (state, action) => {
            return (state = {
                ...state,
                categories: action.payload,
            });
        },
        gotProducts: (state, action) => {
            state.products = action.payload.results;
            state.next = action.payload.next;
            state.prev = action.payload.prev;
            state.count = action.payload.count;
        },
        gotMoreProducts: (state, action) => {
            state.products = [
                ...action.payload.old_products,
                ...action.payload.results,
            ];
            state.next = action.payload.next;
            state.prev = action.payload.prev;
            state.count = action.payload.count;
        },
        gotFullCategories: (state, action) => {
            state.fullCategories = action.payload;
        },
    },
});

export const {
    gotCategories,
    gotProducts,
    gotMoreProducts,
    gotFullCategories,
} = shopSlice.actions;

export default shopSlice.reducer;
