"use client";
import { activation } from "@/redux/actions/authPostActions";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";

let stateThatShouldNotChange = [];
// let statusOfPage = "Waiting";

export default function Activation({ params }) {
    const t = useTranslations("Activation");
    const router = useRouter();
    const dispatch = useAppDispatch();
    // const [statusOfPage, setStatusOfPage] = useState("Waiting");
    const { uid, token } = params;
    const [isLoading, setIsLoading] = useState(false);
    const [canStart, setCanStart] = useState(false);
    const [statusOfPage, setStatusOfPage] = useState("Waiting");

    useEffect(() => {
        if (
            uid &&
            token &&
            statusOfPage === "Waiting" &&
            !isLoading &&
            stateThatShouldNotChange.length < 1
        ) {
            activateAccount();
            stateThatShouldNotChange.push("Started");
        }
    }, [uid, token, statusOfPage, isLoading]);

    const activateAccount = async () => {
        setIsLoading(true);
        await dispatch(activation({ uid, token })).then((res) => {
            console.log("RES SUL", res);
            if (res.status > 205) {
                // statusOfPage = "Inactive";
                setStatusOfPage("Inactive");
                toast.error(t("activationLinkInvalid"), { className: "fs-14" });
            } else {
                // statusOfPage = "Active";
                toast.success(t("accountActive"), { className: "fs-14" });
                setStatusOfPage("Active");
                console.log("SETTED ACTIVE", statusOfPage);

                setTimeout(() => {
                    router.push("/auth/login/");
                }, 1500);
            }
            console.log("Status of page", statusOfPage);

            setIsLoading(false);
        });
    };

    if (statusOfPage === "Waiting") {
        return (
            <div className="text-center py-5">
                <div className="h3">{t("activatingAccount")}</div>
                <div className="spinner-border text-main my-3" role="status">
                    <span className="visually-hidden">{t("loading")}</span>
                </div>
                <div>{t("thankYouPatience")}</div>
            </div>
        );
    } else if (statusOfPage === "Active") {
        return (
            <div className="text-center py-5">
                <div className="h3">{t("accountActive")}</div>
                <div className="spinner-border text-main my-3" role="status">
                    <span className="visually-hidden">{t("loading")}</span>
                </div>
                <div>{t("thankYouJoining")}</div>
            </div>
        );
    }
    return (
        <div className="text-center py-5">
            <>
                <div className="h3">{t("activationLinkInvalid")}</div>
                <Link className="fw-medium " href="/auth/resend-activation">
                    <span className="text-main">
                        {t("resendActivationEmail")}
                    </span>
                </Link>
            </>
        </div>
    );
}
