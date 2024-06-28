import ApiManager from "../globalaxios";

const authConfig = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
        Accept: "application/json",
    },
};

export const fetchCategoryOptions = (category_id) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/category_options/${category_id}/`,
            authConfig
        );
        return res;
    } catch (error) {
        return error;
    }
};

export const fetchFullCategoryOptions = (filters) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/category_options/?${filters}`,
            authConfig
        );
        return res;
    } catch (error) {
        return error;
    }
};

export const fetchProductOptions =
    (searchValue, categoryOptionId) => async (dispatch) => {
        try {
            const res = await ApiManager.get(
                `/api/product_options/?category_option=${categoryOptionId}${
                    searchValue ? `&search=${searchValue}` : ""
                }`,
                authConfig
            );
            return res;
        } catch (error) {
            return error;
        }
    };

export const createProductInDB = (data) => async (dispatch) => {
    try {
        console.log("BODY", data);
        const res = await ApiManager.post("/api/products/create/", data, {
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

export const updateProduct = (data, id) => async (dispatch) => {
    try {
        const res = await ApiManager.put(`/api/products/update/${id}/`, data, {
            headers: {
                "Content-Type": "multipart/form-data;",
                Accept: "application/json",
                Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
            },
            formData: true,
        });
        console.log("REES", res);
        return res;
    } catch (error) {
        console.log("ERROR", error);
        return error.response;
    }
};

export const deleteProducts = (data) => async (dispatch) => {
    try {
        const res = await ApiManager.post(
            `/api/delete-products/`,
            data,
            authConfig
        );

        return res;
    } catch (error) {
        console.log("Error", error);

        return error.response;
    }
};

export const fetchNearestWholestore =
    (conf = "") =>
    async (dispatch) => {
        try {
            const res = await ApiManager.get(
                `/api/orders/nearest-wholestore/${conf ? `?${conf}` : ""}`,
                authConfig
            );
            return res;
        } catch (error) {
            return error;
        }
    };

export const fetchSellerFinances = () => async (dispatch) => {
    try {
        const res = await ApiManager.get(`/api/orders/finances/`, authConfig);
        return res;
    } catch (error) {
        return error;
    }
};
export const fetchSellerFinanceTransactions = (confi) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/finance/transactions/${confi ? `${confi}` : ""}`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};
export const fetchSellerListingDetails = (confi) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/dashboard/listings-details/${confi ? `${confi}` : ""}`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};
export const fetchSellerSellingDetails = (confi) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/dashboard/selling-details/${confi ? `${confi}` : ""}`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const fetchShippingLabelsForOrderItem = (id) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/orders/shipping-labels/${id}/`,
            authConfig
        );
        return res;
    } catch (error) {
        return error;
    }
};

export const setShippedStatusForOrderItem =
    ({ order_id, labels_state, labels_is_created, status }) =>
    async (dispatch) => {
        try {
            const res = await ApiManager.patch(
                `/api/orders/seller/${order_id}/`,
                JSON.stringify({
                    labels_state: labels_state,
                    labels_is_created: labels_is_created,
                    status: status,
                }),
                authConfig
            );

            return res;
        } catch (error) {
            return error.response;
        }
    };

export const retrieveSellerOrder = (id) => async (dispatch) => {
    const authConfig = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
            Accept: "application/json",
        },
    };
    try {
        const res = await ApiManager.get(
            `/api/orders/seller/${id}/`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const requestWithdraw = (data) => async (dispatch) => {
    const body = JSON.stringify(data);
    try {
        const res = await ApiManager.post(
            `/api/finance/withdraw/`,
            body,
            authConfig
        );

        return res;
    } catch (error) {
        console.log("Error", error);

        return error.response;
    }
};

export const schedulePickup = (data) => async (dispatch) => {
    const body = JSON.stringify(data);
    try {
        const res = await ApiManager.post(
            `/api/orders/seller/schedule-pickup/`,
            body,
            authConfig
        );

        return res;
    } catch (error) {
        console.log("Error", error);

        return error.response;
    }
};

export const getPickupHistory = (id) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/orders/seller/list-pickup/${id}/`,
            authConfig
        );

        return res;
    } catch (error) {
        console.log("Error", error);

        return error.response;
    }
};

// export const checkOrderItemPickupStatus = (data) => async (dispatch) => {
//     const body = JSON.stringify(data);
//     try {
//         const res = await ApiManager.post(
//             `/api/orders/seller/check-pickup/`,
//             body,
//             authConfig
//         );

//         return res;
//     } catch (error) {
//         console.log("Error", error);

//         return error.response;
//     }
// };
