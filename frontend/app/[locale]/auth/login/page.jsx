"use client";
import { validateLogin } from "@/components/utils/validateForm";
import Link from "next/link";
import isEmpty from "@/components/utils/isEmpty";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/features/authSlice";
import { login } from "@/redux/actions/authPostActions";
import { getMe } from "@/redux/actions/authActions";
import { useTranslations } from "next-intl";

function LoginPage() {
    const t = useTranslations("LoginPage");
    const submitBtnRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState(null);

    const { email, password } = formData;

    const onChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        setFormErrors(validateLogin(formData));
    }, [formData]);

    const onSubmit = (event) => {
        event.preventDefault();

        if (isEmpty(formErrors)) {
            setIsLoading(true);
            dispatch(login({ email, password }))
                .then((res) => {
                    if (res?.status === 200) {
                        dispatch(setAuth(res.data));
                        toast.success(t("signIn"), {
                            className: "fs-14",
                        });
                        dispatch(getMe());
                        window.location.reload();
                    } else {
                        try {
                            const firstKey = Object?.keys(res?.data)[0]; // Get the first key
                            const firstMessage = res?.data[firstKey]; // Get the first message from the array under that key

                            toast.error(`${t(firstMessage)}`, {
                                className: "fs-14",
                            });
                        } catch (error) {
                            toast.error(res, { className: "fs-14" });
                        }
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    return (
        <div className="row mx-0 mt-4 w-100 ">
            <div className="col-11 col-lg-4 mx-auto px-3 py-4 p-md-4 bg-white shadow-sm ">
                <div className="fw-bold text-center fs-5">{t("signIn")}</div>
                <div className="text-center fs-14 mt-1 ">
                    {t("logInToYourAccount")}{" "}
                    <Link href="/auth/register" className="main-link">
                        {t("createOne")}
                    </Link>
                </div>
                <input
                    type="email"
                    className="form-control fs-14 mt-4 rounded-0 border shadow-none"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder={t("email")}
                />
                <input
                    type="password"
                    className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                    name="password"
                    id="password"
                    value={password}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") submitBtnRef.current.click();
                    }}
                    placeholder={t("password")}
                />
                <div className="d-flex justify-content-end align-items-center">
                    <Link
                        href="/auth/reset-password"
                        className="text-muted fs-14 pt-2 main-link"
                    >
                        {t("forgotPassword")}
                    </Link>
                </div>

                <button
                    disabled={!isEmpty(formErrors)}
                    onClick={onSubmit}
                    ref={submitBtnRef}
                    className="btn btn-main fs-14 w-100 mt-2 fw-bold rounded-small"
                >
                    {isLoading ? (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">
                                {t("loading")}
                            </span>
                        </div>
                    ) : (
                        t("signIn")
                    )}
                </button>
                <div className="text-muted mt-3 fs-12">{t("byContinuing")}</div>
            </div>
        </div>
    );
}

export default LoginPage;
