import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { toast } from "react-toastify";
import {
    convertToKilograms,
    convertToMeters,
    parseAndFormatDecimal,
} from "./opts";
import { fetchShippingRates } from "../actions/shopActions";
import countries from "@/components/utils/countries";

export const getProductStars = (product, size = 16) => {
    const filledStars = Math.floor(
        product?.avg_rating ? product?.avg_rating : 5
    ); // Calculate the number of filled stars
    const remainingStars = 5 - filledStars; // Calculate the number of remaining stars (empty)

    // Generate filled stars
    const filledStarIcons = Array.from({ length: filledStars }, (_, index) => (
        <IconStarFilled key={index} size={size} className="text-yellow" />
    ));

    // Generate remaining empty stars
    const emptyStarIcons = Array.from(
        { length: remainingStars },
        (_, index) => (
            <IconStar
                key={filledStars + index}
                size={size}
                className="text-yellow"
            />
        )
    );
    return { filledStarIcons, emptyStarIcons };
};

export const getReviewStars = (review, size = 16) => {
    const filledStars = Math.floor(review?.rating ? review?.rating : 5); // Calculate the number of filled stars
    const remainingStars = 5 - filledStars; // Calculate the number of remaining stars (empty)

    // Generate filled stars
    const filledStarIcons = Array.from({ length: filledStars }, (_, index) => (
        <IconStarFilled key={index} size={size} className="text-yellow" />
    ));

    // Generate remaining empty stars
    const emptyStarIcons = Array.from(
        { length: remainingStars },
        (_, index) => (
            <IconStar
                key={filledStars + index}
                size={size}
                className="text-yellow"
            />
        )
    );
    return { filledStarIcons, emptyStarIcons };
};

export const productGlobalAmountChange = (
    sign,
    quantity,
    amountValue,
    setAmountValue,
    product,
    selectedVariation,
    setMaximumVariationAmount,
    selectedBulkPolicy = null
) => {
    let resValue;
    let defaultValue = quantity ? parseInt(quantity) : amountValue;

    if (sign === "plus") {
        resValue = parseInt(defaultValue + 1);
    } else if (sign === "minus") {
        if (defaultValue > 1) {
            resValue = parseInt(defaultValue - 1);
        } else {
            toast.warning("Order can not be 0.", {
                className: "fs-14",
            });
            return;
        }
    } else {
        resValue = defaultValue;
    }
    let bulkPolicy = selectedBulkPolicy;
    if (!product?.sell_in_containers) {
        //     bulkPolicy = selectedBulkPolicy;

        //     if (product?.in_stock / bulkPolicy?.minimum_quantity < 1) {
        //         resValue = 0;
        //         setAmountValue(0);
        //         return resValue;
        //     }
        // } else {
        bulkPolicy = getProductBulkPolicy(product, amountValue);
        if (product?.limited_stock && amountValue > product?.in_stock) {
            if (!selectedVariation) {
                bulkPolicy = getProductBulkPolicy(product, product?.in_stock);
            }
        }
    }

    if (product?.bulk && !bulkPolicy) {
        console.log("NO BULK POLICY");
        resValue = 0;
        setAmountValue(0);
        return resValue;
    }
    console.log("BULK POLICY", bulkPolicy);

    if (product?.variation_categories?.length === 0) {
        if (product?.sell_in_containers) {
            if (product?.limited_stock) {
                const availableAmount = Math.floor(
                    product?.in_stock / bulkPolicy?.minimum_quantity
                );

                if (resValue < availableAmount) {
                    resValue = availableAmount;
                } else if (
                    product?.limited_stock &&
                    resValue > availableAmount
                ) {
                    resValue = availableAmount;
                }
            }
        } else {
            if (resValue < product?.min_order_quantity) {
                resValue = product?.min_order_quantity;
            } else if (product?.limited_stock && resValue > product?.in_stock) {
                resValue = product?.in_stock;
            }
        }
        setAmountValue(resValue);
    } else {
        if (
            selectedVariation &&
            Object.keys(selectedVariation).length ===
                product?.variation_categories.length
        ) {
            if (product?.limited_stock) {
                let smallestStock = null;
                let nameList = [];

                for (const [id, data] of Object.entries(selectedVariation)) {
                    if (
                        smallestStock === null ||
                        data?.in_stock < smallestStock
                    ) {
                        smallestStock = data?.in_stock;
                    }
                    nameList.push(data?.name);
                }
                console.log("NAME LIST", nameList);
                const foundQuantityTable = product?.variation_quantities.find(
                    (variation_quantity) =>
                        nameList.every((name) =>
                            variation_quantity.variations.includes(name)
                        )
                );
                console.log("FOUND QUANTITY TABLE ", foundQuantityTable);
                console.log("REs value 1 ", resValue);

                if (product?.sell_in_containers) {
                    if (foundQuantityTable) {
                        let maxAllowed = Math.floor(
                            foundQuantityTable.in_stock /
                                selectedBulkPolicy?.minimum_quantity
                        );

                        if (maxAllowed >= 1) {
                            resValue = Math.min(resValue, maxAllowed);

                            setMaximumVariationAmount(maxAllowed);
                        } else {
                            resValue = 0;
                            setMaximumVariationAmount(0);
                        }
                    } else {
                        resValue = Math.min(
                            product?.in_stock /
                                selectedBulkPolicy?.minimum_quantity,
                            resValue
                        );
                    }
                } else {
                    if (foundQuantityTable) {
                        resValue = Math.min(
                            Math.max(resValue, product?.min_order_quantity),
                            foundQuantityTable.in_stock
                        );
                        console.log("QUANTITY TABLE AMOUNT", resValue);
                        let bulkpolicy = getProductBulkPolicy(
                            product,
                            resValue
                        );
                        if (product?.bulk && !bulkpolicy) {
                            resValue = 0;
                        }
                        setMaximumVariationAmount(foundQuantityTable.in_stock);
                    } else {
                        resValue = product?.min_order_quantity;
                    }
                }
                console.log("RES VALUE 2", resValue);
            } else {
                if (!product?.sell_in_containers) {
                    if (resValue < product?.min_order_quantity) {
                        resValue = product?.min_order_quantity;
                    }
                }
            }
            setAmountValue(resValue);
        } else {
            toast.warning("Please choose all available variations.", {
                className: "fs-14",
            });
            return;
        }
    }
    return resValue;
};

export const getProductBulkPolicy = (product, amountValue) => {
    console.log("\n\namountvalue", amountValue);
    const sortedBulks = [...(product?.bulks || [])] // Create a new array
        .sort((a, b) => b.minimum_quantity - a.minimum_quantity);
    console.log("SORTED BYLKS", sortedBulks);
    for (const bulk of sortedBulks) {
        console.log("IT IS BULK AND AMOUNT VALUE", bulk, amountValue);

        if (amountValue >= bulk.minimum_quantity) {
            console.log("RETURNING THAT BULK");
            return bulk;
        }
    }
    return null;
};

export const moveCursorToEnd = (element) => {
    if (element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

export const getProductPriceAmount = (
    product,
    getBulkPolicy,
    amountValue,
    selectedBulkPolicy
) => {
    let priceValue;
    if (product?.bulk) {
        if (product?.sell_in_containers) {
            if (selectedBulkPolicy) {
                priceValue =
                    parseAndFormatDecimal(selectedBulkPolicy.price) *
                    amountValue;
            } else {
                priceValue =
                    parseAndFormatDecimal(product?.min_price) * amountValue;
            }
        } else {
            const bulkPolicy = getBulkPolicy();
            if (bulkPolicy) {
                priceValue =
                    parseAndFormatDecimal(bulkPolicy.price) * amountValue;
            } else {
                priceValue = 0;
            }
        }
    } else {
        priceValue = parseAndFormatDecimal(product?.min_price) * amountValue;
    }
    priceValue = parseAndFormatDecimal(priceValue);

    return priceValue;
};

export const addProductToCartGlobalFn = (
    product,
    selectedVariation,
    chosenShipRate,
    dispatch,
    addToCart,
    amountValue,
    handlePriceAmount,
    is_active = true,
    chosenAddress,
    tax_rate = null,
    selectedBulkPolicy = null
) => {
    console.log("GLOBAL FN chosenShipRate", chosenShipRate);
    console.log("GLOBAL FN is_active", is_active);
    console.log("selectedVariation", selectedVariation);
    if (amountValue > 0) {
        // let isAvailable;

        // if (selectedVariation) {
        //     let smallestStock = null;
        //     let nameList = [];
        //     let resValue;

        //     for (const [id, data] of Object.entries(selectedVariation)) {
        //         if (smallestStock === null || data?.in_stock < smallestStock) {
        //             smallestStock = data?.in_stock;
        //         }
        //         nameList.push(data?.name);
        //     }
        //     const foundQuantityTable = product?.variation_quantities.find(
        //         (variation_quantity) =>
        //             nameList.every((name) =>
        //                 variation_quantity.variations.includes(name)
        //             )
        //     );

        //     if (foundQuantityTable) {
        //         isAvailable = product.limited_stock
        //             ? foundQuantityTable.in_stock > 0 &&
        //               foundQuantityTable.in_stock >= amountValue
        //             : true;

        //             {product?.quantity /
        //                                                                         bulk.minimum_quantity >=
        //                                                                     1
        //                                                                         ? product?.quantity /
        //                                                                           bulk.minimum_quantity
        //                                                                         : "Not available"}

        //     } else {
        //         isAvailable = product.limited_stock
        //             ? product.in_stock > 0 && product.in_stock >= amountValue
        //             : true;
        //     }
        // } else {
        //     isAvailable = product.limited_stock
        //         ? product.in_stock > 0 && product.in_stock >= amountValue
        //         : true;
        // }
        if (
            product?.bulk &&
            product?.sell_in_containers &&
            !selectedBulkPolicy
        ) {
            toast.warning("Choose one bulk policy please", {
                className: "fs-14",
            });
            return false;
        }

        let isAvailable;

        if (selectedVariation) {
            let smallestStock = null;
            let nameList = [];

            for (const [id, data] of Object.entries(selectedVariation)) {
                if (smallestStock === null || data?.in_stock < smallestStock) {
                    smallestStock = data?.in_stock;
                }
                nameList.push(data?.name);
            }
            const foundQuantityTable = product?.variation_quantities.find(
                (variation_quantity) =>
                    nameList.every((name) =>
                        variation_quantity.variations.includes(name)
                    )
            );

            if (foundQuantityTable) {
                const availableUnits = product?.sell_in_containers
                    ? foundQuantityTable.in_stock /
                      selectedBulkPolicy.minimum_quantity
                    : foundQuantityTable.in_stock;

                isAvailable = product.limited_stock
                    ? availableUnits >= 1 && availableUnits >= amountValue
                    : true;
            } else {
                const availableUnits = product?.sell_in_containers
                    ? product.in_stock / selectedBulkPolicy.minimum_quantity
                    : product.in_stock;

                isAvailable = product.limited_stock
                    ? availableUnits >= 1 && availableUnits >= amountValue
                    : true;
            }
        } else {
            const availableUnits = product?.sell_in_containers
                ? product.in_stock / selectedBulkPolicy.minimum_quantity
                : product.in_stock;

            isAvailable = product.limited_stock
                ? availableUnits >= 1 && availableUnits >= amountValue
                : true;
        }

        console.log("IS AVAILABLE", isAvailable);
        if (!isAvailable) {
            toast.warning("Sorry, this product is out of stock.", {
                className: "fs-14",
            });
        } else if (!chosenShipRate) {
            toast.warning("Please choose shipping.", {
                className: "fs-14",
            });
            // console.log(chosenShipRate);
        } else if (
            product?.variation_categories.length > 0 &&
            selectedVariation &&
            Object.keys(selectedVariation).length ===
                product?.variation_categories.length
        ) {
            dispatch(
                addToCart({
                    product,
                    selectedVariations: selectedVariation,
                    quantity: amountValue,
                    totalPrice: handlePriceAmount(),
                    shipping: chosenShipRate,
                    is_active: is_active,
                    chosenAddress,
                    tax_rate,
                    selectedBulkPolicy,
                })
            );

            return true;
            // toast.success("Added to cart!", { className: "fs-14" });
        } else if (product?.variation_categories.length === 0) {
            dispatch(
                addToCart({
                    product,
                    selectedVariations: selectedVariation,
                    quantity: amountValue,
                    totalPrice: handlePriceAmount(),
                    shipping: chosenShipRate,
                    is_active: is_active,
                    chosenAddress,
                    tax_rate,
                    selectedBulkPolicy,
                })
            );

            return true;
            // toast.success("Added to cart!", { className: "fs-14" });
        } else {
            toast.warning("Please choose all available variations.", {
                className: "fs-14",
            });
        }
    } else {
        toast.warning("Sorry product is not in stock.", {
            className: "fs-14",
        });
    }
};

export const getProductShippingPrice = (
    product,
    chosenAddress,
    setShippingOption,
    setChosenShipRate,
    setIsForbiddenCountry,
    amountValue
) => {
    if (
        Array.isArray(product?.shipping_options) &&
        product?.shipping_options?.length > 0 &&
        chosenAddress
    ) {
        let countryCode = chosenAddress?.countryCode;
        if (!countryCode) {
            const countryObj = countries.find(
                (country) => country.name === chosenAddress?.country
            );
            countryCode = countryObj?.code;
        }
        let foundShippingOption = product.shipping_options.find((option) =>
            option?.countries
                ?.split(",")
                .map((code) => code.trim())
                .includes(countryCode)
        );

        switch (foundShippingOption?.shipping_type) {
            case "FIXED":
                setShippingOption({
                    visual: (
                        <span>
                            Fixed shipping{" "}
                            <span className="text-main fw-bold">
                                ${foundShippingOption.price}
                            </span>
                        </span>
                    ),
                    name: "Fixed",
                    deliveryDate: `${foundShippingOption?.delivery_days_min} - ${foundShippingOption?.delivery_days_max} days`,
                    price: foundShippingOption?.price,
                });
                setChosenShipRate({
                    type: "FIXED",
                    price: foundShippingOption?.price,
                    min_delivery_time: foundShippingOption?.delivery_days_min,
                    max_delivery_time: foundShippingOption?.delivery_days_max,
                });
                setIsForbiddenCountry(false);
                break;
            case "FREE":
                console.log("FREE SHIPPING");
                setShippingOption({
                    visual: (
                        <span className="text-main  fw-bold">
                            Free delivery
                        </span>
                    ),
                    name: "Free",
                    deliveryDate: `${foundShippingOption?.delivery_days_min} - ${foundShippingOption?.delivery_days_max} days`,
                });
                setChosenShipRate({
                    type: "FREE",
                    price: 0,
                    min_delivery_time: foundShippingOption?.delivery_days_min,
                    max_delivery_time: foundShippingOption?.delivery_days_max,
                });
                setIsForbiddenCountry(false);

                break;

            case "BASED_ON_ZIP":
                setShippingOption({
                    visual: (
                        <span className="text-main  fw-bold">Based on zip</span>
                    ),
                    name: "Based on zip",
                });
                setChosenShipRate(null);
                setIsForbiddenCountry(false);

                break;
            default:
                setShippingOption({
                    visual: (
                        <span className="fs-13 fw-bold">
                            No shipping to your country
                        </span>
                    ),
                    name: "NoShip",
                });
                setChosenShipRate({
                    type: "FORBIDDEN",
                    price: 0,
                    min_delivery_time: 0,
                    max_delivery_time: 0,
                });
                setIsForbiddenCountry(true);
                break;
        }
    } else {
        setShippingOption(null);
        setIsForbiddenCountry(true);
        setChosenShipRate({
            type: "FORBIDDEN",
            price: 0,
            min_delivery_time: 0,
            max_delivery_time: 0,
        });
    }
};

export const fetchProductShipRates = (
    product,
    chosenAddress,
    user,
    selectedBulkPolicy,
    amountValue,
    dispatch,
    setShipRates
) => {
    const hsCode = product?.category_hierarchy.find(
        (hierachy) => hierachy.id === product.category
    )?.hs_code;
    const data = {
        destination_address: {
            country_alpha2: countries.find(
                (country) => country.name === chosenAddress?.country
            )?.code,
            line_1: chosenAddress?.address_line1,
            line_2: chosenAddress?.address_line2?.trim()
                ? chosenAddress?.address_line2
                : null,
            state: chosenAddress?.state,
            city: chosenAddress?.city,
            postal_code: chosenAddress?.zip_code,
            company_name: null,
            contact_name: chosenAddress?.firstName
                ? chosenAddress?.firstName
                : user?.first_name,
            contact_phone: chosenAddress?.phoneNumber
                ? chosenAddress?.phoneNumber
                : user?.seller_profile?.phone_number,
            contact_email: user ? user?.email : "asd@asd.com",
        },
        origin_address: {
            line_1: product?.shipping_address?.address_line1,
            line_2: product?.shipping_address?.address_line2,
            state: product?.shipping_address?.state,
            city: product?.shipping_address?.city,
            postal_code: product?.shipping_address?.zip_code,
            company_name: null,
            contact_name: product?.seller?.store_name,
            contact_phone: product?.seller?.phone_number,
            contact_email: "asd@asd.com",
        },
        incoterms: "DDP",
        insurance: { is_insured: false },
        courier_selection: {
            show_courier_logo_url: true,
            apply_shipping_rules: true,
        },
        shipping_settings: {
            units: {
                weight: product?.sell_in_containers
                    ? "kg"
                    : product?.weight_unit,
                dimensions: product?.sell_in_containers
                    ? "m"
                    : product?.dimensions_unit,
            },
        },
        parcels: [
            {
                box: {
                    length: product?.sell_in_containers
                        ? selectedBulkPolicy?.container_length
                        : product?.box_length,
                    width: product?.sell_in_containers
                        ? selectedBulkPolicy?.container_width
                        : product?.box_width,
                    height: product?.sell_in_containers
                        ? selectedBulkPolicy?.container_height
                        : product?.box_height,
                },
                total_actual_weight: product?.sell_in_containers
                    ? selectedBulkPolicy?.container_weight
                    : product?.box_weight,

                items: [
                    {
                        quantity: 1,

                        // dimensions: {
                        //     length: product?.item_length,
                        //     width: product?.item_width,
                        //     height: product?.item_height,
                        // },
                        description: product?.name,
                        sku: `${product?.id}`,
                        hs_code: hsCode,
                        // actual_weight: product?.item_weight,
                        declared_currency: "USD",
                        declared_customs_value: selectedBulkPolicy
                            ? selectedBulkPolicy?.price
                            : product?.min_price,
                    },
                ],
            },
        ],
    };
    dispatch(fetchShippingRates(JSON.stringify(data))).then((res) => {
        if (res?.status === 200) {
            const updatedRates = res.data.rates.map((rate) => ({
                ...rate,
                initialTotalCharge: rate.total_charge,
                total_charge: rate.total_charge * amountValue,
            }));
            setShipRates(updatedRates);
        } else {
            setShipRates([]);
        }
        return res;
    });
};

export const getProductShippingType = (product, chosenAddress) => {
    if (
        Array.isArray(product?.shipping_options) &&
        product?.shipping_options?.length > 0 &&
        chosenAddress
    ) {
        let countryCode = chosenAddress?.countryCode;
        if (!countryCode) {
            const countryObj = countries.find(
                (country) => country.name === chosenAddress?.country
            );
            countryCode = countryObj?.code;
        }
        let foundShippingOption = product.shipping_options.find((option) =>
            option?.countries
                ?.split(",")
                .map((code) => code.trim())
                .includes(countryCode)
        );

        switch (foundShippingOption?.shipping_type) {
            case "FIXED":
                return "FIXED";
            case "FREE":
                return "FREE";

            case "BASED_ON_ZIP":
                return "BASED_ON_ZIP";
            case "CONTACT_SUPPORT":
                return "CONTACT_SUPPORT";
            default:
                return "FORBIDDEN";
        }
    } else {
        return "FORBIDDEN";
    }
};

export const findPathToSelectedId = (data, selectedId) => {
    function findPath(nodes, path = []) {
        for (const node of nodes) {
            if (node.id === parseInt(selectedId)) {
                path.push(node);
                return path;
            }

            if (node.childrens) {
                const result = findPath(node.childrens, [...path, node]);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    return findPath(data);
};

export const getContainerDimensions = (product, selectedBulkPolicy) => {
    let maxLength;
    let max_length_in_meters;
    let box_weight_in_kg;

    if (product?.sell_in_containers) {
        maxLength = Math.max(
            selectedBulkPolicy?.container_height,
            selectedBulkPolicy?.container_width,
            selectedBulkPolicy?.container_length
        );

        max_length_in_meters = convertToMeters(maxLength, "m");

        box_weight_in_kg = convertToKilograms(
            selectedBulkPolicy?.container_weight,
            "kg"
        );
    } else {
        maxLength = Math.max(
            product.box_length,
            product.box_width,
            product.box_height
        );

        max_length_in_meters = convertToMeters(
            maxLength,
            product?.dimensions_unit
        );

        box_weight_in_kg = convertToKilograms(
            product.box_weight,
            product.weight_unit
        );
    }

    return {
        maxLength,
        max_length_in_meters,
        box_weight_in_kg,
    };
};
