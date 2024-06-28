"use client";
import { useAppDispatch } from "@/redux/hooks";
import { getOrderItems } from "@/redux/utils/shop";
import React, { useEffect, useRef, useState } from "react";
import OrderItem from "./OrderItem";
import OpenCaseModal from "@/components/SupportCaseModal/OpenCaseModal";
import LeaveReviewModal from "../LeaveReviewModal/LeaveReviewModal";
import { useTranslations } from "next-intl";

export default function OrderList({ filtersData, refetchSignal }) {
    const t = useTranslations();
    const [res, setRes] = useState({
        results: null,
        count: null,
        next: null,
    });
    const [loadMore, setLoadMore] = useState(null);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const fetchData = () => {
        dispatch(getOrderItems(loadMore, filtersData, setIsLoading)).then(
            (response) => {
                if (response) {
                    if (loadMore) {
                        setRes({
                            ...response,
                            results: [...res.results, ...response.results],
                        });
                    } else {
                        setRes(response);
                    }
                } else {
                    setRes({
                        results: null,
                        count: null,
                        next: null,
                    });
                }
            }
        );
    };

    useEffect(() => {
        fetchData();
    }, [loadMore, filtersData, refetchSignal]);

    const openModalRef = useRef();
    const openReviewModalRef = useRef();
    const [caseInitialData, setCaseInitialData] = useState({});
    const [reviewInitialData, setReviewInitialData] = useState({});

    return (
        <>
            <OpenCaseModal initialData={caseInitialData}>
                <div ref={openModalRef}></div>
            </OpenCaseModal>
            <LeaveReviewModal
                initialData={reviewInitialData}
                onSuccess={() => fetchData()}
            >
                <div ref={openReviewModalRef}></div>
            </LeaveReviewModal>
            {Array.isArray(res.results) && res.results.length >= 1 ? (
                res.results.map((item) => (
                    <OrderItem
                        orderItem={item}
                        key={item.id}
                        setCaseInitialData={setCaseInitialData}
                        setReviewInitialData={setReviewInitialData}
                        openModalRef={openModalRef}
                        openReviewModalRef={openReviewModalRef}
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
            {res.next && (
                <div className="row my-3 justify-content-center">
                    <button
                        className="btn btn-main fw-bold fs-14 rounded-small mt-3"
                        style={{ width: "300px", fontWeight: "600 !important" }}
                        onClick={() => setLoadMore(res.results?.length)}
                    >
                        {t("loadMore")}
                    </button>
                </div>
            )}
        </>
    );
}
