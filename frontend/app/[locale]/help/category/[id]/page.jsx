"use client";
import HelpColumnItem from "@/components/SellerComps/HelpColumnItem/HelpColumnItem";
import HelpItem from "@/components/SellerComps/HelpItem/HelpItem";
import { fetchHelpItems } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { getHelpItemsConfi } from "@/redux/utils/shop";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Page({ params }) {
    const { id } = params;
    const dispatch = useAppDispatch();
    const t = useTranslations("HelpDetailPage");
    const [loadMore, setLoadMore] = useState(null);
    const [res, setRes] = useState({
        results: null,
        count: null,
        next: null,
    });

    const [categoryData, setCategoryData] = useState({
        id: null,
        image: "",
        title: "",
    });

    useEffect(() => {
        const confi = getHelpItemsConfi(id, loadMore, null);
        dispatch(fetchHelpItems(confi)).then((response) => {
            if (response.status > 205) {
                setRes({
                    results: null,
                    count: null,
                    next: null,
                });
            } else {
                console.log("RESPONSE ", response);
                if (loadMore) {
                    setRes({
                        ...response.data,
                        results: [...res.results, ...response.data.results],
                    });
                    setCategoryData(response.data.results[0]?.category);
                } else {
                    setRes(response.data);
                    setCategoryData(response.data.results[0]?.category);
                }
            }
        });
    }, [loadMore, id]);
    return (
        <div>
            <div className="container-xxl">
                <div className="row row-gap-3 mx-0 mt-3">
                    <div className="col-md-2">
                        <div
                            className="bg-white shadow-sm position-sticky p-3"
                            style={{ top: 10 }}
                        >
                            <Link href="/help" className="main-link fs-14 ">
                                {"< "}
                                {t("all_categories")}
                            </Link>
                            <HelpItem item={categoryData} />
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="bg-white shadow-sm">
                            <div className="row row-cols-4 mx-0 py-3 px-3">
                                {Array.isArray(res.results) &&
                                res.results.length >= 1 ? (
                                    res.results.map((item) => (
                                        <HelpColumnItem
                                            key={item.id}
                                            item={item}
                                        />
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
        </div>
    );
}
