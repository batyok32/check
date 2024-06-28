"use client";
import { useAppDispatch } from "@/redux/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

export default function FilterCasesModal({
    children,
    filterData,
    setFilterData,
}) {
    const t = useTranslations();
    const closeBtnRef = useRef(null);
    const [localFormData, setLocalFormData] = useState({
        status: null,
        sort: null,
    });

    useEffect(() => {
        setLocalFormData(filterData);
    }, [filterData]);

    const onSubmit = () => {
        console.log("LOCAL FORM DATA", localFormData);
        setFilterData({ ...filterData, ...localFormData });
        closeBtnRef.current.click();
    };

    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target="#filterCasesModal"
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id="filterCasesModal"
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
                                    <div>
                                        <div className="my-2  fw-medium">
                                            {t("filterByStatus")}
                                        </div>
                                        <select
                                            className="form-select fs-14 rounded-small shadow-none border"
                                            aria-label="Default select example"
                                            value={localFormData.status}
                                            onChange={(e) => {
                                                if (e.target.value === "all") {
                                                    setLocalFormData({
                                                        ...localFormData,
                                                        status: null,
                                                    });
                                                    return;
                                                }
                                                setLocalFormData({
                                                    ...localFormData,
                                                    status: e.target.value,
                                                });
                                            }}
                                        >
                                            <option value="" disabled>
                                                {t("filterBy")}
                                            </option>
                                            <option value="pending">
                                                {t("pending")}
                                            </option>
                                            <option value="resolved">
                                                {t("resolved")}
                                            </option>
                                            <option value="closed">
                                                {t("closed")}
                                            </option>
                                            <option value="all">
                                                {t("all")}
                                            </option>
                                        </select>
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
