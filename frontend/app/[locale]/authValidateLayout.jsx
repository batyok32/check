"use client";

import LoadingScreen from "@/components/Loading/LoadingScreen";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { fetchAddresses, isLoggedIn } from "@/redux/actions/authActions";
import { useTranslations } from "next-intl";

export const AuthValidateLayout = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations();

    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { refetchAddresses, chosenAddress } = useAppSelector(
        (state) => state.addressBook
    );
    const dispatch = useAppDispatch();
    const [canShowPage, setCanShowPage] = useState(false);

    useEffect(() => {
        dispatch(isLoggedIn()).then((res) => {
            setCanShowPage(true);
        });
    }, []);

    useEffect(() => {
        if (isAuthenticated && user && refetchAddresses) {
            dispatch(fetchAddresses());
        }
    }, [refetchAddresses]);

    if (canShowPage) {
        if (
            !isAuthenticated &&
            ["/account", "/business/register/", "/seller", "/checkout"].some(
                (prefix) => pathname.includes(prefix)
            )
        ) {
            // let text = t("log_required");
            let text = t("log_required");
            toast.error(`${text}`, { className: "fs-14" });
            return router.push("/auth/login");
        } else if (
            isAuthenticated &&
            ["/auth"].some((prefix) => pathname.includes(prefix))
        ) {
            const afterLogin = Cookie.get("after_login_page");

            if (afterLogin) {
                Cookie.remove("after_login_page");
                router.push(afterLogin);
                return;
            } else {
                let text = t("logged_in");
                // let text = t("logged_in");
                toast.warning(`${text}`, {
                    className: "fs-14",
                });
                router.push("/");
                return;
            }
        }
        return <>{children}</>;
    } else {
        return (
            <>
                <LoadingScreen />
                {children}
            </>
        );
    }
};
