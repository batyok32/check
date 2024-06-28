"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { IconMail } from "@tabler/icons-react";

function WaitForLinkPage() {
    const t = useTranslations("WaitForLinkPage");

    return (
        <div className="row mx-0 mt-4 w-100 ">
            <div className="col-11 col-lg-4 mx-auto px-3 py-4 p-md-4 bg-white shadow-sm ">
                <div className="text-center mt-3">
                    <IconMail size={48} className="text-primary" />
                </div>
                <div className="fw-bold text-center fs-5 mt-3">
                    {t("title")}
                </div>

                <div className="text-center fs-14 mt-3">{t("message")}</div>
                <div className="text-center fs-14 mt-4">
                    <Link href="/auth/login" className="main-link">
                        {t("logIn")}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default WaitForLinkPage;
