import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const initialState = {
    chosenAddress: null,
    addressList: [],
    refetchAddresses: Math.random(),
};

export const addressBookSlice = createSlice({
    name: "addressBook",
    initialState,
    reducers: {
        setChosenAddress: (state, action) => {
            state.chosenAddress = action.payload;
        },
        addAddress: (state, action) => {
            state.addressList.push(action.payload);
        },
        updateAddress: (state, action) => {
            const { id, address } = action.payload;
            const index = state.addressList.findIndex((addr) => addr.id === id);
            if (index !== -1) {
                state.addressList[index] = address;
            }
        },
        removeAddress: (state, action) => {
            state.addressList = state.addressList.filter(
                (addr) => addr.id !== action.payload
            );
            if (action.payload === state.chosenAddress.id) {
                state.chosenAddress = null;
            }
        },
        fillAddresList: (state, action) => {
            state.addressList = action.payload;
        },
        setRefetchAddress: (state, action) => {
            state.refetchAddresses = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, (state) => {
            state.addressList = []; // Clear the address list
            state.chosenAddress = null; // Reset the chosen address
        });
    },
});

export const {
    setChosenAddress,
    addAddress,
    updateAddress,
    removeAddress,
    setRefetchAddress,
    fillAddresList,
} = addressBookSlice.actions;

export default addressBookSlice.reducer;
