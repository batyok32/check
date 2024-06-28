"use client";
import {
    IconChevronDown,
    IconChevronUp,
    IconStarFilled,
} from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import countries from "../utils/countries";
import { getProductStars, getReviewStars } from "@/redux/utils/product";
import { convertToLocale, getWindowLocale } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";

export default function ProductReviewItem({ review }) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const { filledStarIcons, emptyStarIcons } = getReviewStars(review, 18);
    const [isExpanded, setIsExpanded] = useState(false);

    const [isTruncated, setIsTruncated] = useState(false);
    const commentRef = useRef(null);
    useEffect(() => {
        if (commentRef.current) {
            const lineHeight = parseInt(
                getComputedStyle(commentRef.current).lineHeight
            );
            const maxLines = 2;
            setIsTruncated(
                commentRef.current.scrollHeight > lineHeight * maxLines
            );
        }
    }, [review.comment]);
    const t = useTranslations();

    return (
        <div className="my-3 px-md-3 border-bottom pb-3">
            <div className="d-flex align-items-center justify-content-between fs-14 ">
                <div className="d-flex align-items-center">
                    <div className="p-1  rounded-5 bg-main-50 me-2">
                        <IconUser className="text-white" size={24} />
                    </div>
                    <div className="fs-13">{review.username}</div>
                </div>
            </div>
            <div>
                <div className="d-flex align-items-center fs-14 my-1">
                    {filledStarIcons}
                    {emptyStarIcons}
                    <div className="fw-bold ms-3">{review?.subject}</div>
                </div>
            </div>
            <div className="text-muted fs-13">
                Reviewed in the{" "}
                {
                    countries.find(
                        (country) => country.code === review?.country
                    )?.name
                }{" "}
                on{" "}
                {new Date(review.created_at).toLocaleDateString(
                    convertToLocale(getWindowLocale()),
                    options
                )}
            </div>
            <div
                className={`fs-13 mt-2 ${
                    isExpanded ? "" : "truncate-overflow-2"
                }`}
            >
                {review.comment}
            </div>
            {isTruncated && (
                <button
                    className="btn text-muted p-0 fs-12 pb-1 border-0"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? "Show less" : "Show more"}
                    {isExpanded ? (
                        <IconChevronUp size={16} />
                    ) : (
                        <IconChevronDown size={16} />
                    )}
                </button>
            )}
        </div>
    );
}
