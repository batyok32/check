"use client";
import HelpColumnItem from "@/components/SellerComps/HelpColumnItem/HelpColumnItem";
import { getMe } from "@/redux/actions/authActions";
import { flushBusinessRegistrationData } from "@/redux/features/sellerRegisterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const t = useTranslations("BusinessSuccess");
    const router = useRouter();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(flushBusinessRegistrationData());
        // // console.log("RES Successfully", res);
        dispatch(getMe());
    }, []);

    if (user.is_seller && !user.is_verified_seller) {
        return (
            <div>
                <div className="row mt-3 mx-0 px-3">
                    <div className="col-9 ">
                        <div className="bg-white p-4 shadow-sm rounded-small me-md-2 text-center">
                            <h2 className="fw-bold">
                                <span className="text-main">
                                    {t("welcome")}
                                </span>
                            </h2>
                            <p className="fs-14">
                                {t("verificationRequestMessage")}
                            </p>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="bg-white p-4 shadow-sm rounded-small">
                            <h6 className="fw-bold mb-2">{t("nextSteps")}</h6>
                            <ol className="fs-14">
                                <li>{t("waitContactTeam")}</li>
                                <li>{t("waitDocumentsVerify")}</li>
                                <li>{t("accessSellerAccount")}</li>
                            </ol>
                        </div>
                    </div>
                </div>
                {/* <div className="py-3 px-3">
                    <div className="bg-white shadow-sm p-3">
                        <div className="row row-cols-5 mx-0 ">
                            <HelpColumnItem />
                            <HelpColumnItem />
                            <HelpColumnItem />
                            <HelpColumnItem />
                            <HelpColumnItem />
                        </div>
                    </div>
                </div> */}
            </div>
        );
    } else {
        return router.push("/");
    }
}
