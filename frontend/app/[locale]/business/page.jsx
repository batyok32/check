"use client";
import { useAppSelector } from "@/redux/hooks";
import {
    IconBook,
    IconCalculator,
    IconMoneybag,
    IconSquareCheck,
} from "@tabler/icons-react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations("Business");
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const router = useRouter();

    const onSubmit = () => {
        // sends to login page with adding cookie of seller
        if (isAuthenticated) {
            router.push("/business/register/section1");
        } else {
            Cookie.set("after_login_page", "/business/register/section1", {
                expires: 1 / 24,
            });
            router.push("/auth/login/");
        }
    };

    return (
        <div>
            <div className="py-5 px-5 mb-5 text-center">
                <div className="fs-1 fw-bolder ">
                    {t("becomeSeller")}
                    <br /> YuuSell{" "}
                    <span className="text-main">{t("seller")}</span>
                </div>
                <div
                    onClick={onSubmit}
                    className="btn btn-main fs-15 px-3 rounded-small fw-bold mt-3 "
                >
                    {t("startNow")}
                </div>
            </div>
            <div className="row mx-0 row-gap-2 px-md-3 mt-3 mb-4 border-top border-bottom py-5">
                <div className="col-md-4 px-1">
                    <div className="bg-white px-4 px-md-5 py-4 rounded-small shadow-sm">
                        <div className="position-relative d-flex justify-content-center mb-3">
                            <div
                                className="bg-blur-main fw-bold shadow-sm "
                                style={{
                                    borderRadius: "50%",
                                    height: 100,
                                    width: 100,
                                }}
                            ></div>
                            <div
                                className="position-absolute  fw-bold fs-4 text-main"
                                style={{ top: 8 }}
                            >
                                <IconMoneybag size={72} />
                            </div>
                        </div>

                        <div className="fw-bold fs-5 text-dark">
                            {t("profitableTerms")}
                        </div>
                        <div className="fs-14 mt-2">
                            {t("profiltableTermsDescription")}
                        </div>
                    </div>
                </div>
                <div className="col-md-4 px-1">
                    <div className="bg-white px-4 px-md-5 py-4 rounded-small shadow-sm">
                        <div className="position-relative d-flex justify-content-center mb-3">
                            <div
                                className="bg-blur-main fw-bold shadow-sm "
                                style={{
                                    borderRadius: "50%",
                                    height: 100,
                                    width: 100,
                                }}
                            ></div>
                            <div
                                className="position-absolute  fw-bold fs-4 text-main"
                                style={{ top: 15 }}
                            >
                                <IconCalculator size={72} />
                            </div>
                        </div>

                        <div className="fw-bold fs-5 text-dark">
                            {t("powerfulTools")}
                        </div>
                        <div className="fs-14 mt-2">
                            {t("powerfulToolsDesc")}
                        </div>
                    </div>
                </div>
                <div className="col-md-4 px-1">
                    <div className="bg-white px-4 px-md-5 py-4 rounded-small shadow-sm">
                        <div className="position-relative d-flex justify-content-center mb-3">
                            <div
                                className="bg-blur-main fw-bold shadow-sm "
                                style={{
                                    borderRadius: "50%",
                                    height: 100,
                                    width: 100,
                                }}
                            ></div>
                            <div
                                className="position-absolute  fw-bold fs-4 text-main"
                                style={{ top: 15 }}
                            >
                                <IconBook size={72} />
                            </div>
                        </div>

                        <div className="fw-bold fs-5 text-dark">
                            {t("supportAndTraining")}
                        </div>
                        <div className="fs-14 mt-2">
                            {t("supportAndTrainingDesc")}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mx-0 px-md-3 mt-3 row-gap-2 mb-4 mb-md-0">
                <div className="col-md-8">
                    <div className="bg-white rounded-small shadow-sm px-2 px-md-5 py-4 ">
                        <div className="fs-5 fw-bold text-black text-center mb-3 py-3">
                            {t("stepsToBecomeSeller")}
                        </div>
                        <div className="d-flex align-items-center gap-3 mb-4 pb-2">
                            <div className="position-relative">
                                <div
                                    className="bg-blur-main fw-bold shadow-sm "
                                    style={{
                                        borderRadius: "50%",
                                        height: 50,
                                        width: 50,
                                    }}
                                ></div>
                                <div
                                    className="position-absolute  fw-bold fs-4 text-main"
                                    style={{ top: 3, left: 18 }}
                                >
                                    1
                                </div>
                            </div>
                            <div>
                                <div className="fs-6 fw-bold text-black mb-1">
                                    {t("provideInformationAndDocuments")}
                                </div>
                                <div className="fs-15">
                                    {t("provideInformationAndDocumentsDesc")}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 mb-4 pb-2">
                            <div className="position-relative">
                                <div
                                    className="bg-blur-main fw-bold shadow-sm "
                                    style={{
                                        borderRadius: "50%",
                                        height: 50,
                                        width: 50,
                                    }}
                                ></div>
                                <div
                                    className="position-absolute  fw-bold fs-4 text-main"
                                    style={{ top: 3, left: 15 }}
                                >
                                    2
                                </div>
                            </div>
                            <div>
                                <div className="fs-6 fw-bold text-black mb-1">
                                    {t("verifySubmission")}
                                </div>
                                <div className="fs-15">
                                    {t("verifySubmissionDesc")}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="position-relative">
                                <div
                                    className="bg-blur-main fw-bold shadow-sm "
                                    style={{
                                        borderRadius: "50%",
                                        height: 50,
                                        width: 50,
                                    }}
                                ></div>
                                <div
                                    className="position-absolute  fw-bold fs-4 text-main"
                                    style={{ top: 3, left: 15 }}
                                >
                                    3
                                </div>
                            </div>
                            <div>
                                <div className="fs-6 fw-bold text-black mb-1">
                                    {t("getVerifiedAndStartSelling")}
                                </div>
                                <div className="fs-15">
                                    {t("getVerifiedAndStartSellingDesc")}
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={onSubmit}
                            className="d-flex justify-content-center align-items-center pt-3"
                        >
                            <div className="btn btn-main fs-14 rounded-small fw-bold px-4">
                                {t("startNow")}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="bg-white rounded-small shadow-sm px-3 py-3 ">
                        <div className="fs-6 fw-bold text-black  mb-3 ">
                            {t("whatYouWillNeed")}
                        </div>
                        <div className="d-flex gap-2 align-items-center fs-14 mb-1">
                            <div>
                                <IconSquareCheck
                                    size={18}
                                    className="text-main"
                                />
                            </div>
                            <div>{t("validIDOrPassport")}</div>
                        </div>
                        <div className="d-flex gap-2 align-items-center fs-14 mb-1">
                            <div>
                                <IconSquareCheck
                                    size={18}
                                    className="text-main"
                                />
                            </div>
                            <div>{t("bankStatement")}</div>
                        </div>
                        <div className="d-flex gap-2 align-items-center fs-14 mb-1">
                            <div>
                                <IconSquareCheck
                                    size={18}
                                    className="text-main"
                                />
                            </div>
                            <div>{t("creditCard")}</div>
                        </div>
                        <div className="d-flex gap-2 align-items-center fs-14 mb-1">
                            <div>
                                <IconSquareCheck
                                    size={18}
                                    className="text-main"
                                />
                            </div>
                            <div>{t("mobilePhone")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
