"use client";
import ProductCardV1 from "@/components/ProductCardV1/ProductCardV1";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getData, getProductsData } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function ProductsList({
    categories,
    filtersData,
    title,
    noPreview,
    onDataArrive,
}) {
    // const { products, count, next } = useAppSelector((state) => state.shop);
    const [res, setRes] = useState({
        results: null,
        count: null,
        next: null,
    });
    const [loadMore, setLoadMore] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const t = useTranslations();
    // fetch
    useEffect(() => {
        dispatch(
            getProductsData(loadMore, categories, filtersData, setIsLoading)
        ).then((response) => {
            if (response) {
                if (loadMore) {
                    setRes({
                        ...response,
                        results: [...res.results, ...response.results],
                    });
                } else {
                    setRes(response);
                }
                if (onDataArrive) {
                    onDataArrive(response);
                }
            } else {
                setRes({
                    results: null,
                    count: null,
                    next: null,
                });
            }
        });
    }, [loadMore, categories, filtersData]);

    if (noPreview) {
        return (
            <>
                {Array.isArray(res.results) && res.results.length >= 1 ? (
                    res.results.map((product) => (
                        <ProductCardV1 key={product.id} product={product} />
                    ))
                ) : (
                    <div className="w-100 w-md-30 mx-auto  text-center py-3 py-md-5">
                        {/* <div className="fw-medium text-dark fs-md-4 mb-5 text-muted">
                                No products was found for this query.
                            </div> */}
                        <img
                            src="/nothingfound.png"
                            className="img-fluid px-5"
                            alt=""
                        />
                    </div>
                    // <div className="w-50 mx-auto  text-center py-5">
                    //     <div className="fw-medium text-dark fs-4 mb-5">
                    //         No products was found for this query.
                    //     </div>
                    //     <img
                    //         src="/no-products.svg"
                    //         className="img-fluid"
                    //         alt=""
                    //     />
                    // </div>
                )}
            </>
        );
    }

    return (
        <div className="container-xxl">
            <div className="bg-white rounded-1  mt-4 py-3 px-sm-3 mb-5">
                <h6 className="fs-6 border-bottom pb-2 fw-bold mb-3 ms-3 ms-sm-0">
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <div class="spinner-border text-dark" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <span>{title ? title : t("special_offers")} </span>
                    )}
                </h6>
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6  mx-0">
                    {Array.isArray(res.results) && res.results.length >= 1 ? (
                        res.results.map((product) => (
                            <ProductCardV1 product={product} />
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
                </div>
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
            </div>
        </div>
    );
}
