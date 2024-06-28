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

const mapState = (state) => ({
    wishItems: selectWishItems(state),
    chosenAddress: state.addressBook.chosenAddress,
});

function ProductCardV2({ product }) {
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
        quantity_sold,
    } = product;

    return (
        <div className="px-1 py-1 h-100">
            <div className="h-100 position-relative">
                <Link
                    href={`/seller/listing/edit/${id}`}
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

                <Link
                    href={`/seller/listing/edit/${id}`}
                    className="fs-14  fw-medium mt-1 truncate-overflow-2"
                >
                    {name}
                </Link>
                <div className="fw-bold fs-14 mt-1">{quantity_sold} sold</div>
            </div>
        </div>
    );
}

export default ProductCardV2;
