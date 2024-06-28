"use client";
import { useTranslations } from "next-intl";
import React, { useRef } from "react";

export default function CancelScheduleModal({ children, submitFn }) {
    const t = useTranslations();
    const closeBtnRef = useRef(null);
    const onSubmit = () => {
        closeBtnRef.current.click();
        submitFn();
    };
    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target="#cancelScheduleModal"
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id="cancelScheduleModal"
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
                                Cancel schedule
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            Cancelling schedule
                            {/* Input for notes */}
                            {/* Saying that cancellation wills */}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                onClick={onSubmit}
                                className="btn btn-gray fs-14"
                            >
                                {t("LogoutModal.Logout")}
                            </button>
                            <button
                                type="button"
                                className="btn btn-main fs-14"
                                data-bs-dismiss="modal"
                                ref={closeBtnRef}
                            >
                                {t("LogoutModal.Cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
