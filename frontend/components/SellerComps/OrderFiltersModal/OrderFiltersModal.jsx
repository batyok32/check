"use client";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRef } from "react";
// import { CategoryOption } from "./CategoryOption";
// import { CountryOption } from "./CountryOption";

export default function OrderFiltersModal({
    children,

    filterData,
    setFilterData,
}) {
    const closeBtnRef = useRef(null);

    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target="#OrderFiltersModal"
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id="OrderFiltersModal"
                // tabIndex="-1"
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
                                More filters
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
                                <div className="bg-white p-3 ">Hllo</div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-main fs-14"
                                data-bs-dismiss="modal"
                                ref={closeBtnRef}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
