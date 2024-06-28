import ApiManager from "../globalaxios";

const authConfig = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
        Accept: "application/json",
    },
};

export const fetchCategories =
    (conf = "") =>
    async (dispatch) => {
        try {
            const res = await ApiManager.get(
                `/api/categories/${conf ? `?${conf}` : ""}`,
                authConfig
            );
            return res;
        } catch (error) {
            return error;
        }
    };
export const fetchFullCategories =
    (conf = "") =>
    async (dispatch) => {
        try {
            const res = await ApiManager.get(
                `/api/categories/full/`,
                authConfig
            );
            return res;
        } catch (error) {
            return error;
        }
    };

export const fetchGlobalPickups =
    (conf = "") =>
    async (dispatch) => {
        try {
            const res = await ApiManager.get(
                `/api/global_pickups/${conf ? `?${conf}` : ""}`,
                authConfig
            );
            return res;
        } catch (error) {
            return error;
        }
    };

export const fetchProducts =
    (conf = "") =>
    async (dispatch) => {
        try {
            const res = await ApiManager.get(
                `/api/products/${conf ? `?${conf}` : ""}`,
                authConfig
            );
            return res;
        } catch (error) {
            return error;
        }
    };

export const fetchProduct = (id) => async (dispatch) => {
    try {
        const res = await ApiManager.get(`/api/products/${id}/`, authConfig);
        return res;
    } catch (error) {
        return error.response;
        // console.log(error.message);
    }
};

export const fetchNestedCategories = (id) => async (dispatch) => {
    try {
        const res = await ApiManager.get(`/api/category/${id}/`, authConfig);
        return res;
    } catch (error) {
        return error;
    }
};

export const fetchShippingRates = (data) => async (dispatch) => {
    try {
        const res = await ApiManager.post(
            `/api/shipping/rates/`,
            data,
            authConfig
        );
        return res;
    } catch (error) {
        console.log("ERROR", error);
        return error.response;
    }
};

export const fetchAddressBook = () => async (dispatch) => {
    const authConfig = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
            Accept: "application/json",
        },
    };
    try {
        const res = await ApiManager.get(`/api/addresses/`, authConfig);
        return res;
    } catch (error) {
        console.log("ERROR", error.response);
        return error.response;
    }
};

export const fetchShippingOptions = (config) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/shipping-options/${config}`,
            authConfig
        );
        return res;
    } catch (error) {
        // console.log(error.message);
    }
};

export const order = (data) => async (dispatch) => {
    const authConfig = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
            Accept: "application/json",
        },
    };
    const body = JSON.stringify(data);
    try {
        const res = await ApiManager.post(`/api/orders/`, body, authConfig);
        return res;
    } catch (error) {
        return error;
    }
};

export const fetchSellerOrders =
    (conf = "") =>
    async (dispatch) => {
        try {
            const res = await ApiManager.get(
                `/api/orders/seller/${conf ? `?${conf}` : ""}`,
                authConfig
            );
            return res;
        } catch (error) {
            return error;
        }
    };

export const fetchOrders =
    (conf = "") =>
    async (dispatch) => {
        const authConfig = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
                Accept: "application/json",
            },
        };
        try {
            const res = await ApiManager.get(
                `/api/orders/customer/${conf ? `?${conf}` : ""}`,
                authConfig
            );
            return res;
        } catch (error) {
            return error.response;
        }
    };

export const fetchOrdersWithNoPagination =
    (conf = "") =>
    async (dispatch) => {
        const authConfig = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
                Accept: "application/json",
            },
        };
        try {
            const res = await ApiManager.get(
                `/api/orders/customer/all/${conf ? `?${conf}` : ""}`,
                authConfig
            );
            return res;
        } catch (error) {
            return error.response;
        }
    };

export const retrieveCustomerOrder = (id) => async (dispatch) => {
    const authConfig = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
            Accept: "application/json",
        },
    };
    try {
        const res = await ApiManager.get(
            `/api/orders/customer/${id}/`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const createOrderItemBox = (orderItemBoxData) => async (dispatch) => {
    try {
        const res = await ApiManager.post(
            "/api/orders/order-item-boxes/",
            JSON.stringify(orderItemBoxData),
            authConfig
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error.response;
    }
};

export const fetchPDF = (urlOfPdf) => async (dispatch) => {
    try {
        const response = await ApiManager.get(urlOfPdf, {
            responseType: "blob",
            headers: {
                "Content-Type": "application/pdf",
                Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
            },
            withCredentials: true,
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error("Failed to fetch PDF", error);
        return error.response;
    }
};

export const openSupportCase = (data) => async (dispatch) => {
    const body = JSON.stringify(data);
    try {
        const res = await ApiManager.post(
            `/api/support-requests/`,
            body,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const fetchSupportCases = (config) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/support-requests/${config ? `?${config}` : ""}`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const retrieveSupportCase = (id) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/support-requests/${id}/`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const updateSupportCase = (data, id) => async (dispatch) => {
    const body = JSON.stringify(data);
    try {
        const res = await ApiManager.patch(
            `/api/support-requests/${id}/`,
            body,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};
export const createSupportCaseMessage = (data) => async (dispatch) => {
    const body = JSON.stringify(data);
    try {
        const res = await ApiManager.post(
            `/api/support-requests/messages/`,
            body,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const fetchHelpCategories = (config) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/help-categories/${config ? `?${config}` : ""}`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const fetchHelpItems = (config) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/help-items/${config ? `?${config}` : ""}`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const retrieveHelpItem = (id) => async (dispatch) => {
    try {
        const res = await ApiManager.get(`/api/help-items/${id}`, authConfig);
        return res;
    } catch (error) {
        return error.response;
    }
};

export const fetchSimilarItems = (id) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/recommendations/similar-products/${id}/`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const fetchBougthTogetherItems = (config) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/recommendations/bought-together/${
                config ? `?${config}` : ""
            }`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const createReview = (data) => async (dispatch) => {
    const body = JSON.stringify(data);
    try {
        const res = await ApiManager.post(`/api/reviews/`, body, authConfig);
        return res;
    } catch (error) {
        return error.response;
    }
};

export const fetchProductReviews = (id, confi) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/reviews/${id}/${confi ? `${confi}` : ""}`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const fetchUserProductReviewsList = (confi) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/reviews/${confi ? `${confi}` : ""}`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const fetchProductReviewsAnalytics = (id) => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/reviews/analytics/${id}/`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const validateSingleAddress = (data) => async (dispatch) => {
    const body = JSON.stringify(data);
    try {
        const res = await ApiManager.post(
            `/api/addresses/validate/`,
            body,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};

export const getTaxRatesForProducts = (data) => async (dispatch) => {
    const body = JSON.stringify(data);

    try {
        const res = await ApiManager.post(`/api/tax-rates/`, body, authConfig);
        return res;
    } catch (error) {
        return error.response;
    }
};

export const loadsliders = () => async (dispatch) => {
    try {
        const res = await ApiManager.get(
            `/api/sliders/?is_mobile=false`,
            authConfig
        );
        return res;
    } catch (error) {
        return error.response;
    }
};
