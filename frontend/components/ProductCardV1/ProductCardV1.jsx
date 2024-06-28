"use client";
import {
    addToWishlist,
    removeFromWishlistItem,
} from "@/redux/features/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectWishItems } from "@/redux/selectors/wish";
import {
    IconHeart,
    IconHeartFilled,
    IconStar,
    IconStarFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import countries from "../utils/countries";
import { useTranslations } from "next-intl";

const mapState = (state) => ({
    wishItems: selectWishItems(state),
    chosenAddress: state.addressBook.chosenAddress,
});

function ProductCardV1({ product }) {
    const {
        image,
        name,
        min_price,
        max_price,
        min_order_quantity,
        unit_of_measuring,
        avg_rating,
        total_ratings,
        country_of_origin,
        slug,
        id,
        bulk,
        sell_in_containers,
    } = product;

    const filledStars = Math.floor(avg_rating ? avg_rating : 0); // Calculate the number of filled stars
    const remainingStars = 5 - filledStars; // Calculate the number of remaining stars (empty)

    // Generate filled stars
    const filledStarIcons = Array.from({ length: filledStars }, (_, index) => (
        <IconStarFilled key={index} size={18} className="text-yellow" />
    ));

    // Generate remaining empty stars
    const emptyStarIcons = Array.from(
        { length: remainingStars },
        (_, index) => (
            <IconStar
                key={filledStars + index}
                size={18}
                className="text-yellow"
            />
        )
    );

    const [alreadyInWishlist, setAlreadyInWishlist] = useState(false);
    const dispatch = useAppDispatch();
    const { wishItems, chosenAddress } = useAppSelector(mapState);
    const handleAddToWishlist = () => {
        if (product) {
            dispatch(addToWishlist(product));
            // toast.success("Added to wishlist!", { className: "fs-14" });
        }
    };

    const handleRemoveFromWishlist = () => {
        if (product) {
            dispatch(removeFromWishlistItem(product));
            // toast.warning("Removed from wishlist!", { className: "fs-14" });
        }
    };

    useEffect(() => {
        const existingItem = wishItems.find(
            (wishItem) => wishItem?.id === product?.id
        );
        if (existingItem) {
            setAlreadyInWishlist(true);
        } else {
            setAlreadyInWishlist(false);
        }
    }, [wishItems]);

    const t = useTranslations();

    return (
        <div className="px-1 py-1 h-100" key={product.id}>
            <div className="h-100 position-relative">
                <Link
                    href={`/products/${slug}/${id}`}
                    className="mt-2 w-100 h-100 d-flex align-items-center align-content-center justify-content-center"
                    style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        backgroundImage: `url(${image})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                ></Link>
                <div
                    className="position-absolute"
                    style={{ top: 10, right: 10 }}
                >
                    {alreadyInWishlist ? (
                        <button
                            onClick={() => handleRemoveFromWishlist()}
                            className="btn btn-main px-2 py-0 border-0 me-2 text-white"
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
                    )}
                </div>
                <Link
                    href={`/products/${slug}/${id}`}
                    className="fs-14  fw-medium mt-1 truncate-overflow-2"
                >
                    {name}
                </Link>
                <div className="fw-bold ">
                    {min_price !== max_price
                        ? `$${min_price} - $${max_price}`
                        : `$${min_price}`}{" "}
                    <span className="fs-13 fw-medium text-lightgray">
                        /piece for {min_order_quantity}
                    </span>
                </div>
                {/* {bulk && !sell_in_containers && (
                    <div className="fs-13 fw-medium text-lightgray">
                        {t("minOrder")}: {min_order_quantity}{" "}
                    </div>
                )} */}

                <div className="fs-13 fw-medium text-lightgray text-main">
                    {bulk ? t("Bulk") : t("Retail")}
                </div>
                {/* <div className="fs-13 fw-medium text-lightgray">
                    {shippingOption ? shippingOption : country_of_origin}
                </div> */}
                {/* <div className="fs-13 fw-medium text-lightgray">
                    {country_of_origin}
                </div> */}

                <div className="d-flex align-items-center flex-wrap truncate-overflow-1 mt-1">
                    {filledStarIcons}
                    {emptyStarIcons}
                    <span className="fs-14 text-lightgray ms-2  d-none d-md-inline">
                        {avg_rating ? avg_rating : "0.0"} ({total_ratings})
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ProductCardV1;
