"use client";
import { IconSearch, IconX, IconFilter } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import OrderList from "@/components/AccountPageComponents/Orders/OrderList";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import OrderFilterModal from "@/components/AccountPageComponents/Orders/OrderFilterModal";

export default function Page() {
    const t = useTranslations("OrderPage");
    const searchParams = useSearchParams();
    const order_id = searchParams.get("id");
    const [filterData, setFilterData] = useState({
        search: null,
        order_id: order_id,
        sort: null,
        status: null,
    });
    const router = useRouter();
    const [refetchSignal, setRefetchSignal] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    const handleSubmitSearch = () => {
        if (searchValue.trim().length > 0) {
            setFilterData({
                ...filterData,
                search: searchValue,
            });
        }
    };

    useEffect(() => {
        if (order_id) {
            setFilterData({ order_id: order_id });
        }
    }, [order_id]);

    return (
        <div className="row mx-0">
            <div className="mt-3 col-lg-10 mx-auto">
                <div className="mb-3 d-md-flex justify-content-between align-items-center">
                    <div className="">
                        {filterData?.search ? (
                            <div className="d-flex align-items-center ">
                                <div className="fs-5 fw-bold truncate-overflow-1">
                                    {t("orders")} - {filterData?.search}
                                </div>
                                <span
                                    role="button"
                                    onClick={() => {
                                        setFilterData({
                                            ...filterData,
                                            search: null,
                                        });
                                        setSearchValue("");
                                    }}
                                    className="badge bg-main text-white btn-custom ms-2"
                                >
                                    <IconX size={18} />
                                </span>
                            </div>
                        ) : (
                            <div className="fw-bold  fs-5">{t("orders")}</div>
                        )}
                    </div>
                    <div className="fs-14 m-0 d-flex gap-2 align-items-center">
                        <div className="text-secondary d-flex border bg-white align-items-center px-1 rounded-small py-2">
                            <div>
                                <IconSearch size={22} className="me-2" />
                            </div>
                            <input
                                type="text"
                                className="form-control border-0 p-0 rounded-0 shadow-none placeholder-gray bg-transparent fs-14"
                                id="exampleFormControlInput1"
                                placeholder={t("searchByIdOrProductName")}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSubmitSearch();
                                }}
                            />
                        </div>
                        <div className="d-flex  align-items-center px-1 rounded-small py-2">
                            <OrderFilterModal
                                filterData={filterData}
                                setFilterData={setFilterData}
                            >
                                <button className="btn btn-gray rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                                    <span>{t("filters")}</span>{" "}
                                    <IconFilter
                                        size={22}
                                        stroke={2}
                                        className="ms-1"
                                    />
                                </button>
                            </OrderFilterModal>
                        </div>
                    </div>
                </div>
                <div className="d-flex mb-3">
                    {order_id && (
                        <button
                            onClick={() => {
                                setFilterData({
                                    ...filterData,
                                    order_id: null,
                                });
                                router.replace("/account/orders", undefined, {
                                    shallow: true,
                                });
                            }}
                            className="btn btn-gray fs-14 rounded-small"
                        >
                            {t("orderId")}
                            {order_id}
                            <span
                                role="button"
                                className="badge bg-main text-white btn-custom ms-2"
                            >
                                <IconX size={18} />
                            </span>
                        </button>
                    )}
                </div>
                <OrderList
                    filtersData={filterData}
                    refetchSignal={refetchSignal}
                />
            </div>
        </div>
    );
}
