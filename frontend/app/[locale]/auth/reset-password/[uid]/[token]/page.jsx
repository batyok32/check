"use client";
import isEmpty from "@/components/utils/isEmpty";
import { validateResetPassword } from "@/components/utils/validateForm";
import { resetPasswordConfirm } from "@/redux/actions/authPostActions";
import { useAppDispatch } from "@/redux/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export default function ResetPasswordTokenPage() {
    const t = useTranslations("ResetPasswordTokenPage");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const params = useParams();
    const { uid, token } = params;

    const [formData, setFormData] = useState({
        new_password: "",
        re_new_password: "",
    });
    const [formErrors, setFormErrors] = useState(null);
    const { new_password, re_new_password } = formData;

    const onChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        setFormErrors(validateResetPassword(formData));
    }, [formData]);

    const dispatch = useAppDispatch();

    const onSubmit = (event) => {
        event.preventDefault();

        if (uid && token) {
            dispatch(
                resetPasswordConfirm({
                    uid,
                    token,
                    new_password,
                    re_new_password,
                })
            )
                .then((res) => {
                    toast.success(t("passwordResetSuccessful"), {
                        className: "fs-14",
                    });
                    router.push("/auth/login");
                })
                .catch((error) => {
                    const firstKey = Object.keys(error.data)[0]; // Get the first key
                    const firstMessage = error.data[firstKey][0]; // Get the first message from the array under that key

                    toast.error(`${firstMessage}`, { className: "fs-14" });
                });
        }
    };

    return (
        <div className="row mx-0 mt-4 w-100 ">
            <div className="col-11 col-lg-4 mx-auto px-3 py-4 p-md-4 bg-white shadow-sm ">
                <div className="fw-bold text-center fs-5">
                    {t("resetPasswordConfirm")}
                </div>
                <div className="text-center fs-14 mt-1 ">
                    {t("enterNewPassword")}
                </div>
                <form onSubmit={onSubmit}>
                    <input
                        type="password"
                        className="form-control fs-14 mt-4 rounded-0 border shadow-none"
                        name="new_password"
                        id="new_password"
                        value={new_password}
                        onChange={onChange}
                        placeholder={t("newPassword")}
                    />
                    <input
                        type="password"
                        className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                        id="re_new_password"
                        name="re_new_password"
                        value={re_new_password}
                        onChange={onChange}
                        placeholder={t("confirmNewPassword")}
                    />

                    <button
                        type="submit"
                        disabled={!isEmpty(formErrors)}
                        className="btn btn-main fs-14 w-100 mt-2 fw-bold rounded-small"
                    >
                        {isLoading ? (
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">
                                    {t("loading")}
                                </span>
                            </div>
                        ) : (
                            t("resetPasswordButton")
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
