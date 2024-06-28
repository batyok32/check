import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    seller_profile: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            console.log("SETAUTH", action.payload);
            localStorage.setItem("TOKEN_KEY", action.payload.access);
            localStorage.setItem("REFRESH_KEY", action.payload.refresh);
            state.isAuthenticated = true;
        },
        logout: (state, action) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem("TOKEN_KEY");
            localStorage.removeItem("REFRESH_KEY");
        },
        finishInitialLoad: (state) => {
            state.isLoading = false;
        },
        setUserData: (state, action) => {
            state.user = action.payload;
        },
        setSellerProfile: (state, action) => {
            state.seller_profile = action.payload;
        },
    },
});

export const {
    setAuth,
    logout,
    finishInitialLoad,
    setUserData,
    setSellerProfile,
} = authSlice.actions;
export default authSlice.reducer;
