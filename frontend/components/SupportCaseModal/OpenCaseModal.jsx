"use client";
import { openSupportCase } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export default function OpenCaseModal({ children, initialData }) {
    const t = useTranslations("OpenCaseModal");
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        message: "",
        subject: "",
    });
    const closeBtnRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = () => {
        if (
            formData.message.trim().length > 0 &&
            formData.subject.trim().length > 0
        ) {
            dispatch(openSupportCase(formData)).then((res) => {
                if (res.status > 205) {
                    toast.error(t("caseError"), { className: "fs-14" });
                } else {
                    closeBtnRef.current.click();
                    toast.success(t("caseSuccess"), { className: "fs-14" });
                }
            });
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target="#openCaseModal"
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id="openCaseModal"
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
                                {t("openCase")}
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        {t("subject")}
                                    </label>
                                    <input
                                        className="form-control rounded-small shadow-none border fs-15"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("subjectPlaceholder")}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        {t("message")}
                                    </label>
                                    <textarea
                                        className="form-control rounded-small shadow-none border fs-15"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("messagePlaceholder")}
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-gray fs-14"
                                data-bs-dismiss="modal"
                                ref={closeBtnRef}
                            >
                                {t("cancel")}
                            </button>
                            <button
                                type="button"
                                onClick={onSubmit}
                                className="btn btn-main  fs-14"
                            >
                                {t("submit")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
