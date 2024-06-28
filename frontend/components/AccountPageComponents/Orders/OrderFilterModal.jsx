"use client";
import { useAppDispatch } from "@/redux/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

export default function OrderFilterModal({
    children,
    filterData,
    setFilterData,
}) {
    const t = useTranslations();
    const closeBtnRef = useRef(null);
    const [localFormData, setLocalFormData] = useState({
        search: null,
        status: null,
        shipState: null,
        sort: null,
    });

    useEffect(() => {
        setLocalFormData(filterData);
    }, [filterData]);

    const onSubmit = () => {
        setFilterData({ ...filterData, ...localFormData });
        closeBtnRef.current.click();
    };

    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target="#orderFilterModal"
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id="orderFilterModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-small border-0 shadow-sm">
                        <div className="modal-header ">
                            <div
                                className="modal-title fs-5 py-0 fw-bold"
                                id="exampleModalLabel"
                            >
                                {t("Products.filters")}
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="ps-0 fs-14 ">
                                <div className="bg-white  ">
                                    <div className="text-secondary d-flex border bg-white align-items-center px-1 rounded-small py-2">
                                        <div>
                                            <IconSearch
                                                size={22}
                                                className="me-2"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control border-0 p-0 rounded-0 shadow-none placeholder-gray bg-transparent fs-14"
                                            id="exampleFormControlInput1"
                                            placeholder={t(
                                                "OrderPage.searchByIdOrProductName"
                                            )}
                                            value={localFormData.search}
                                            onChange={(e) =>
                                                setLocalFormData({
                                                    ...localFormData,
                                                    search: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <div className="my-2 mt-4 fw-medium">
                                            {t("Products.sortBy")}
                                        </div>
                                        <select
                                            className="form-select fs-14 rounded-small shadow-none border"
                                            aria-label="Default select example"
                                            value={localFormData.sort}
                                            onChange={(e) =>
                                                setLocalFormData({
                                                    ...localFormData,
                                                    sort: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="" disabled>
                                                {t("Products.sortBy")}
                                            </option>
                                            <option value="-total_price">
                                                {t("Products.highestPrice")}
                                            </option>
                                            <option value="total_price">
                                                {t("Products.lowestPrice")}
                                            </option>
                                            <option value="-order__created_at">
                                                {t("newest")}
                                            </option>
                                            <option value="order__created_at">
                                                {t("first")}
                                            </option>
                                        </select>
                                    </div>
                                    <div className="d-flex flex-column mt-4">
                                        <label
                                            htmlFor="contactPersonRole"
                                            className="form-label fw-medium "
                                        >
                                            {t("DeliveryStates.stateOfOrder")}:
                                        </label>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input customradio"
                                                type="radio"
                                                name="stateOfOrder"
                                                id="all"
                                                value="all"
                                                checked={
                                                    localFormData.status ===
                                                    null
                                                }
                                                onChange={() =>
                                                    setLocalFormData({
                                                        ...localFormData,
                                                        shipState: null,
                                                        status: null,
                                                    })
                                                }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="all"
                                            >
                                                {t("DeliveryStates.all")}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input customradio"
                                                type="radio"
                                                name="stateOfOrder"
                                                id="paid"
                                                value="paid"
                                                checked={
                                                    localFormData.status &&
                                                    localFormData.status?.includes(
                                                        "BUYER_PAID"
                                                    )
                                                }
                                                onChange={() =>
                                                    setLocalFormData({
                                                        ...localFormData,
                                                        status: "BUYER_PAID",
                                                    })
                                                }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="paid"
                                            >
                                                {t("DeliveryStates.paid")}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input customradio"
                                                type="radio"
                                                name="stateOfOrder"
                                                id="shipped"
                                                value="shipped"
                                                checked={
                                                    (localFormData.status &&
                                                        localFormData.status?.includes(
                                                            "SHIPPED"
                                                        )) ||
                                                    localFormData.status?.includes(
                                                        "IN_WHOLESTORE"
                                                    )
                                                }
                                                onChange={() =>
                                                    setLocalFormData({
                                                        ...localFormData,
                                                        status: "SHIPPED, IN_WHOLESTORE",
                                                    })
                                                }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="shipped"
                                            >
                                                {t("DeliveryStates.shipped")}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input customradio"
                                                type="radio"
                                                name="stateOfOrder"
                                                id="delivered"
                                                value="delivered"
                                                checked={
                                                    localFormData.status &&
                                                    localFormData.status?.includes(
                                                        "DELIVERED"
                                                    )
                                                }
                                                onChange={() =>
                                                    setLocalFormData({
                                                        ...localFormData,
                                                        status: "DELIVERED",
                                                    })
                                                }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="delivered"
                                            >
                                                {t("DeliveryStates.delivered")}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input customradio"
                                                type="radio"
                                                name="stateOfOrder"
                                                id="refunded"
                                                value="refunded"
                                                checked={
                                                    (localFormData.status &&
                                                        localFormData.status?.includes(
                                                            "CANCELLED"
                                                        )) ||
                                                    localFormData.status?.includes(
                                                        "RETURNED_BACK"
                                                    ) ||
                                                    localFormData.status?.includes(
                                                        "CANCEL_REQUESTED"
                                                    )
                                                }
                                                onChange={() =>
                                                    setLocalFormData({
                                                        ...localFormData,
                                                        status: "CANCELLED, RETURNED_BACK, CANCEL_REQUESTED",
                                                    })
                                                }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="refunded"
                                            >
                                                {t("DeliveryStates.refunded")}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                data-bs-dismiss="modal"
                                ref={closeBtnRef}
                                className="btn btn-gray fs-14"
                            >
                                {t("cancel")}
                            </button>
                            <button
                                type="button"
                                className="btn btn-main fs-14"
                                onClick={onSubmit}
                            >
                                {t("filter")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
