"use client";

import LogoutButton from "@/components/AccountPageComponents/LogoutModal/LogoutButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { editProfile } from "@/redux/actions/authPostActions"; // Import the editProfile action
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations("ProfilePage");
    const { user } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        first_name: user?.first_name,
        last_name: user?.last_name,
    });
    const dispatch = useAppDispatch();
    const { first_name, last_name } = formData;
    const onChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    const onSubmit = (event) => {
        event.preventDefault();
        if (first_name.trim() && last_name.trim()) {
            dispatch(editProfile(formData))
                .then((res) => {
                    toast.success(t("profileChanged"), {
                        className: "fs-14",
                    });
                })
                .catch((error) => {
                    toast.error(t("profileNotChanged"), {
                        className: "fs-14",
                    });
                });
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user?.first_name,
                last_name: user?.last_name,
            });
        }
    }, [user]);

    return (
        <div className="mt-3 fs-14">
            <div className="col-12 col-md-10 col-lg-6  mx-auto">
                <div className="px-3 py-4 p-md-4  bg-white  mb-2 shadow-sm">
                    <div className="fw-bold  fs-5">{t("editProfile")}</div>
                    <div className=" fs-14 mt-1">
                        {t("enterFirstNameAndLastName")}
                    </div>
                    <form className="mt-2 " onSubmit={onSubmit}>
                        <div>
                            <input
                                type="text"
                                className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                                id="first_name"
                                name="first_name"
                                value={first_name}
                                onChange={onChange}
                                placeholder={t("firstName")}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                                id="last_name"
                                name="last_name"
                                value={last_name}
                                onChange={onChange}
                                placeholder={t("lastName")}
                                required
                            />
                        </div>

                        <div className="col-12 d-flex justify-content-center mt-2">
                            <button
                                type="submit"
                                disabled={
                                    !first_name?.trim() && !last_name?.trim()
                                }
                                className="btn btn-main fs-14  px-5 mt-2 fw-bold rounded-small"
                            >
                                {t("edit")}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="px-0  ps-md-2 bg-white mb-2 ">
                    <div className="bg-white shadow-sm px-3 py-4 p-md-4 mt-2 mt-md-0">
                        <div className="fw-bold  fs-5">
                            {t("profileDetails")}
                        </div>
                        <div className=" fs-14 mt-1 mb-2">
                            {t("yourProfileDetails")}
                        </div>
                        <div>
                            <div className="row row-cols-2">
                                <div className="text-muted">
                                    {t("firstName")}:
                                </div>
                                <div>
                                    <strong>{user?.first_name}</strong>
                                </div>
                            </div>
                            <div className="row row-cols-2">
                                <div className="text-muted">
                                    {t("lastName")}:
                                </div>
                                <div>
                                    <strong>{user?.last_name}</strong>
                                </div>
                            </div>
                            <div className="row row-cols-2 flex-wrap">
                                <div className="text-muted">{t("email")}:</div>
                                <div className="truncate-overflow-1">
                                    <strong>{user?.email}</strong>
                                </div>
                            </div>
                            {user?.is_verified_seller && (
                                <div className="row row-cols-2">
                                    <div className="text-muted">
                                        {t("verifiedSeller")}:
                                    </div>
                                    <div>
                                        <strong>{t("yes")}</strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="px-0 bg-white shadow-sm">
                    <div className=" px-3 py-4 p-md-4 mt-2 mt-md-0">
                        <div className="fw-bold  fs-5">{t("logout")}</div>
                        <div className=" fs-14 mt-1 mb-2">
                            {t("loggingOut")}
                        </div>
                        <div
                            id="logout"
                            className="d-flex justify-content-center mt-3"
                        >
                            <LogoutButton>
                                <button className="btn  rounded-small px-5 py-2 btn-danger fs-15 fw-bold">
                                    {t("logout")}
                                </button>
                            </LogoutButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
