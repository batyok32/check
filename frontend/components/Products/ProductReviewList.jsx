"use client";
import { useAppDispatch } from "@/redux/hooks";
import React, { useEffect, useRef, useState } from "react";
import { fetchProductReviews } from "@/redux/actions/shopActions";
import ProductReviewItem from "./ProductReviewItem";
import { getProductReviewConfi } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";

export default function ProductReviewList({ id, filtersData }) {
    // const { products, count, next } = useAppSelector((state) => state.shop);
    const [res, setRes] = useState({
        results: null,
        count: null,
        next: null,
    });
    const [loadMore, setLoadMore] = useState(null);
    const dispatch = useAppDispatch();

    const fetchData = () => {
        const confi = getProductReviewConfi(filtersData, loadMore);
        dispatch(fetchProductReviews(id, confi)).then((response) => {
            if (response) {
                if (loadMore) {
                    setRes({
                        ...response,
                        results: [...res.results, ...response.data.results],
                    });
                } else {
                    setRes(response.data);
                }
            } else {
                setRes({
                    results: null,
                    count: null,
                    next: null,
                });
            }
        });
    };
    // fetch
    useEffect(() => {
        fetchData();
    }, [loadMore, filtersData]);
    const t = useTranslations();

    return (
        <>
            {Array.isArray(res.results) && res.results.length >= 1 ? (
                res.results.map((item) => (
                    <ProductReviewItem review={item} key={item.id} />
                ))
            ) : (
                <div className="w-100 w-md-30 mx-auto  text-center py-3 py-md-5">
                    <img
                        src="/nothingfound.png"
                        className="img-fluid px-5"
                        alt=""
                    />
                </div>
            )}
            {res.next && (
                <div className="row my-3 justify-content-center">
                    <button
                        className="btn btn-main fw-bold fs-14 rounded-small mt-3"
                        style={{
                            width: "300px",
                            fontWeight: "600 !important",
                        }}
                        onClick={() => setLoadMore(res.results?.length)}
                    >
                        {t("loadMore")}
                    </button>
                </div>
            )}
        </>
    );
}
