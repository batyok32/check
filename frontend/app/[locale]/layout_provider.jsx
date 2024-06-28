"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MobileHeader from "@/components/MobileHeader/MobileHeader";
import MobileBottom from "@/components/MobileBottom/MobileBottom";
import { useEffect, useRef } from "react";
import MobileOffcanvas from "@/components/Offcanvas/MobileOffcanvas";
import {
    fetchCategories,
    fetchFullCategories,
} from "@/redux/actions/shopActions";
import { gotCategories, gotFullCategories } from "@/redux/features/shopSlice";
import { useAppDispatch } from "@/redux/hooks";
import CartTaxCalculateLayout from "@/components/Layouts/CartTaxCalculateLayout";
import { useTranslations } from "next-intl";
import FooterHome from "@/components/Footer/FooterHome";
// import { Head } from "next/document";

export const LayoutProvider = ({ children }) => {
    const pathname = usePathname();
    // console.log("PATHNAME", pathname);
    const offcanvasRef = useRef();
    const dispatch = useAppDispatch();
    const t = useTranslations("CategoriesList");

    useEffect(() => {
        dispatch(fetchCategories()).then((res) => {
            const translatedCategories = res.data.map((category) => ({
                ...category,
                name: t(category.name),
                childrens: category?.childrens?.map((child) => ({
                    ...child,
                    name: t(child.name),
                })),
            }));
            dispatch(gotCategories(translatedCategories));
        });
        dispatch(fetchFullCategories()).then((res) => {
            const translatedCategories = res.data.map((category) => ({
                ...category,
                name: t(category.name),
                childrens: category?.childrens?.map((child) => ({
                    ...child,
                    name: t(child.name),
                })),
            }));
            dispatch(gotFullCategories(translatedCategories));
        });
    }, []);

    // useEffect(() => {
    //     if ("serviceWorker" in navigator) {
    //         window.addEventListener("load", () => {
    //             navigator.serviceWorker.register("/sw.js");
    //         });
    //     }
    // }, []);

    return (
        <>
            <CartTaxCalculateLayout />
            <MobileOffcanvas>
                <div
                    role="button"
                    ref={offcanvasRef}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight2"
                    aria-controls="offcanvasRight2"
                ></div>
            </MobileOffcanvas>
            {!["/auth", "/checkout", "/seller", "/business"].some((prefix) =>
                pathname.includes(prefix)
            ) && (
                <div className="d-none d-sm-block">
                    <Header offcanvasRef={offcanvasRef} />
                </div>
            )}
            {!["/auth", "/checkout", "/seller", "/business"].some((prefix) =>
                pathname.includes(prefix)
            ) && (
                <div className="d-block d-sm-none">
                    <MobileHeader offcanvasRef={offcanvasRef} />
                </div>
            )}

            {children}

            {!["/seller", "/business"].some((prefix) =>
                pathname.includes(prefix)
            ) && (
                <div className="d-sm-none mt-5 pt-5">
                    <MobileBottom />
                </div>
            )}
            <div className="mt-5"></div>
            {!["/auth", "/checkout", "/seller", "/business"].some((prefix) =>
                pathname.includes(prefix)
            ) ? (
                <div className=" ">
                    <FooterHome />
                </div>
            ) : (
                <div className="d-none ">
                    <Footer />
                </div>
            )}
        </>
    );
};
