import { addToCart, removeFromCart } from "@/redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    IconChevronDown,
    IconHeart,
    IconHeartFilled,
    IconMinus,
    IconPlus,
    IconRefresh,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    convertToKilograms,
    convertToMeters,
    parseAndFormatDecimal,
} from "@/redux/utils/opts";
import {
    addToWishlist,
    removeFromWishlistItem,
} from "@/redux/features/wishlistSlice";
import { selectWishItems } from "@/redux/selectors/wish";
import {
    fetchProductShipRates,
    getContainerDimensions,
    getProductShippingPrice,
    getProductShippingType,
    productGlobalAmountChange,
    addProductToCartGlobalFn,
} from "@/redux/utils/product";
import countries from "../utils/countries";
import { fetchShippingOptions } from "@/redux/actions/shopActions";
import MobileCartItem from "./MobileCartItem";
import _ from "lodash"; // Import lodash for deep equality check
import { useTranslations } from "next-intl";

const mapState = (state) => ({
    wishItems: selectWishItems(state),
    chosenAddress: state.addressBook.chosenAddress,
    user: state.auth.user,
});

function CartItem({ item, handleItemSelect, index, isChild }) {
    const t = useTranslations("CartItem");
    const alltrans = useTranslations();

    // GLOBAL
    const dispatch = useAppDispatch();
    const { product } = item;
    // QUANTITY AND PRICE
    const [amountValue, setAmountValue] = useState(parseInt(item?.quantity));
    const [amountChangedSignal, setAmountChangedSignal] = useState(null);
    const [priceAmount, setPriceAmount] = useState(1);

    // SHIPPING
    const [startFetchingShipRates, setStartFetchingShipRates] = useState(false);
    const [chosenShipRate, setChosenShipRate] = useState(null);
    // const [refreshedRates, setRefreshedRates] = useState(false);

    const handleAmountChange = (sign, quantity) => {
        const { product, selectedVariations: selectedVariation } = item;

        productGlobalAmountChange(
            sign,
            quantity,
            amountValue,
            setAmountValue,
            product,
            selectedVariation,
            () => {},
            item?.selectedBulkPolicy
        );
        setAmountChangedSignal(Math.random());
    };

    const getBulkPolicy = () => {
        const sortedBulks = [...(item?.product?.bulks || [])] // Create a new array
            .sort((a, b) => b.minimum_quantity - a.minimum_quantity);
        // console.log("SORTED BULKS", sortedBulks);
        for (const bulk of sortedBulks) {
            if (amountValue >= bulk.minimum_quantity) {
                // console.log("FOUND BULK", bulk);
                return bulk;
            }
        }
        return null;
    };

    const handlePriceAmount = () => {
        let priceValue;
        if (item?.product?.bulk) {
            if (item?.product?.sell_in_containers) {
                if (item?.selectedBulkPolicy) {
                    priceValue =
                        parseAndFormatDecimal(item?.selectedBulkPolicy.price) *
                        amountValue;
                } else {
                    priceValue =
                        parseAndFormatDecimal(item?.product.min_price) *
                        amountValue;
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
            priceValue =
                parseAndFormatDecimal(item?.product.min_price) * amountValue;
        }
        priceValue = parseAndFormatDecimal(priceValue);
        setPriceAmount(priceValue);
        return priceValue;
    };

    const handleAddToCart = (is_active = true) => {
        const {
            product,
            selectedVariations: selectedVariation,
            quantity,
            shipping,
            tax_rate,
            selectedBulkPolicy,
        } = item;

        // console.log("HANDLE ADD TO CART chosenShipRate", chosenShipRate);
        // console.log("HANDLE ADD TO CART is active", is_active);

        addProductToCartGlobalFn(
            product,
            selectedVariation,
            chosenShipRate ? chosenShipRate : shipping,
            dispatch,
            addToCart,
            amountValue,
            handlePriceAmount,
            is_active,
            chosenAddress,
            tax_rate,
            selectedBulkPolicy
        );

        setStartFetchingShipRates(false);
    };

    useEffect(() => {
        if (amountValue && amountChangedSignal) {
            handleAddToCart(false);
        }
        handlePriceAmount();
    }, [amountValue, amountChangedSignal]);

    useEffect(() => {
        if (item) {
            setAmountValue(parseInt(item?.quantity));
        }
    }, [item]);

    const [alreadyInWishlist, setAlreadyInWishlist] = useState(false);
    const { wishItems, chosenAddress, user } = useAppSelector(mapState);
    const handleAddToWishlist = () => {
        if (item?.product) {
            dispatch(addToWishlist(item?.product));
            // toast.success("Added to wishlist!", { className: "fs-14" });
        }
    };

    const handleRemoveFromWishlist = () => {
        if (item?.product) {
            dispatch(removeFromWishlistItem(item?.product));
            // toast.warning("Removed from wishlist!", { className: "fs-14" });
        }
    };

    useEffect(() => {
        const existingItem = wishItems.find(
            (wishItem) => wishItem?.id === item?.product?.id
        );
        if (existingItem) {
            setAlreadyInWishlist(true);
        } else {
            setAlreadyInWishlist(false);
        }
    }, [wishItems]);

    const [availableShippingOptions, setAvailableShippingOptions] = useState(
        []
    );
    const [isLoadingShipRates, setIsLoadingShipRates] = useState(false);

    const getWhichShippingIsIt = () => {
        setIsLoadingShipRates(true);

        const destinationCountry = countries.find(
            (country) => country.name === chosenAddress?.country
        )?.code;
        const originCountry = countries.find(
            (country) => country.name === product?.shipping_address?.country
        )?.code;

        if (
            destinationCountry === "US" &&
            originCountry === "US" &&
            !product.bulk
        ) {
            const res = fetchProductShipRates(
                product,
                chosenAddress,
                user,
                { price: item.totalPrice },
                amountValue,
                dispatch,
                setAvailableShippingOptions
            );
            console.log(res);
            setIsLoadingShipRates(false);
        } else {
            const { maxLength, max_length_in_meters, box_weight_in_kg } =
                getContainerDimensions(product, item?.selectedBulkPolicy);

            const config = `?origin_countries=${originCountry}&delivery_countries=${destinationCountry}&max_dimension=${max_length_in_meters}&max_weight=${box_weight_in_kg}`;

            dispatch(fetchShippingOptions(config)).then((res) => {
                const updatedShippingOptions = res?.data.map((option) => {
                    const chargePerProduct =
                        option.price_for_dimension *
                            (max_length_in_meters >= 1
                                ? max_length_in_meters
                                : 1) +
                        option.price_for_weight *
                            (box_weight_in_kg >= 1 ? box_weight_in_kg : 1);
                    const totalCharge = chargePerProduct * amountValue;

                    return {
                        ...option,
                        courier_name: option.name,
                        total_charge: totalCharge,
                        courier_logo_url: "/logo3.jpg",
                    };
                });
                setAvailableShippingOptions(updatedShippingOptions);
                setIsLoadingShipRates(false);
            });
        }
        setChosenShipRate(null);
    };

    useEffect(() => {
        if (startFetchingShipRates && product) {
            setAvailableShippingOptions([]);
            getWhichShippingIsIt();
        } else {
            setIsLoadingShipRates(false);
        }
    }, [startFetchingShipRates, chosenAddress, product]);

    const checkProductOnAddress = () => {
        if (!_.isEqual(chosenAddress, item.chosenAddress)) {
            handleAddToCart(false);
        }
    };

    useEffect(() => {
        checkProductOnAddress();
    }, [item, chosenAddress]);

    useEffect(() => {
        if (
            startFetchingShipRates &&
            product &&
            amountValue > 0 &&
            availableShippingOptions.length > 0
        ) {
            recalculateShippingPrices();
        } else {
            setAvailableShippingOptions([]);
            setIsLoadingShipRates(false);
            setChosenShipRate(null);
        }
    }, [startFetchingShipRates, amountValue, product]);

    const recalculateShippingPrices = () => {
        setIsLoadingShipRates(true);
        setChosenShipRate(null);
        let localOptions = availableShippingOptions;
        setAvailableShippingOptions([]);
        const destinationCountry = countries.find(
            (country) => country.name === chosenAddress?.country
        )?.code;
        const originCountry = countries.find(
            (country) => country.name === product?.shipping_address?.country
        )?.code;

        if (
            destinationCountry === "US" &&
            originCountry === "US" &&
            !product.bulk
        ) {
            const updatedRates = localOptions.map((rate) => ({
                ...rate,
                total_charge: rate.initialTotalCharge * amountValue,
            }));
            setAvailableShippingOptions(updatedRates);
        } else {
            const updatedShippingOptions = localOptions.map((option) => {
                const { maxLength, max_length_in_meters, box_weight_in_kg } =
                    getContainerDimensions(product, item?.selectedBulkPolicy);

                const chargePerProduct =
                    option.price_for_dimension *
                        (max_length_in_meters >= 1 ? max_length_in_meters : 1) +
                    option.price_for_weight *
                        (box_weight_in_kg >= 1 ? box_weight_in_kg : 1);
                const totalCharge = chargePerProduct * amountValue;

                return {
                    ...option,
                    courier_name: option.name,
                    total_charge: totalCharge,
                    courier_logo_url: "/logo3.jpg",
                };
            });

            setAvailableShippingOptions(updatedShippingOptions);
        }
        setIsLoadingShipRates(false);
    };

    useEffect(() => {
        if (amountValue && amountValue === 0) {
            dispatch(removeFromCart([item]));
        }
    }, [amountValue]);

    return (
        <>
            <div
                className={`d-none d-md-flex row fs-14 align-items-center py-3 `}
                // style={!item?.is_active ? { opacity: 0.5 } : undefined}
            >
                <div className="col-auto">
                    <input
                        className="form-check-input customcheckbox fs-6 rounded-small border-main"
                        type="checkbox"
                        role="button"
                        checked={item.selected || false}
                        id="flexCheckDefault"
                        onChange={(e) =>
                            handleItemSelect(index, e.target.checked)
                        }
                    />
                </div>
                <Link
                    href={`/products/${item?.product?.slug}/${item?.product?.id}/`}
                    className="col-5 col-md-2"
                >
                    <img
                        src={item?.product?.image}
                        alt=""
                        className="img-fluid"
                        // className={`${isChild ? "d-none" : "img-fluid"}`}
                    />
                </Link>
                <div className="col">
                    <Link
                        className="fw-medium"
                        href={`/products/${item?.product?.slug}/${item?.product?.id}/`}
                    >
                        {item?.product?.name}
                    </Link>
                    <div className="text-muted fs-13">
                        {item?.selectedVariations &&
                            Object.entries(item.selectedVariations).length >
                                0 &&
                            Object.entries(item.selectedVariations)
                                .map(([key, variation]) => variation.name)
                                .join(" / ")}
                    </div>

                    <div className="text-muted fs-13">
                        {item?.product?.sell_in_containers && (
                            <div>
                                <div>
                                    {alltrans("Containername")}:{" "}
                                    {item?.selectedBulkPolicy?.container_name}
                                </div>
                                <div>{alltrans("Containerdimensions")}:</div>
                                <ul>
                                    <li>
                                        {alltrans("Listings.length")}:{" "}
                                        {
                                            item?.selectedBulkPolicy
                                                ?.container_length
                                        }{" "}
                                        {alltrans("meters")}
                                    </li>
                                    <li>
                                        {alltrans("Listings.width")}:{" "}
                                        {
                                            item?.selectedBulkPolicy
                                                ?.container_width
                                        }{" "}
                                        {alltrans("meters")}
                                    </li>
                                    <li>
                                        {alltrans("Listings.height")}:{" "}
                                        {
                                            item?.selectedBulkPolicy
                                                ?.container_height
                                        }{" "}
                                        {alltrans("meters")}
                                    </li>
                                </ul>
                                <div>
                                    {alltrans("Listings.weight")}:{" "}
                                    {item?.selectedBulkPolicy?.container_weight}{" "}
                                    {alltrans("kilograms")}
                                </div>
                            </div>
                        )}
                    </div>
                    {!item?.is_active && (
                        <div className="d-flex align-items-center gap-2 fs-14 mt-2 ">
                            <IconX size={18} className="text-danger" />
                            {t("notActive")}
                        </div>
                    )}
                    <div className="mt-3 ">
                        {!isChild &&
                            (alreadyInWishlist ? (
                                <button
                                    onClick={() => handleRemoveFromWishlist()}
                                    className="btn btn-main px-2 py-0 border-0 text-white me-2"
                                >
                                    <IconHeartFilled size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleAddToWishlist()}
                                    className="btn btn-gray px-2 py-0 border-0 me-2"
                                >
                                    <IconHeart size={18} />
                                </button>
                            ))}
                        <button
                            onClick={() => dispatch(removeFromCart([item]))}
                            className="btn btn-gray px-2 py-0 border-0 me-2"
                        >
                            <IconTrash size={18} />
                        </button>
                        {!item?.is_active &&
                            startFetchingShipRates &&
                            chosenShipRate && (
                                <button
                                    onClick={() => handleAddToCart(true)}
                                    className="btn btn-gray px-2  border-0 fw-medium fs-14 py-1"
                                >
                                    {t("save")}
                                </button>
                            )}
                        {!item?.is_active &&
                            (!isLoadingShipRates ? (
                                startFetchingShipRates ? (
                                    <div>
                                        <div className="mt-2 border border-black p-2 rounded-small dropdown user-select-none fs-13">
                                            <div
                                                className="fw-medium d-inline-flex  w-100 align-items-center gap-2"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                data-bs-auto-close="false"
                                                role="button"
                                            >
                                                {chosenShipRate ? (
                                                    chosenShipRate?.courier_name ? (
                                                        <span className="d-flex justify-content-between w-100">
                                                            <span>
                                                                {
                                                                    chosenShipRate.courier_name
                                                                }
                                                            </span>
                                                            <span className="fw-bold">
                                                                $
                                                                {parseAndFormatDecimal(
                                                                    chosenShipRate.total_charge
                                                                )}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <>
                                                            {t(
                                                                "contactSupport"
                                                            )}
                                                        </>
                                                    )
                                                ) : (
                                                    <>
                                                        {t("chooseShipping")}
                                                        <IconChevronDown
                                                            size={18}
                                                        />
                                                    </>
                                                )}
                                            </div>

                                            <ul
                                                class="dropdown-menu main-drop fs-13 user-select-none rounded-small mt-2"
                                                style={{
                                                    minWidth: "350px",
                                                }}
                                            >
                                                {Array.isArray(
                                                    availableShippingOptions
                                                ) &&
                                                availableShippingOptions.length >
                                                    0 ? (
                                                    availableShippingOptions.map(
                                                        (rate) => (
                                                            <li
                                                                key={rate.id}
                                                                onClick={() =>
                                                                    setChosenShipRate(
                                                                        rate
                                                                    )
                                                                }
                                                                role="button"
                                                                class={`dropdown-item border-bottom pt-3`}
                                                            >
                                                                <div
                                                                    class="form-check"
                                                                    role="button"
                                                                >
                                                                    <input
                                                                        class="form-check-input customradio"
                                                                        type="radio"
                                                                        name="shipRates"
                                                                        id={
                                                                            rate?.courier_name
                                                                        }
                                                                        checked={
                                                                            chosenShipRate &&
                                                                            chosenShipRate?.courier_name ===
                                                                                rate?.courier_name
                                                                        }
                                                                    />
                                                                    <label
                                                                        class="form-check-label  w-100"
                                                                        for={
                                                                            rate?.courier_name
                                                                        }
                                                                        role="button"
                                                                    >
                                                                        <div className="d-flex gap-2">
                                                                            <img
                                                                                src={
                                                                                    rate?.courier_logo_url
                                                                                }
                                                                                style={{
                                                                                    maxHeight:
                                                                                        "15px",
                                                                                }}
                                                                                alt=""
                                                                            />
                                                                            <span className="fw-medium">
                                                                                {
                                                                                    rate.courier_name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="pt-1 border-top my-1">
                                                                            {rate?.cost_rank ===
                                                                                1.0 && (
                                                                                <span className="fs-13 text-main fw-bold me-2">
                                                                                    {t(
                                                                                        "cheapest"
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                            {rate?.delivery_time_rank ===
                                                                                1.0 && (
                                                                                <span className="fs-13 text-main fw-bold">
                                                                                    {t(
                                                                                        "fastest"
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="d-flex justify-content-between">
                                                                            <div className="fw-medium">
                                                                                {
                                                                                    rate?.min_delivery_time
                                                                                }{" "}
                                                                                -{" "}
                                                                                {
                                                                                    rate?.max_delivery_time
                                                                                }{" "}
                                                                                {t(
                                                                                    "days"
                                                                                )}
                                                                            </div>
                                                                            <div className="fw-bold">
                                                                                $
                                                                                {parseAndFormatDecimal(
                                                                                    rate?.total_charge
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            </li>
                                                        )
                                                    )
                                                ) : (
                                                    <>
                                                        <div
                                                            role="button"
                                                            class={` px-3 py-2 fw-medium`}
                                                        >
                                                            {t("noShipping")}
                                                            {/* Request for customer support */}
                                                        </div>
                                                    </>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        role="button"
                                        onClick={() =>
                                            setStartFetchingShipRates(true)
                                        }
                                        className="mt-2 border border-black text-center p-2 rounded-small dropdown user-select-none fs-12"
                                    >
                                        {t("chooseShipping")}
                                    </div>
                                )
                            ) : (
                                <div
                                    role="button"
                                    className={` px-3 py-2 fw-medium fs-15 d-flex justify-content-center`}
                                >
                                    <div
                                        className="spinner-border text-secondary text-center "
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            {t("loading")}
                                        </span>
                                    </div>
                                    {/* Request for customer support */}
                                </div>
                            ))}
                    </div>
                </div>
                <div className="col-6 mt-3 mt-md-0 col-md-2">
                    <div className="fw-medium">{priceAmount}$</div>
                    <div className="text-muted fs-13">
                        + ${parseAndFormatDecimal(item?.shipping?.total_charge)}{" "}
                        {t("ship")}
                    </div>
                    {item?.tax_rate && item?.tax_rate > 0 ? (
                        <div className="text-muted fs-13">
                            + ${(item?.tax_rate * priceAmount) / 100} {t("tax")}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className="col-6 col-md-2 d-flex align-items-center gap-1">
                    <button
                        className="btn btn-gray px-2 py-0 border-0"
                        onClick={() => handleAmountChange("minus")}
                    >
                        <IconMinus size={18} />
                    </button>
                    <div>
                        <input
                            type="text"
                            className="text-center"
                            style={{ maxWidth: "40px" }}
                            value={amountValue}
                        />
                    </div>
                    <button
                        className="btn btn-gray px-2 py-0 border-0"
                        onClick={() => handleAmountChange("plus")}
                    >
                        <IconPlus size={18} />
                    </button>
                </div>
            </div>

            <MobileCartItem
                index={index}
                item={item}
                handleItemSelect={handleItemSelect}
                isChild={isChild}
                alreadyInWishlist={alreadyInWishlist}
                handleAddToWishlist={handleAddToWishlist}
                handleRemoveFromWishlist={handleRemoveFromWishlist}
                handleAmountChange={handleAmountChange}
                dispatch={dispatch}
                removeFromCart={removeFromCart}
                amountValue={amountValue}
                priceAmount={priceAmount}
                startFetchingShipRates={startFetchingShipRates}
                chosenShipRate={chosenShipRate}
                availableShippingOptions={availableShippingOptions}
                setStartFetchingShipRates={setStartFetchingShipRates}
                setChosenShipRate={setChosenShipRate}
                handleAddToCart={handleAddToCart}
            />
        </>
    );
}

export default CartItem;
