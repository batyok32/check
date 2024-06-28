import {
    fetchCategories,
    fetchOrders,
    fetchProducts,
    fetchSellerOrders,
} from "../actions/shopActions";
import { gotMoreProducts, gotProducts } from "../features/shopSlice";

const getConfi = (loadMore, categories, filtersData) => {
    let uniqueCategories = null;

    if (categories && Array.isArray(categories)) {
        uniqueCategories = Array.from(new Set(categories));
    } else if (categories && !Array.isArray(categories)) {
        uniqueCategories = [categories];
    }

    // console.log("FILTERS DATA", filtersData);
    let filters = "";
    if (filtersData) {
        if (filtersData?.search) {
            filters += `&search=${filtersData?.search}`;
        }
        if (filtersData?.seller) {
            filters += `&seller=${filtersData?.seller}`;
        }
        if ("bulk" in filtersData) {
            filters += `&bulk=${filtersData?.bulk}`;
        }
        if (filtersData?.sort) {
            filters += `&ordering=${filtersData?.sort}`;
        }
        if (filtersData?.optionValues && filtersData.optionValues.length > 0) {
            const optionValues = encodeURIComponent(
                filtersData.optionValues.join(", ")
            );
            filters += `&option_values=${optionValues}`;
        }
        if (filtersData?.minPrice) {
            filters += `&min_price=${filtersData?.minPrice}`;
        }
        if (filtersData?.maxPrice) {
            filters += `&max_price=${filtersData?.maxPrice}`;
        }
        if (filtersData?.not_only_active) {
            filters += `&not_only_active=${filtersData?.not_only_active}`;
        }

        if (
            filtersData?.originCountries &&
            filtersData.originCountries.length > 0
        ) {
            const encodedCountries = encodeURIComponent(
                filtersData.originCountries.join(", ")
            );
            filters += `&origin_countries=${encodedCountries}`;
        }
    }
    // console.log("FILTERS", filters);

    let categoryQueryString = uniqueCategories
        ? uniqueCategories.map((category) => `category=${category}`).join("&")
        : "";
    let loadMoreQueryString = loadMore
        ? `&limit=20&offset=${loadMore}`
        : "&limit=10&available=true";

    let confi = `${categoryQueryString}${filters}${loadMoreQueryString}`;

    confi = confi.replace(/\s|null|undefined|\*&/g, "");
    confi = confi.replace(/\?&/g, "?");

    return confi;
};

export const getData =
    (loadMore, products, categories, setIsLoading) => (dispatch) => {
        const confi = getConfi(loadMore, categories, null);
        setIsLoading(true);
        // console.log("CATEGORIES...............", categories);
        // console.log("CONFIG.................", confi);
        if (loadMore) {
            dispatch(fetchProducts(confi)).then((res) => {
                if (res.data) {
                    dispatch(
                        gotMoreProducts({ ...res.data, old_products: products })
                    );
                }
                setIsLoading(false);
            });
        } else {
            dispatch(fetchProducts(confi)).then((res) => {
                if (res.data) {
                    dispatch(gotProducts(res.data));
                }
                // console.log("RES", res);

                setIsLoading(false);
            });
        }
    };

export const getProductsData =
    (loadMore, categories, filtersData, setIsLoading) => async (dispatch) => {
        // console.log("CATEGORIES", categories);
        const confi = getConfi(loadMore, categories, filtersData);
        setIsLoading(true);
        let response = null;
        let res = await dispatch(fetchProducts(confi));
        if (res.data) {
            response = res.data;
        }
        setIsLoading(false);
        return response;
    };

export const getCategoriesConfi = (parent_id) => {
    let confi = `
    ${parent_id ? `parent_id=${parent_id}` : ""}`;
    confi = confi.replace(/\s/g, "");
    confi = confi.replace("null", "");
    confi = confi.replace("undefined", "");
    confi = confi.replace("*&", "");
    confi = confi.replace("*", "");
    return confi;
};

const getOrderConfi = (loadMore, filtersData) => {
    // console.log("FILTERS DATA", filtersData);
    let filters = "";
    if (filtersData) {
        if (filtersData?.search) {
            filters += `&search=${filtersData?.search}`;
        }
        if (filtersData?.seller) {
            filters += `&seller=${filtersData?.seller}`;
        }
        if (filtersData?.status) {
            filters += `&status=${filtersData?.status}`;
        }
        if (filtersData?.order_id) {
            filters += `&id=${filtersData?.order_id}`;
        }
        if (filtersData?.sort) {
            filters += `&ordering=${filtersData?.sort}`;
        }
        if (filtersData?.closed) {
            filters += `&closed=${filtersData?.closed}`;
        }
    }

    let loadMoreQueryString = loadMore
        ? `&limit=20&offset=${loadMore}`
        : "&limit=10&available=true";

    let confi = `${filters}${loadMoreQueryString}`;

    confi = confi.replace(/\s|null|undefined|\*&/g, "");
    confi = confi.replace(/\?&/g, "?");

    return confi;
};

export const getSellerOrderItems =
    (loadMore, filtersData, setIsLoading) => async (dispatch) => {
        const confi = getOrderConfi(loadMore, filtersData);
        setIsLoading(true);
        let response = null;

        await dispatch(fetchSellerOrders(confi)).then((res) => {
            if (res.data) {
                response = res.data;
            }
            setIsLoading(false);
        });
        return response;
    };

export const getOrderItems =
    (loadMore, filtersData, setIsLoading) => async (dispatch) => {
        const confi = getOrderConfi(loadMore, filtersData);
        console.log("CONGIGG", confi, filtersData);

        setIsLoading(true);
        let response = null;

        await dispatch(fetchOrders(confi)).then((res) => {
            if (res.data) {
                response = res.data;
            }
            setIsLoading(false);
        });
        return response;
    };

export const getCategoryOptionsConfig = (categories) => {
    let uniqueCategories = null;

    if (categories && Array.isArray(categories)) {
        uniqueCategories = Array.from(new Set(categories));
    } else if (categories && !Array.isArray(categories)) {
        uniqueCategories = [categories];
    }

    let categoryQueryString = uniqueCategories
        ? uniqueCategories.map((category) => `category=${category}`).join("&")
        : "";

    let confi = `${categoryQueryString}`;

    confi = confi.replace(/\s|null|undefined|\*&/g, "");
    confi = confi.replace(/\?&/g, "?");

    return confi;
};

export const getHelpItemsConfi = (category, loadMore, userType) => {
    let categoryQueryString = category ? `category=${category}` : "";
    if (userType) {
        categoryQueryString += `&user_type=${userType}`;
    }
    let loadMoreQueryString = loadMore
        ? `&limit=20&offset=${loadMore}`
        : "&limit=10&available=true";

    let confi = `${categoryQueryString}${loadMoreQueryString}`;

    confi = confi.replace(/\s|null|undefined|\*&/g, "");
    confi = confi.replace(/\?&/g, "?");

    return confi;
};

export const getProductReviewConfi = (filtersData, loadMore) => {
    let filters = "";
    if (filtersData) {
        if (filtersData?.order) {
            filters += `&ordering=${filtersData?.order}`;
        }
    }

    let loadMoreQueryString = loadMore
        ? `&limit=20&offset=${loadMore}`
        : "&limit=10&available=true";

    let confi = `?${filters}${loadMoreQueryString}`;

    confi = confi.replace(/\s|null|undefined|\*&/g, "");
    confi = confi.replace(/\?&/g, "?");

    return confi;
};

export const getSellerTransactionConfi = (filtersData, loadMore) => {
    let loadMoreQueryString = loadMore
        ? `&limit=20&offset=${loadMore}`
        : "&limit=10&available=true";

    let confi = `?${loadMoreQueryString}`;

    confi = confi.replace(/\s|null|undefined|\*&/g, "");
    confi = confi.replace(/\?&/g, "?");

    return confi;
};

export const getSupportCaseConfi = (loadMore, filtersData) => {
    let filters = "";

    if (filtersData) {
        if (filtersData?.sort) {
            filters += `&ordering=${filtersData?.sort}`;
        }
        if (filtersData?.status) {
            filters += `&status=${filtersData?.status}`;
        }
    }

    let loadMoreQueryString = loadMore
        ? `&limit=20&offset=${loadMore}`
        : "&limit=10&available=true";

    let confi = `?${filters}${loadMoreQueryString}`;

    confi = confi.replace(/\s|null|undefined|\*&/g, "");
    confi = confi.replace(/\?&/g, "?");

    return confi;
};

export const convertToLocale = (languageCode) => {
    const localeMap = {
        en: "en-US", // English (United States)
        fr: "fr-FR", // French (France)
        de: "de-DE", // German (Germany)
        es: "es-ES", // Spanish (Spain)
        zh: "zh-CN", // Chinese (China)
        ja: "ja-JP", // Japanese (Japan)
        ru: "ru-RU", // Russian (Russia)
        ar: "ar-SA", // Arabic (Saudi Arabia)
        pt: "pt-BR", // Portuguese (Brazil)
        it: "it-IT", // Italian (Italy)
    };

    return localeMap[languageCode] || languageCode;
};

export const getSellerSellingDetails = (timestamp_range) => {
    let filters = "";

    filters += `timestamp_after=${timestamp_range[0]
        .toISOString()
        .slice(0, 10)}&timestamp_before=${timestamp_range[1]
        .toISOString()
        .slice(0, 10)}`;

    let confi = `?${filters}`;

    confi = confi.replace(/\s|null|undefined|\*&/g, "");
    confi = confi.replace(/\?&/g, "?");

    return confi;
};

export const getWindowLocale = () => {
    const url = window.location.pathname;
    const urlSegments = url.split("/");
    const locale = urlSegments[1];
    return locale;
};
