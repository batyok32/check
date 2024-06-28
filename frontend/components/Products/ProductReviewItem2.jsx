"use client";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import countries from "../utils/countries";
import Link from "next/link";
import { convertToLocale, getWindowLocale } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";
import { getReviewStars } from "@/redux/utils/product";

export default function ProductReviewItem2({ review }) {
    const t = useTranslations("ProductReviewItem2");
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

    return (
        <div className="my-3 px-md-3 border-bottom pb-3">
            <div className="d-flex align-items-center justify-content-between fs-14 ">
                <div className="d-flex align-items-center">
                    <div className="p-1  rounded-small me-2">
                        <img
                            src={review.product.image}
                            className="img-fluid"
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                            }}
                            alt=""
                        />
                    </div>
                    <Link
                        className="fs-13 text-decoration-underline"
                        href={`/products/${review.product.slug}/${review.product.id}/`}
                    >
                        {review.product.name}
                    </Link>
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
                {t("reviewedIn")}{" "}
                {
                    countries.find(
                        (country) => country.code === review?.country
                    )?.name
                }{" "}
                {t("on")}{" "}
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
                    {isExpanded ? t("showLess") : t("showMore")}
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
