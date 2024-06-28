"use client";

import { useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

export const RestrictionSellerLayout = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const t = useTranslations("Seller");
    // If not user.is_seller
    // If not user.is_verified_seller

    if (
        isAuthenticated &&
        user &&
        user?.is_seller === true &&
        user?.is_verified_seller == true
    ) {
        return <>{children}</>;
    } else {
        toast.error(t("dontHaveAccess"), { className: "fs-14" });
        router.push("/");
    }
};
