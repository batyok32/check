"use client";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

export default function LogoutModal({ children }) {
    const dispatch = useAppDispatch();
    const t = useTranslations();
    const closeBtnRef = useRef(null);
    const onSubmit = () => {
        closeBtnRef.current.click();

        dispatch(logout());
    };
    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target="#logoutModal"
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id="logoutModal"
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
                                {t("LogoutModal.confirmLogout")}
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {t("LogoutModal.confirmLogoutText")}
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
