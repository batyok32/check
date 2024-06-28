import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: [],
    chosenCategory: null,
    categoryOptions: [],
};

export const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        retievedCategories: (state, action) => {
            return (state = {
                ...state,
                categories: action.payload,
            });
        },
        setChosenCategory: (state, action) => {
            state.chosenCategory = action.payload;
        },
        setCategoryOptions: (state, action) => {
            state.categoryOptions = action.payload;
        },
    },
});

export const { retievedCategories, setChosenCategory, setCategoryOptions } =
    sellerSlice.actions;

export default sellerSlice.reducer;
