import { createDraftSafeSelector } from "@reduxjs/toolkit";

export const selectAuthData = (state) => state.auth;

export const selectUserData = createDraftSafeSelector(
    [selectAuthData],
    (authData) => authData.user
);
