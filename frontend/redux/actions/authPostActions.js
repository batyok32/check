import { logout, setAuth } from "../features/authSlice";
import ApiManager from "../globalaxios";
import { getMe } from "./authActions";

const authConfig = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
        Accept: "application/json",
    },
};

const axiosConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

export const socialAuthenticate =
    ({ provider, code }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.post(
                `/o/${provider}/?state=${encodeURIComponent(
                    state
                )}&code=${encodeURIComponent(code)}`,
                JSON.stringify({ provider, code }),
                {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            );

            return res.data;
        } catch (error) {
            return error.response.status;
        }
    };

export const login =
    ({ email, password }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.post(
                `/api/jwt/create/`,
                JSON.stringify({ email, password }),
                authConfig
            );

            return res;
        } catch (error) {
            dispatch(logout());
            return error.response;
        }
    };

export const register =
    ({ first_name, last_name, email, password, re_password }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.post(
                `/api/users/`,
                JSON.stringify({
                    first_name,
                    last_name,
                    email,
                    password,
                    re_password,
                }),
                authConfig
            );

            return res;
        } catch (error) {
            return error;
        }
    };

export const verify = () => async (dispatch) => {
    try {
        const res = await ApiManager.post(
            `/api/jwt/verify/`,
            JSON.stringify({
                token: localStorage.getItem("TOKEN_KEY"),
            }),
            authConfig
        );

        return res;
    } catch (error) {
        return error.response.status;
    }
};

export const editProfile =
    ({ first_name, last_name }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.patch(
                `/api/users/me/`,
                JSON.stringify({ first_name, last_name }),
                authConfig
            );

            return res;
        } catch (error) {
            return error.response.status;
        }
    };

export const refreshToken = () => async (dispatch) => {
    const token = localStorage.getItem("REFRESH_KEY");

    if (token) {
        try {
            const res = await ApiManager.post(
                `/api/jwt/refresh/`,
                JSON.stringify({
                    refresh: localStorage.getItem("REFRESH_KEY"),
                }),
                authConfig
            );
            dispatch(setAuth(res.data));
            return res;
        } catch (error) {
            dispatch(logout());
            return error.response;
        }
    }
};

export const activation =
    ({ uid, token }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.post(
                `/api/users/activation/`,
                JSON.stringify({ uid, token }),
                axiosConfig
            );

            return res;
        } catch (error) {
            return error.response;
        }
    };

export const resetPassword = (email) => async (dispatch) => {
    try {
        const res = await ApiManager.post(
            `/api/users/reset_password/`,
            JSON.stringify({ email }),
            authConfig
        );

        return res;
    } catch (error) {
        return error.response;
    }
};

export const resendActivationEmail = (email) => async (dispatch) => {
    try {
        const res = await ApiManager.post(
            `/api/users/resend_activation/`,
            JSON.stringify({ email }),
            authConfig
        );

        return res;
    } catch (error) {
        return error.response;
    }
};

export const resetPasswordConfirm =
    ({ uid, token, new_password, re_new_password }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.post(
                `/api/users/reset_password_confirm/`,
                JSON.stringify({ uid, token, new_password, re_new_password }),
                authConfig
            );

            return res;
        } catch (error) {
            return error.response;
        }
    };

export const sendVerificationSms =
    ({ phone_number }) =>
    async (dispatch) => {
        const authConfig = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
                Accept: "application/json",
            },
        };
        try {
            const res = await ApiManager.post(
                `/api/send_sms/`,
                JSON.stringify({ phone_number }),
                authConfig
            );

            return res;
        } catch (error) {
            return error.response;
        }
    };

export const verifySmsCode =
    ({ phone_number, verification_code }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.post(
                `/api/verify_sms/`,
                JSON.stringify({ phone_number, verification_code }),
                authConfig
            );

            return res;
        } catch (error) {
            return error.response;
        }
    };

export const submitVenderData = (data) => async (dispatch) => {
    try {
        const res = await ApiManager.post(`/api/create_seller_profile/`, data, {
            headers: {
                "Content-Type": "multipart/form-data;",
                Accept: "application/json",
                Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
            },
            formData: true,
        });

        return res;
    } catch (error) {
        return error.response;
    }
};

export const createAddressInBook =
    ({ address_line1, address_line2, city, state, zip_code, country }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.post(
                `/api/addresses/`,
                JSON.stringify({
                    address_line1,
                    address_line2,
                    city,
                    state,
                    zip_code,
                    country,
                }),
                authConfig
            );

            return res;
        } catch (error) {
            return error.response;
        }
    };
export const updateAddressInBook =
    ({ id, address_line1, address_line2, city, state, zip_code, country }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.patch(
                `/api/addresses/${id}`,
                JSON.stringify({
                    id,
                    address_line1,
                    address_line2,
                    city,
                    state,
                    zip_code,
                    country,
                }),
                authConfig
            );

            return res;
        } catch (error) {
            return error.response;
        }
    };
export const deleteAddressFromBook = (addressId, conf) => async (dispatch) => {
    try {
        const res = await ApiManager.delete(
            `/api/addresses/${addressId}${conf ? conf : ""}`,
            authConfig
        );

        return res;
    } catch (error) {
        return error.response;
    }
};
