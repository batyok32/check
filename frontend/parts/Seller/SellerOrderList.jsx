import OrderItem from "@/components/SellerComps/OrderItem/OrderItem";
import { useAppDispatch } from "@/redux/hooks";
import { getSellerOrderItems } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

export default function SellerOrderList({
    filtersData,
    setProducts,
    refetchSignal,
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
        dispatch(getSellerOrderItems(loadMore, filtersData, setIsLoading)).then(
            (response) => {
                console.log("RESPONSE ", response);
                if (response) {
                    if (loadMore) {
                        setRes({
                            ...response,
                            results: [...res.results, ...response.results],
                        });
                        setProducts([...res.results, ...response.results]);
                    } else {
                        setRes(response);
                        setProducts(response.results);
                    }
                    // if (onDataArrive) {
                    //     onDataArrive(response);
                    // }
                } else {
                    setRes({
                        results: null,
                        count: null,
                        next: null,
                    });
                }
            }
        );
        console.log("LOGGED NEW DATA");
    }, [loadMore, filtersData, refetchSignal]);

    return (
        <>
            {Array.isArray(res.results) && res.results.length >= 1 ? (
                res.results.map((item) => (
                    <OrderItem orderItem={item} key={item.id} />
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
