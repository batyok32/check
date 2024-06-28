"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import isEmpty from "@/components/utils/isEmpty";
import { validateRegister } from "@/components/utils/validateForm";
import { useRouter } from "next/navigation";
import { capitalize } from "@/components/utils/jsutils";
import { useAppDispatch } from "@/redux/hooks";
import { register } from "@/redux/actions/authPostActions";
import { useTranslations } from "next-intl";
import PasswordValidator from "@/components/utils/PasswordValidator";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

function RegisterPage() {
    const t = useTranslations("RegisterPage");
    const router = useRouter();
    const submitBtnRef = useRef(null);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        re_password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const [formErrors, setFormErrors] = useState(null);
    const [passwordErrors, setPasswordErrors] = useState([]);

    const { first_name, last_name, email, password, re_password } = formData;

    const onChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        setFormErrors(validateRegister(formData));
    }, [formData]);

    const onSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        dispatch(
            register({ first_name, last_name, email, password, re_password })
        )
            .then((res) => {
                console.log("RES", res);
                if (res?.response?.status && res?.response?.status > 205) {
                    if (res?.response?.status === 500) {
                        toast.error(`${t("errors.serverError")}`, {
                            className: "fs-14",
                        });
                    } else {
                        const firstKey = Object.keys(res.response.data)[0]; // Get the first key
                        const firstMessage = res.response.data[firstKey][0]; // Get the first message from the array under that key

                        if (firstMessage) {
                            console.log("FIRST MESSAGE", firstKey);
                            console.log(
                                "Translkations",
                                t("errors." + firstKey)
                            );
                            toast.error(`${t("errors." + firstKey)}`, {
                                className: "fs-14",
                            });
                        }
                    }
                } else {
                    toast.success(t("pleaseCheckEmail"), {
                        className: "fs-14",
                    });

                    setTimeout(() => {
                        router.push("/auth/wait-forlink");
                    }, 2000);
                }
            })

            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="row mx-0 mt-4 w-100 ">
            <div className="col-11 col-lg-4 mx-auto px-3 py-4 p-md-4 bg-white shadow-sm ">
                <div className="fw-bold text-center fs-5">{t("register")}</div>
                <div className="text-center fs-14 mt-1 ">
                    {t("openNewAccount")}{" "}
                    <Link href="/auth/login" className="main-link ms-1">
                        {t("logIn")}
                    </Link>
                </div>

                <input
                    type="text"
                    className="form-control fs-14 mt-4 rounded-0 border shadow-none"
                    id="first_name"
                    name="first_name"
                    value={first_name}
                    onChange={onChange}
                    placeholder={t("firstName")}
                />
                <input
                    type="text"
                    className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                    id="last_name"
                    name="last_name"
                    value={last_name}
                    onChange={onChange}
                    placeholder={t("lastName")}
                />
                <input
                    type="email"
                    className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder={t("email")}
                />
                <div className="position-relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                        name="password"
                        id="password"
                        value={password}
                        onChange={onChange}
                        placeholder={t("password")}
                    />
                    <div
                        style={{ position: "absolute", right: 10, top: 5 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <IconEyeOff size={18} className="text-main" />
                        ) : (
                            <IconEye size={18} className="text-muted" />
                        )}
                    </div>
                </div>

                <input
                    type={showPassword ? "text" : "password"}
                    className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                    id="re_password"
                    name="re_password"
                    value={re_password}
                    onChange={onChange}
                    placeholder={t("confirmPassword")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") submitBtnRef.current.click();
                    }}
                />

                <PasswordValidator
                    password={password}
                    rePassword={re_password}
                    firstName={first_name}
                    lastName={last_name}
                    email={email}
                    setErrors={setPasswordErrors}
                />
                {password && (
                    <ul className="my-3">
                        {passwordErrors.map((error, index) => (
                            <li
                                key={index}
                                style={{ color: "red" }}
                                className="fs-13"
                            >
                                {error}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    disabled={!isEmpty(formErrors) || passwordErrors.length > 0}
                    onClick={onSubmit}
                    ref={submitBtnRef}
                    className="btn btn-main fs-14 w-100 mt-2 fw-bold rounded-small "
                >
                    {isLoading ? (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">
                                {t("loading")}
                            </span>
                        </div>
                    ) : (
                        t("register")
                    )}
                </button>
                <div className="text-muted mt-3 fs-12">{t("byContinuing")}</div>
                <hr />
                <div className="text-center fs-14 mt-1 ">
                    {t("wantToBecomeSeller")}{" "}
                    <Link href="/business" className="main-link">
                        {t("seller")}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
