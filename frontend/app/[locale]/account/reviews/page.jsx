"use client";
import ProductReviewItem2 from "@/components/Products/ProductReviewItem2";
import { fetchUserProductReviewsList } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { getProductReviewConfi } from "@/redux/utils/shop";
import { IconFilter } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations("ReviewPage");
    const [res, setRes] = useState({
        results: null,
        count: null,
        next: null,
    });
    const [loadMore, setLoadMore] = useState(null);
    const dispatch = useAppDispatch();

    const fetchData = () => {
        const confi = getProductReviewConfi(null, loadMore);
        dispatch(fetchUserProductReviewsList(confi)).then((response) => {
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

    useEffect(() => {
        fetchData();
    }, [loadMore]);

    return (
        <div className="mt-3">
            <div className="mb-3 row mx-0 justify-content-between align-items-end">
                <div className="col-10 mx-auto">
                    <div className="">
                        <div className="mb-3 d-flex justify-content-between align-items-center ">
                            <div className="fw-bold  fs-5">{t("reviews")}</div>
                            <div className="fs-14 m-0 d-none gap-4">
                                <div className="d-flex  align-items-center px-1 rounded-small py-2">
                                    <button className="btn btn-gray rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                                        <span>{t("filters")}</span>{" "}
                                        <IconFilter
                                            size={22}
                                            stroke={2}
                                            className="ms-1"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {Array.isArray(res.results) &&
                        res.results.length >= 1 ? (
                            res.results.map((item) => (
                                <ProductReviewItem2
                                    review={item}
                                    key={item.id}
                                />
                            ))
                        ) : (
                            <div className="w-100 w-md-30 mx-auto  text-center py-3 py-md-5">
                                <div className="fs-14 text-muted">
                                    {t("allReviewsInfo")}
                                </div>
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
                                    onClick={() =>
                                        setLoadMore(res.results?.length)
                                    }
                                >
                                    {t("loadMore")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
