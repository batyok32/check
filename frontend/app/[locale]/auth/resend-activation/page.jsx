"use client";
import { resendActivationEmail } from "@/redux/actions/authPostActions";
import { useAppDispatch } from "@/redux/hooks";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

function ResendActivationEmail() {
    const t = useTranslations("ResendActivationEmail");
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const dispatch = useAppDispatch();

    const onSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        dispatch(resendActivationEmail(email))
            .then((res) => {
                if (res.status > 205) {
                    toast.error(t("failedToSendRequest"), {
                        className: "fs-14",
                    });
                } else {
                    toast.success(t("checkEmailForLink"), {
                        className: "fs-14",
                    });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="row mx-0 mt-4 w-100 ">
            <div className="col-11 col-lg-4 mx-auto px-3 py-4 p-md-4 bg-white shadow-sm ">
                <div className="fw-bold text-center fs-5">
                    {t("resendActivationEmail")}
                </div>
                <div className="text-center fs-14 mt-1 ">
                    {t("enterEmailOrPhone")}
                </div>
                <form onSubmit={onSubmit}>
                    <input
                        type="email"
                        className="form-control fs-14 mt-4 rounded-0 border shadow-none"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("email")}
                        required
                    />

                    <button
                        type="submit"
                        className="btn btn-main fs-14 w-100 mt-2 fw-bold rounded-small"
                    >
                        {isLoading ? (
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">
                                    {t("loading")}
                                </span>
                            </div>
                        ) : (
                            t("resend")
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResendActivationEmail;
