"use client";
import {
    IconChevronDown,
    IconChevronRight,
    IconHeartMinus,
    IconHeartPlus,
    IconMessage,
    IconMinus,
    IconPlus,
    IconRefresh,
    IconShare2,
    IconStar,
    IconStarFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import ProductDetailSliderV2 from "@/components/ProductDetailSliderV2/ProductDetailSliderV2";
import "./styles.css";
import { IconUser } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    fetchProduct,
    fetchProductReviews,
    fetchProductReviewsAnalytics,
    fetchShippingOptions,
    fetchShippingRates,
} from "@/redux/actions/shopActions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { addToCart } from "@/redux/features/cartSlice";
import { selectCartItems } from "@/redux/selectors/cart";
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
import countries from "@/components/utils/countries";
import debounce from "lodash.debounce";
import {
    fetchProductShipRates,
    getContainerDimensions,
    getProductBulkPolicy,
    getProductPriceAmount,
    getProductShippingPrice,
    getProductStars,
    moveCursorToEnd,
    productGlobalAmountChange,
    addProductToCartGlobalFn,
} from "@/redux/utils/product";
import RecommendedProductSlider from "@/components/RecommendedProductSlider/RecommendedProductSlider";
import SimilarItems from "@/components/Products/SimilarItems";
import BoughtTogether from "@/components/Products/BougthTogether";
import ProductReviewList from "@/components/Products/ProductReviewList";
import { useTranslations } from "next-intl";
import ReactPlayer from "react-player";

const mapState = (state) => ({
    cartItems: selectCartItems(state),
    wishItems: selectWishItems(state),
    chosenAddress: state.addressBook.chosenAddress,
    user: state.auth.user,
});

function ProductDetail({ params }) {
    // GET INITIAL PRODUCT
    const { slug, id } = params;
    const [product, setProduct] = useState(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        if (id) {
            dispatch(fetchProduct(id)).then((result) => {
                setProduct(result.data);
            });
        }
    }, [id]);
    const t = useTranslations("ProductDetail");
    const catlist = useTranslations("CategoriesList");
    const alltrans = useTranslations("");
    const getcountrytrans = useTranslations("Countries");
    // STARS
    const { filledStarIcons, emptyStarIcons } = getProductStars(product);
    const {
        filledStarIcons: bigFilledStarIcons,
        emptyStarIcons: bigEmptyStarIcons,
    } = getProductStars(product, 24);

    // VARIATIONS
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [mainImage, setMainImage] = useState(null);

    // BUlK and amount
    const [amountValue, setAmountValue] = useState(0);
    const spanRef = useRef(null);
    const [selectedBulkPolicy, setSelectedBulkPolicy] = useState(null);
    const [maximumVariationAmount, setMaximumVariationAmount] = useState(null);

    // DEFAULT VALUES
    useEffect(() => {
        if (product && product?.files[0]?.file) {
            setMainImage(product?.files[0]);
        } else {
            setMainImage(null);
        }

        if (product) {
            if (!product?.sell_in_containers) {
                let isAvailable = false;
                if (selectedVariation) {
                    isAvailable = product.limited_stock
                        ? selectedVariation.in_stock > 0
                        : true;
                } else {
                    isAvailable = product.limited_stock
                        ? product.in_stock > 0
                        : true;
                }

                if (!isAvailable) {
                    setAmountValue(0);
                } else {
                    if (product?.bulk && product.limited_stock) {
                        const bulkpolicy = getProductBulkPolicy(
                            product,
                            product.in_stock
                        );
                        if (bulkpolicy) {
                            setAmountValue(
                                product.min_order_quantity
                                    ? product.min_order_quantity
                                    : 1
                            );
                        } else {
                            setAmountValue(0);
                        }
                    } else {
                        setAmountValue(
                            product.min_order_quantity
                                ? product.min_order_quantity
                                : 1
                        );
                    }
                }
            } else {
                let isAvailable = false;
                if (product?.limited_stock) {
                    if (selectedBulkPolicy) {
                        if (selectedVariation) {
                            isAvailable =
                                selectedVariation.in_stock /
                                    selectedBulkPolicy.minimum_quantity >=
                                1;
                        } else {
                            isAvailable =
                                product.in_stock /
                                    selectedBulkPolicy.minimum_quantity >=
                                1;
                        }
                    }
                } else {
                    isAvailable = true;
                }

                if (!isAvailable) {
                    setAmountValue(0);
                } else {
                    setAmountValue(1);
                }
            }
        }
    }, [product]);

    // DONT WRITE IN PRODUCT AMOUNT
    const handleInput = (e) => {
        e.preventDefault();
        e.target.textContent = amountValue;
    };

    // PRODUCT QUANTITY CHANGE
    const handleAmountChange = (sign, quantity) => {
        productGlobalAmountChange(
            sign,
            quantity,
            amountValue,
            setAmountValue,
            product,
            selectedVariation,
            setMaximumVariationAmount,
            selectedBulkPolicy
        );
    };

    // GET BULK POLICY
    const getBulkPolicy = () => {
        return getProductBulkPolicy(product, amountValue);
    };
    const [changedBulkPolicy, setChangedBulkPolicy] = useState(null);
    const handleSelectBulkPolicy = (policy) => {
        setSelectedBulkPolicy(policy);
        setChangedBulkPolicy(Math.random());
    };
    useEffect(() => {
        if (changedBulkPolicy) {
            getWhichShippingIsIt();
            setChangedBulkPolicy(null);
        }
    }, [changedBulkPolicy]);

    // CHANGES WHEN AMOUNT CHANGES
    useEffect(() => {
        // spanRef.current.focus();
        // moveCursorToEnd(spanRef.current);

        if (product) {
            if (product.sell_in_containers && product.bulk) {
                if (!selectedBulkPolicy) {
                    setSelectedBulkPolicy(product?.bulks[0]);
                }
            } else {
                const bulkpolicy = getBulkPolicy();
                if (bulkpolicy) {
                    setSelectedBulkPolicy(getBulkPolicy(bulkpolicy));
                } else {
                    setSelectedBulkPolicy(null);
                }
            }
        }
    }, [amountValue]);

    // PRICE CHANGE
    useEffect(() => {
        if (
            selectedVariation &&
            Object.keys(selectedVariation).length ===
                product?.variation_categories.length
        ) {
            handleAmountChange("ddd", amountValue);
        }
    }, [selectedVariation]);

    const handlePriceAmount = () => {
        return getProductPriceAmount(
            product,
            getBulkPolicy,
            amountValue,
            selectedBulkPolicy
        );
    };

    // CART ITEMS AND WISHLIST START

    const handleAddToCart = () => {
        let response = addProductToCartGlobalFn(
            product,
            selectedVariation,
            chosenShipRate,
            dispatch,
            addToCart,
            amountValue,
            handlePriceAmount,
            true,
            chosenAddress,
            null,
            selectedBulkPolicy
        );
        if (response) {
            toast.success(t("addedToCart"), { className: "fs-14 mx-2 mt-1" });
        }
    };
    const { cartItems, wishItems, chosenAddress, user } =
        useAppSelector(mapState);
    const [alreadyInCart, setAlreadyInCart] = useState([]);
    const [alreadyInWishlist, setAlreadyInWishlist] = useState(false);

    const findAllThisProductInCartItems = () => {
        const items = cartItems.filter(
            (item) => item.product?.id === product?.id
        );
        setAlreadyInCart(items);
    };

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            findAllThisProductInCartItems();
        }
    }, [cartItems, product]);

    const handleAddToWishlist = () => {
        if (product) {
            dispatch(addToWishlist(product));
        }
    };

    const handleRemoveFromWishlist = () => {
        if (product) {
            dispatch(removeFromWishlistItem(product));
        }
    };

    useEffect(() => {
        const existingItem = wishItems.find((item) => item?.id === product?.id);
        if (existingItem) {
            setAlreadyInWishlist(true);
        } else {
            setAlreadyInWishlist(false);
        }
    }, [wishItems, product]);

    // ENDS

    const [chosenShipRate, setChosenShipRate] = useState(null);

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
            let res = fetchProductShipRates(
                product,
                chosenAddress,
                user,
                selectedBulkPolicy,
                amountValue,
                dispatch,
                setAvailableShippingOptions
            );
            // console.log("RES", res);
            setIsLoadingShipRates(false);
        } else {
            const { maxLength, max_length_in_meters, box_weight_in_kg } =
                getContainerDimensions(product, selectedBulkPolicy);

            const config = `?origin_countries=${originCountry}&delivery_countries=${destinationCountry}&max_dimension=${max_length_in_meters}&max_weight=${box_weight_in_kg}`;

            console.log("SELECTED BUK POLICY", selectedBulkPolicy);

            dispatch(fetchShippingOptions(config)).then((res) => {
                const updatedShippingOptions = res?.data.map((option) => {
                    const chargePerProduct =
                        option.price_for_dimension *
                            (max_length_in_meters >= 1
                                ? max_length_in_meters
                                : 1) +
                        option.price_for_weight *
                            (box_weight_in_kg >= 1 ? box_weight_in_kg : 1);

                    console.log("CHARGE FOR PROUCT", chargePerProduct);
                    console.log("MAX LENGTH IN METERS", max_length_in_meters);
                    console.log("MAX WEIGHT IN KG", box_weight_in_kg);
                    const totalCharge = chargePerProduct * amountValue;
                    console.log("TOTAL CHARFE", totalCharge);
                    console.log("SELECTED BUK POLICY", selectedBulkPolicy);
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

        // console.log("ENDED REQUEST FOR RATES", isLoadingShipRates);

        setChosenShipRate(null);
    };
    const [firstTimeShipmentsLoaded, setFirstTimeShipmentsLoaded] =
        useState(false);

    const [startFetchingShipRates, setStartFetchingShipRates] = useState(false);

    useEffect(() => {
        if (
            product &&
            amountValue > 0 &&
            chosenAddress &&
            startFetchingShipRates
        ) {
            setAvailableShippingOptions([]);

            if (firstTimeShipmentsLoaded) {
                recalculateShippingPrices();
            } else {
                getWhichShippingIsIt();
                setFirstTimeShipmentsLoaded(true);
            }
        } else {
            setAvailableShippingOptions([]);
            setChosenShipRate(null);
        }
    }, [chosenAddress, product, amountValue, startFetchingShipRates]);

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
                    getContainerDimensions(product, selectedBulkPolicy);

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

    const [reviewFilterData, setReviewFilterData] = useState({
        order: "-created_at",
    });

    const [reviewAnalytics, setReviewAnalytics] = useState(null);

    useEffect(() => {
        if (product) {
            dispatch(fetchProductReviewsAnalytics(id)).then((res) => {
                setReviewAnalytics(res.data);
                // console.log("RESPONSE ANALYTICS", res);
            });
        }
    }, [product]);

    return (
        <div>
            <div className="container-xxl  mb-5">
                <div className="bg-white-md rounded-1  mt-md-4 py-2 py-md-3 px-md-3">
                    {/* TOP */}
                    <div className="d-none d-md-flex fs-12 text-lightgray align-items-center flex-wrap">
                        {product?.category_hierarchy.map((category, index) => (
                            <Link
                                key={index}
                                href={`/products?category=${category.id}`}
                                // role="button"
                                // onClick={() => console.log("Hello")}
                                className="underline-on-hover"
                            >
                                {catlist(category.name)}
                                {index <
                                    product?.category_hierarchy.length - 1 && (
                                    <IconChevronRight
                                        className="text-black-50"
                                        size={14}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>
                    <div className="d-none d-md-block fw-bold mt-2 mb-2 truncate-overflow-2">
                        {product?.name}
                    </div>
                    <div className="border-bottom d-none d-md-flex align-items-center flex-wrap fs-13  gap-md-3 pb-1 ">
                        <div className="d-flex align-items-center">
                            {filledStarIcons}
                            {emptyStarIcons}
                            <span className="fs-13 ms-2">
                                {product?.avg_rating
                                    ? product.avg_rating.toFixed(1)
                                    : "5.0"}
                            </span>
                        </div>
                        <Link href="/" className="underline-on-hover">
                            {product?.total_ratings} {t("reviews")}
                        </Link>
                        <Link
                            href="/"
                            className="d-flex align-items-center gap-1 underline-on-hover"
                        >
                            {t("share")}
                            <IconShare2 size={16} className="text-main" />
                        </Link>
                        {alreadyInWishlist ? (
                            <div
                                onClick={() => handleRemoveFromWishlist()}
                                role="button"
                                className="d-flex align-items-center gap-1 underline-on-hover"
                            >
                                {t("removeFromWishlist")}
                                <IconHeartMinus
                                    size={16}
                                    className="text-main"
                                />
                            </div>
                        ) : (
                            <div
                                onClick={() => handleAddToWishlist()}
                                role="button"
                                className="d-flex align-items-center gap-1 underline-on-hover"
                            >
                                {t("addToWishlist")}
                                <IconHeartPlus
                                    size={16}
                                    className="text-main"
                                />
                            </div>
                        )}

                        {/* <Link
                            href={`/shop/${product?.seller?.store_name}/${product?.seller?.id}`}
                            className="d-flex align-items-center gap-1 underline-on-hover"
                        >
                            Shop: {product?.seller?.store_name}
                        </Link> */}
                        {/* <Link
                            href="/"
                            className="d-flex align-items-center gap-1 underline-on-hover"
                        >
                            Write to the shop{" "}
                            <IconMessage size={16} className="text-main" />
                        </Link> */}
                        <div className="ms-auto text-black-50">
                            ID: {product?.id}
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="row   mt-md-3 align-items-start position-relative">
                        <div className="col-md-4 position-md-sticky top-0 px-2 px-md-0">
                            <div className="bg-white pt-3 px-2 p-md-3 rounded-1">
                                {mainImage?.file_type === "IMAGE" ? (
                                    <img
                                        src={mainImage?.file}
                                        alt=""
                                        className="img-fluid"
                                    />
                                ) : mainImage?.file_type === "VIDEO" ? (
                                    <ReactPlayer
                                        url={mainImage?.file}
                                        alt=""
                                        className="img-fluid"
                                        controls
                                    ></ReactPlayer>
                                ) : null}

                                <div className="mt-4">
                                    <ProductDetailSliderV2>
                                        {product?.files.map((file, index) => (
                                            <SwiperSlide
                                                key={index}
                                                onClick={() =>
                                                    setMainImage(file)
                                                }
                                                role="button"
                                                className="border-on-hover border-main"
                                            >
                                                <div className="px-1">
                                                    {file.file_type ===
                                                    "IMAGE" ? (
                                                        <img
                                                            className="img-fluid rounded-small"
                                                            src={file.file}
                                                            alt=""
                                                        />
                                                    ) : file.file_type ===
                                                      "VIDEO" ? (
                                                        <video
                                                            className="img-fluid rounded-small"
                                                            src={file.file}
                                                            alt=""
                                                        >
                                                            {/* You can specify a thumbnail image as a poster */}
                                                            <source
                                                                src={file.file}
                                                                type="video/mp4"
                                                            />
                                                            Your browser does
                                                            not support the
                                                            video tag.
                                                        </video>
                                                    ) : null}
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </ProductDetailSliderV2>
                                </div>
                            </div>
                        </div>

                        <div
                            className="col-md-4 px-2 px-md-3 fs-13 position-md-sticky mt-2 mt-md-0"
                            style={{ top: 15 }}
                        >
                            <div className="bg-white px-3 py-2 p-md-0 rounded-1">
                                <div className="d-md-none mb-3">
                                    <div className="fw-bold mt-3 fs-6 mb-1 truncate-overflow-2">
                                        {product?.name}
                                    </div>
                                    <div className="d-flex align-items-center  mx-auto">
                                        {filledStarIcons}
                                        {emptyStarIcons}
                                        <span className="fs-13 ms-2 text-black-50">
                                            {product?.avg_rating
                                                ? product?.avg_rating
                                                : "5.0"}
                                        </span>

                                        <Link
                                            href="/"
                                            className="underline-on-hover fs-13 text-black-50"
                                        >
                                            {product?.total_ratings}{" "}
                                            {t("reviews")}
                                        </Link>
                                    </div>
                                </div>

                                {product &&
                                    product?.options?.map((option) => (
                                        <div
                                            className="row py-1"
                                            key={option.name + option.value}
                                        >
                                            <div className="col-6 border-bottom text-black-50">
                                                {option?.category_option?.name
                                                    ? option?.category_option
                                                          ?.name
                                                    : option?.name}
                                            </div>
                                            <div className="col-6">
                                                {option?.value}
                                            </div>
                                        </div>
                                    ))}
                                {product && (
                                    <>
                                        <div className="row py-1">
                                            <div className="col-6 border-bottom text-black-50">
                                                {t("itemDimensions")}
                                            </div>
                                            <div className="col-6">
                                                {product?.item_length}{" "}
                                                {product?.dimensions_unit} x{" "}
                                                {product?.item_height}{" "}
                                                {product?.dimensions_unit} x{" "}
                                                {product?.item_width}{" "}
                                                {product?.dimensions_unit}
                                            </div>
                                        </div>

                                        <div className="row py-1">
                                            <div className="col-6 border-bottom text-black-50">
                                                {t("itemWeight")}
                                            </div>
                                            <div className="col-6">
                                                {product?.item_weight}{" "}
                                                {product?.weight_unit}
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            <div className="col-6 border-bottom text-black-50">
                                                {t("producedCountry")}
                                            </div>
                                            <div className="col-6">
                                                {getcountrytrans(
                                                    product?.country_of_origin
                                                )}{" "}
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            <div className="col-6 border-bottom text-black-50">
                                                {t("productType")}
                                            </div>
                                            <div className="col-6">
                                                {product?.bulk
                                                    ? t("bulk")
                                                    : t("retail")}{" "}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {product &&
                                    product?.variation_categories?.map(
                                        (varcategory) => (
                                            <div
                                                key={varcategory.id}
                                                className="mt-2 border border-black p-2 rounded-small dropdown user-select-none"
                                            >
                                                <div
                                                    className="fw-medium d-inline-flex  w-100 align-items-center gap-2"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                    role="button"
                                                >
                                                    {/* THIIIS PART */}
                                                    {/* Modify this part */}
                                                    {selectedVariation?.[
                                                        varcategory.id
                                                    ]
                                                        ? selectedVariation[
                                                              varcategory.id
                                                          ].name
                                                        : varcategory.name}
                                                    <IconChevronDown
                                                        size={18}
                                                    />
                                                </div>
                                                <ul class="dropdown-menu main-drop fs-13 user-select-none rounded-small mt-2">
                                                    {varcategory.variations.map(
                                                        (variation) => (
                                                            <li
                                                                key={
                                                                    variation.id
                                                                }
                                                                role="button"
                                                                class={`dropdown-item ${
                                                                    variation.id ===
                                                                    selectedVariation?.[
                                                                        varcategory
                                                                            .id
                                                                    ]?.id
                                                                        ? "text-main fw-bold"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    setSelectedVariation(
                                                                        {
                                                                            ...selectedVariation,
                                                                            [varcategory.id]:
                                                                                variation,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    variation?.name
                                                                }{" "}
                                                                {/* {variation.in_stock &&
                                                                    ` - ${variation.in_stock} ${product?.unit_of_measuring}`} */}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )
                                    )}

                                <div className="d-flex gap-2 mt-2 flex-wrap">
                                    {alreadyInCart &&
                                        alreadyInCart.length > 0 &&
                                        alreadyInCart.map((item, index) => (
                                            <div
                                                key={index}
                                                className="border p-3 rounded-small text-center"
                                            >
                                                <div className="fw-bold">
                                                    {item?.selectedVariations &&
                                                        Object.entries(
                                                            item.selectedVariations
                                                        ).length > 0 &&
                                                        Object.entries(
                                                            item.selectedVariations
                                                        )
                                                            .map(
                                                                ([
                                                                    key,
                                                                    variation,
                                                                ]) =>
                                                                    variation.name
                                                            )
                                                            .join(" / ")}
                                                </div>

                                                <div className="fw-medium">
                                                    {item?.quantity}{" "}
                                                    {/* {product?.unit_of_measuring} */}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 px-2 px-md-3 py-2 h-auto mt-1 mt-md-0">
                            <div className="bg-white shadow p-3">
                                <div className="d-flex">
                                    {" "}
                                    {selectedBulkPolicy ? (
                                        <div className="text-black fw-bold fs-5">
                                            {selectedBulkPolicy?.price &&
                                                `$${selectedBulkPolicy?.price}`}{" "}
                                        </div>
                                    ) : (
                                        <div className="text-black fw-bold fs-5">
                                            {product?.min_price !==
                                            product?.max_price
                                                ? `$${product?.min_price} - ${product?.max_price}`
                                                : `$${product?.min_price}`}{" "}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`fs-14 row ${
                                        product?.sell_in_containers
                                            ? "row-cols-1"
                                            : "row-cols-3"
                                    }   mt-2`}
                                >
                                    {product?.bulk &&
                                        [...(product?.bulks || [])] // Create a new array
                                            .sort(
                                                (a, b) =>
                                                    b.minimum_quantity -
                                                    a.minimum_quantity
                                            )
                                            .map((bulk) => (
                                                <div
                                                    className="p-1"
                                                    key={bulk.id}
                                                >
                                                    <div
                                                        className={`border p-2 fs-12 rounded-small ${
                                                            selectedBulkPolicy &&
                                                            selectedBulkPolicy.id ===
                                                                bulk.id
                                                                ? "border-main"
                                                                : ""
                                                        }`}
                                                        role="button"
                                                        onClick={() => {
                                                            if (
                                                                product?.sell_in_containers
                                                            ) {
                                                                handleSelectBulkPolicy(
                                                                    bulk
                                                                );
                                                            } else {
                                                                handleAmountChange(
                                                                    "fill",
                                                                    bulk.minimum_quantity
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <div>
                                                            {t("min")} :{" "}
                                                            <strong>
                                                                {
                                                                    bulk.minimum_quantity
                                                                }{" "}
                                                                {
                                                                    product?.unit_of_measuring
                                                                }
                                                            </strong>
                                                        </div>
                                                        <div>
                                                            {t("price")} :{" "}
                                                            <strong className="text-main">
                                                                ${bulk.price}
                                                            </strong>
                                                        </div>
                                                        <div>
                                                            {alltrans("ldt")} :{" "}
                                                            <strong>
                                                                {
                                                                    bulk.min_lead_time
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    bulk.max_lead_time
                                                                }{" "}
                                                                {t("days")}
                                                            </strong>
                                                        </div>
                                                        {product?.sell_in_containers && (
                                                            <>
                                                                <div>
                                                                    {alltrans(
                                                                        "Containername"
                                                                    )}{" "}
                                                                    :{" "}
                                                                    <strong>
                                                                        {
                                                                            bulk.container_name
                                                                        }
                                                                    </strong>
                                                                </div>
                                                                <div>
                                                                    {alltrans(
                                                                        "Containerdimensions"
                                                                    )}
                                                                    (
                                                                    {alltrans(
                                                                        "LxHxW"
                                                                    )}
                                                                    ) :{" "}
                                                                    <strong>
                                                                        (
                                                                        {
                                                                            bulk.container_length
                                                                        }
                                                                        x
                                                                        {
                                                                            bulk.container_height
                                                                        }
                                                                        x
                                                                        {
                                                                            bulk.container_width
                                                                        }
                                                                        ){" "}
                                                                        {alltrans(
                                                                            "meters"
                                                                        )}
                                                                    </strong>
                                                                </div>
                                                                <div>
                                                                    {alltrans(
                                                                        "Containerweight"
                                                                    )}{" "}
                                                                    :{" "}
                                                                    <strong>
                                                                        {
                                                                            bulk.container_weight
                                                                        }{" "}
                                                                        {alltrans(
                                                                            "kg"
                                                                        )}
                                                                    </strong>
                                                                </div>
                                                                {product?.limited_stock && (
                                                                    <div>
                                                                        {alltrans(
                                                                            "Containerapproximateavailability"
                                                                        )}
                                                                        :{" "}
                                                                        <strong>
                                                                            {/* {product?.quantity /
                                                                                bulk.minimum_quantity >=
                                                                            1
                                                                                ? product?.quantity /
                                                                                  bulk.minimum_quantity
                                                                                : "Not available"} */}
                                                                            {(selectedVariation?.in_stock ??
                                                                                product?.in_stock) /
                                                                                bulk.minimum_quantity >=
                                                                            1
                                                                                ? Math.floor(
                                                                                      (selectedVariation?.in_stock ??
                                                                                          product?.in_stock) /
                                                                                          bulk.minimum_quantity
                                                                                  )
                                                                                : t(
                                                                                      "Notavailable"
                                                                                  )}
                                                                        </strong>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                </div>

                                <hr />
                                <div className="fs-13 mb-2">
                                    <span>
                                        {product?.limited_stock ? (
                                            selectedVariation ? (
                                                ``
                                            ) : (
                                                `${
                                                    product?.in_stock
                                                }  ${alltrans(
                                                    "Listings.available"
                                                )}`
                                            )
                                        ) : (
                                            <span>
                                                {t("availability")}{" "}
                                                <span className="fw-medium">
                                                    {t("unlimited")}
                                                </span>
                                            </span>
                                        )}
                                        {""}
                                    </span>
                                    {product?.quantity_sold > 0 && (
                                        <span className="ms-1 text-danger fw-medium">
                                            {" "}
                                            / {product?.quantity_sold}{" "}
                                            {/* {product?.unit_of_measuring}{" "} */}
                                            {t("sold")}
                                        </span>
                                    )}
                                </div>
                                {maximumVariationAmount ? (
                                    <div className="fs-13 mb-2">
                                        {t("maximum")}: {maximumVariationAmount}{" "}
                                        {/* {product?.unit_of_measuring} */}
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="fs-14 d-flex align-items-center pb-3">
                                    <span className="fs-13">
                                        {t("quantity")}
                                    </span>{" "}
                                    <button
                                        role="button"
                                        onClick={() =>
                                            handleAmountChange("minus")
                                        }
                                        className="ms-auto btn py-0 btn-main rounded-small text-center px-1 "
                                    >
                                        <IconMinus size={20} />
                                    </button>
                                    <span
                                        className="input px-2 mx-2"
                                        role="textbox"
                                        contenteditable="true"
                                        ref={spanRef}
                                        onInput={handleInput}
                                    >
                                        {amountValue}
                                    </span>
                                    <button
                                        role="button"
                                        onClick={() =>
                                            handleAmountChange("plus")
                                        }
                                        className="btn rounded-small btn-main text-center px-1 py-0"
                                    >
                                        <IconPlus size={20} />
                                    </button>
                                </div>

                                <div className="mt-2 border border-black p-2 rounded-small dropdown user-select-none fs-13">
                                    <div
                                        className="fw-medium d-inline-flex  w-100 align-items-center gap-2"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        data-bs-auto-close="false"
                                        role="button"
                                        onClick={() =>
                                            setStartFetchingShipRates(true)
                                        }
                                    >
                                        {chosenShipRate ? (
                                            <span className="d-flex justify-content-between w-100">
                                                <span>
                                                    {
                                                        chosenShipRate.courier_name
                                                    }
                                                </span>
                                                <span className="fw-bold">
                                                    $
                                                    {chosenShipRate?.total_charge?.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </span>
                                        ) : (
                                            <>
                                                {t("chooseShipping")}:
                                                <IconChevronDown size={18} />
                                            </>
                                        )}
                                    </div>

                                    <ul
                                        class="dropdown-menu main-drop fs-13 user-select-none rounded-small mt-2"
                                        style={{
                                            minWidth: "350px",
                                        }}
                                    >
                                        {chosenAddress ? (
                                            !isLoadingShipRates ? (
                                                Array.isArray(
                                                    availableShippingOptions
                                                ) &&
                                                availableShippingOptions.length >
                                                    0 ? (
                                                    availableShippingOptions.map(
                                                        (rate) => (
                                                            <li
                                                                onClick={() =>
                                                                    setChosenShipRate(
                                                                        rate
                                                                    )
                                                                }
                                                                key={rate?.id}
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
                                                                        <div className="d-flex gap-2 align-items-center">
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

                                                                                    :
                                                                                </span>
                                                                            )}
                                                                            {rate?.delivery_time_rank ===
                                                                                1.0 && (
                                                                                <span className="fs-13 text-main fw-bold">
                                                                                    {t(
                                                                                        "fastest"
                                                                                    )}

                                                                                    :
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

                                                                                :
                                                                            </div>
                                                                            <div className="fw-bold">
                                                                                $
                                                                                {rate?.total_charge.toFixed(
                                                                                    2
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
                                                            className={` px-3 py-2 fw-medium`}
                                                        >
                                                            {t("noShipping")}:
                                                            {/* Request for customer support */}
                                                        </div>
                                                    </>
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
                                                            Loading...
                                                        </span>
                                                    </div>
                                                    {/* Request for customer support */}
                                                </div>
                                            )
                                        ) : (
                                            <>
                                                <div
                                                    role="button"
                                                    className={` px-3 py-2 fw-medium`}
                                                >
                                                    {t("chooseAddress")}
                                                    {/* Request for customer support */}
                                                </div>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                <hr />
                                {/* {!isForbiddenCountry && ( */}
                                <>
                                    {/* <Link
                                        href="/checkout"
                                        className="btn btn-main fs-14 w-100  fw-bold"
                                    >
                                        Buy It Now
                                    </Link> */}
                                    <button
                                        onClick={() => handleAddToCart()}
                                        className="btn btn-main fs-14 w-100 mt-2 fw-bold "
                                    >
                                        {t("addToCart")}
                                        {/* <IconShoppingCart
                                    size={16}
                                    className="text-black ms-1"
                                /> */}
                                    </button>
                                </>
                                {/* )} */}
                                {alreadyInWishlist ? (
                                    <div
                                        onClick={() =>
                                            handleRemoveFromWishlist()
                                        }
                                        className="btn btn-outlined-main border-main text-main btn-custom fs-14 w-100 mt-2 fw-bold border"
                                    >
                                        {t("removeFromWishlist")}{" "}
                                        <IconHeartMinus
                                            size={16}
                                            className="text-main ms-1"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => handleAddToWishlist()}
                                        className="btn btn-outlined-main btn-custom fs-14 w-100 mt-2 fw-bold border"
                                    >
                                        {t("addToWishlist")}{" "}
                                        <IconHeartPlus
                                            size={16}
                                            className="text-main ms-1"
                                        />
                                    </div>
                                )}

                                <hr />
                                <div className="fs-14 mb-2 mt-2 row">
                                    <div className="col-3">
                                        {" "}
                                        {t("shipping")}{" "}
                                    </div>
                                    <span className="col">
                                        {/* {shippingOption?.visual}{" "} */}
                                        <span className="text-black-50">
                                            {t("located")}{" "}
                                            {getcountrytrans(
                                                product?.shipping_address
                                                    ?.country
                                            )}
                                            {/* , {product?.shipping_address?.state}
                                            , {product?.shipping_address?.city},{" "}
                                            {
                                                product?.shipping_address
                                                    ?.zip_code
                                            } */}
                                        </span>
                                    </span>
                                </div>
                                <div className="fs-14 mb-2 mt-2 row">
                                    <div className="col-3">
                                        {" "}
                                        {t("returns")}{" "}
                                    </div>
                                    <span className="col">
                                        {t("returnPolicy")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DESCRIPTION and REVIEWS */}

                    <div className="bg-white p-3 mt-5 mt-md-0">
                        <ul
                            className="nav nav-tabs  mt-md-5"
                            id="myTab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link active fs-14"
                                    id="home-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#home-tab-pane"
                                    type="button"
                                    role="tab"
                                    aria-controls="home-tab-pane"
                                    aria-selected="true"
                                >
                                    {t("aboutProduct")}
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link fs-14 "
                                    id="profile-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#profile-tab-pane"
                                    type="button"
                                    role="tab"
                                    aria-controls="profile-tab-pane"
                                    aria-selected="false"
                                >
                                    {t("reviewsCapitalize")}
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div
                                className="tab-pane fade show active"
                                id="home-tab-pane"
                                role="tabpanel"
                                aria-labelledby="home-tab"
                                tabindex="0"
                            >
                                <div className="fw-bold fs-6 mt-4 mb-2">
                                    {t("productDescription")}
                                </div>
                                <p className="fs-14">{product?.description}</p>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="profile-tab-pane"
                                role="tabpanel"
                                aria-labelledby="profile-tab"
                                tabindex="0"
                            >
                                <div className="fw-bold fs-6 mt-4 mb-2">
                                    {t("productRatingsAndReviews")}
                                </div>

                                <div className="row  mt-3 row-gap-2">
                                    <div className="col-md-auto">
                                        <div className="d-flex align-items-center">
                                            {bigFilledStarIcons}
                                            {bigEmptyStarIcons}
                                            <div className="fs-5 fw-bold ms-3">
                                                {product?.avg_rating
                                                    ? product.avg_rating.toFixed(
                                                          1
                                                      )
                                                    : "5.0"}{" "}
                                            </div>
                                            <div className="text-black-50 ms-2 fs-14">
                                                ({product?.total_ratings}{" "}
                                                {t("reviews")})
                                            </div>
                                        </div>
                                        <hr />
                                        <div>
                                            <div className="row align-items-center ">
                                                <div className="col-auto fs-14 text-black-50 fw-medium d-inline">
                                                    5 {t("star")}
                                                </div>
                                                <div
                                                    className="col progress ms-3 p-0"
                                                    style={{ height: 10 }}
                                                >
                                                    <div
                                                        className="progress-bar bg-main"
                                                        role="progressbar"
                                                        aria-label="Basic example"
                                                        style={{
                                                            width: `${
                                                                (reviewAnalytics
                                                                    ?.rating_counts[
                                                                    "5.00"
                                                                ] *
                                                                    100) /
                                                                reviewAnalytics?.total_count
                                                            }%`,
                                                        }}
                                                        aria-valuenow="100"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                <div className="col-2 fs-14 text-black-50">
                                                    {
                                                        reviewAnalytics
                                                            ?.rating_counts[
                                                            "5.00"
                                                        ]
                                                    }
                                                </div>
                                            </div>

                                            <div className="row align-items-center ">
                                                <div className="col-auto fs-14 text-black-50 fw-medium d-inline">
                                                    4 {t("star")}
                                                </div>
                                                <div
                                                    className="col progress ms-3 p-0"
                                                    style={{ height: 10 }}
                                                >
                                                    <div
                                                        className="progress-bar bg-main"
                                                        role="progressbar"
                                                        aria-label="Basic example"
                                                        style={{
                                                            width: `${
                                                                (reviewAnalytics
                                                                    ?.rating_counts[
                                                                    "4.00"
                                                                ] *
                                                                    100) /
                                                                reviewAnalytics?.total_count
                                                            }%`,
                                                        }}
                                                        aria-valuenow="100"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                <div className="col-2 fs-14 text-black-50">
                                                    {
                                                        reviewAnalytics
                                                            ?.rating_counts[
                                                            "4.00"
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                            <div className="row align-items-center ">
                                                <div className="col-auto fs-14 text-black-50 fw-medium d-inline">
                                                    3 {t("star")}
                                                </div>
                                                <div
                                                    className="col progress ms-3 p-0"
                                                    style={{ height: 10 }}
                                                >
                                                    <div
                                                        className="progress-bar bg-main"
                                                        role="progressbar"
                                                        aria-label="Basic example"
                                                        style={{
                                                            width: `${
                                                                (reviewAnalytics
                                                                    ?.rating_counts[
                                                                    "3.00"
                                                                ] *
                                                                    100) /
                                                                reviewAnalytics?.total_count
                                                            }%`,
                                                        }}
                                                        aria-valuenow="100"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                <div className="col-2 fs-14 text-black-50">
                                                    {
                                                        reviewAnalytics
                                                            ?.rating_counts[
                                                            "3.00"
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                            <div className="row align-items-center ">
                                                <div className="col-auto fs-14 text-black-50 fw-medium d-inline">
                                                    2 {t("star")}
                                                </div>
                                                <div
                                                    className="col progress ms-3 p-0"
                                                    style={{ height: 10 }}
                                                >
                                                    <div
                                                        className="progress-bar bg-main"
                                                        role="progressbar"
                                                        aria-label="Basic example"
                                                        style={{
                                                            width: `${
                                                                (reviewAnalytics
                                                                    ?.rating_counts[
                                                                    "2.00"
                                                                ] *
                                                                    100) /
                                                                reviewAnalytics?.total_count
                                                            }%`,
                                                        }}
                                                        aria-valuenow="100"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                <div className="col-2 fs-14 text-black-50">
                                                    {
                                                        reviewAnalytics
                                                            ?.rating_counts[
                                                            "2.00"
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                            <div className="row align-items-center ">
                                                <div className="col-auto fs-14 text-black-50 fw-medium d-inline">
                                                    1 {t("star")}
                                                </div>
                                                <div
                                                    className="col progress ms-3 p-0"
                                                    style={{ height: 10 }}
                                                >
                                                    <div
                                                        className="progress-bar bg-main"
                                                        role="progressbar"
                                                        aria-label="Basic example"
                                                        style={{
                                                            width: `${
                                                                (reviewAnalytics
                                                                    ?.rating_counts[
                                                                    "1.00"
                                                                ] *
                                                                    100) /
                                                                reviewAnalytics?.total_count
                                                            }%`,
                                                        }}
                                                        aria-valuenow="100"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                <div className="col-2 fs-14 text-black-50">
                                                    {
                                                        reviewAnalytics
                                                            ?.rating_counts[
                                                            "1.00"
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md mt-3 mt-md-0">
                                        <div className="d-flex fs-14 align-items-center justify-content-end">
                                            <div className="d-flex align-items-center border-bottom">
                                                {t("sortBy")}{" "}
                                                <div>
                                                    <select
                                                        className="form-select fs-14 ms-2 shadow-none border-0"
                                                        aria-label="Default select example"
                                                        onChange={(e) =>
                                                            setReviewFilterData(
                                                                {
                                                                    ...reviewFilterData,
                                                                    order: e
                                                                        .target
                                                                        .value,
                                                                }
                                                            )
                                                        }
                                                        value={
                                                            reviewFilterData.order
                                                        }
                                                    >
                                                        <option value="-created_at">
                                                            {t("newComments")}
                                                        </option>
                                                        <option value="created_at">
                                                            {t("oldComments")}
                                                        </option>
                                                        <option value="-rating">
                                                            {t("topComments")}
                                                        </option>
                                                        <option value="rating">
                                                            {t("badComments")}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-md-3">
                                            <ProductReviewList
                                                id={id}
                                                filtersData={reviewFilterData}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SimilarItems id={id} />
                    <BoughtTogether id={id} />
                    {/* <div className="bg-white p-3 p-md-0 mt-4">
                        <div className="fw-bold ">Bought together</div>
                      <RecommendedProductSlider /> 
                    </div>  /* */}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
