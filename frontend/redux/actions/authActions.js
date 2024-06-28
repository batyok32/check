import {
    fillAddresList,
    setChosenAddress,
    setRefetchAddress,
} from "../features/addressBookSlice";
import {
    logout,
    setAuth,
    setSellerProfile,
    setUserData,
} from "../features/authSlice";
import ApiManager from "../globalaxios";
import { refreshToken } from "./authPostActions";
import { fetchAddressBook } from "./shopActions";

const authConfig = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
        Accept: "application/json",
    },
};

export const fetchAddresses = () => (dispatch) => {
    dispatch(fetchAddressBook()).then((res) => {
        dispatch(fillAddresList(res.data));
        if (res?.data?.length > 0) {
            dispatch(setChosenAddress(res.data[0]));
        } else {
            dispatch(setChosenAddress(null));
        }
        dispatch(setRefetchAddress(null));
    });
};

export const getMe = () => async (dispatch) => {
    const authConfig2 = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
            Accept: "application/json",
        },
    };

    try {
        const res = await ApiManager.get("/api/users/me/", authConfig2);
        dispatch(setUserData(res.data));
        setTimeout(() => {
            dispatch(fetchAddresses());
        }, 1000);
        if (res?.data?.is_seller) {
            dispatch(getSellerProfile());
        }
        return res.data;
    } catch (error) {
        return error.response;
        // dispatch(gotError(error.message));
    }
};

export const getSellerProfile = () => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            "/api/seller_profiles/me/",
            authConfig
        );
        dispatch(setSellerProfile(res.data));
        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const submitSellerData = (data) => async (dispatch) => {
    try {
        console.log("BODY", data);
        const res = await ApiManager.post("/api/create_seller_profile/", data, {
            headers: {
                "Content-Type": "multipart/form-data;",
                Accept: "application/json",
                Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
            },
            withCredentials: true,
            formData: true,
        });
        console.log("REES", res);
        return res;
    } catch (error) {
        console.log("ERROR", error);
        return error.response;
    }
};

export const checkStoreName = (storeName) => async (dispatch) => {
    try {
        console.log("CHECKING ", storeName);
        const res = await ApiManager.get(
            `/api/check_store_name/?store_name=${storeName}`,
            authConfig
        );
        return res.data;
    } catch (error) {
        console.log("ERROR");
        return error;
    }
};

export const checkPhoneNumber = (phoneNumber) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/check_phone_number/?phone_number=${phoneNumber}`,
            authConfig
        );
        return res.data;
    } catch (error) {
        console.log("ERROR");
        return error;
    }
};

export const logoutAxios = () => async (dispatch) => {
    try {
        const res = await ApiManager.post("/logout/", authConfig);
        if (res) {
            dispatch(logout());
        }
        return res;
    } catch (error) {
        return error;
    }
};
export const refreshTokenAxios = () => async (dispatch) => {
    try {
        const res = await ApiManager.post("/api/jwt/refresh/", authConfig);
        if (res.data) {
            dispatch(setAuth(res.data));
        } else {
            dispatch(logoutAxios());
        }
    } catch (error) {
        return error;
    }
};

export const isLoggedIn = () => async (dispatch) => {
    const token = localStorage.getItem("TOKEN_KEY");

    if (token) {
        try {
            const body = JSON.stringify({ token: token });

            const res = await ApiManager.post("/api/jwt/verify/", body, {});

            if (res.data.code !== "token_not_valid") {
                const refreshToken = localStorage.getItem("REFRESH_KEY");
                dispatch(setAuth({ access: token, refresh: refreshToken }));
                dispatch(getMe());
            } else {
                dispatch(refreshToken());
            }
            return res.data;
        } catch (error) {
            dispatch(refreshToken());
        }
    } else {
        dispatch(logout());
    }
    return;
};

export const getClientDashData = () => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            "/api/dashboard/client-details/",
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const saveCardRequest = (data) => async (dispatch) => {
    const body = JSON.stringify(data);
    console.log("BODY", body);
    try {
        const res = await ApiManager.post("/api/add-card/", body, authConfig);
        return res;
    } catch (error) {
        return error.response;
    }
};

export const loadUserCards = () => async (dispatch) => {
    try {
        const res = await ApiManager.get("/api/list-cards/", authConfig);
        return res;
    } catch (error) {
        return error.response;
    }
};

export const deleteUserCard = (id) => async (dispatch) => {
    try {
        const res = await ApiManager.delete(
            `/api/delete-card/${id}/`,
            authConfig
        );

        return res;
    } catch (error) {
        return error.response;
    }
};
