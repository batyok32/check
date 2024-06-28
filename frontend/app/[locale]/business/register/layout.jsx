"use client";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import { useAppSelector } from "@/redux/hooks";
import { IconCheck } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const steps = [
    {
        name: "Business information",
        active: true,
        path: "/business/register/section1",
        section: 1,
    },
    {
        name: "Seller information",
        active: false,
        path: "/business/register/section2",
        section: 2,
    },

    {
        name: "Verification",
        active: false,
        path: "/business/register/section3",
        section: 3,
    },
    // {
    //     name: "Verification",
    //     active: false,
    //     path: "/business/register/section5",
    //     section: 5,
    // },
];

export default function Layout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations("BusinessLayout");
    const { currentSection } = useAppSelector((state) => state.sellerReg);
    const [canShowPage, setCanShowPage] = useState(false);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    // Function to determine the section based on the path
    const sectionFromPath = () => {
        const currentStep = steps.find((step) => pathname.includes(step.path));
        return currentStep ? currentStep.section : null;
    };

    useEffect(() => {
        const section = sectionFromPath();
        console.log("SECTION", section);
        if (!user?.is_seller || !user?.is_verified_seller) {
            if (section !== null && currentSection === section) {
                setCanShowPage(true);
                console.log("CAN SHOW PAGE", section, currentSection);
            } else {
                console.log("CAN NOT SHOW PAGE", section, currentSection);

                setCanShowPage(false);
                router.push(`/business/register/section${currentSection}`);
            }
        } else {
            setCanShowPage(false);
            // toast.error(
            //     "You are already seller, you can't register twice as seller",
            //     { className: "fs-14" }
            // );
            router.push(`/seller`);
        }
    }, [currentSection, pathname, router]);

    if (!canShowPage) {
        return (
            <>
                <LoadingScreen />
            </>
        );
    }
    if (!isAuthenticated || !localStorage.getItem("TOKEN_KEY")) {
        return router.push("/auth/login");
    }

    if (user?.is_verified_seller) {
        toast.warning("Sorry, You can not be seller twice.", {
            className: "fs-14",
        });
        return router.push("/seller");
    }
    if (user?.is_seller) {
        toast.warning(
            "Please wait while your old request to be seller is processed.",
            { className: "fs-14" }
        );
        return router.push("/");
    }
    return (
        <>
            <div className="row d-none d-md-flex row-cols-3 mx-0 align-items-center mt-4">
                {steps.map((step, index) => (
                    <div className="px-0" key={step.section}>
                        <div className="position-relative d-flex justify-content-center align-items-center">
                            <div
                                className={`d-flex justify-content-center align-items-center fw-bold ${
                                    currentSection >= step.section
                                        ? "bg-main text-white"
                                        : "border bg-white text-muted"
                                }`}
                                style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: "50%",
                                    zIndex: 10,
                                }}
                            >
                                {currentSection > step.section ? (
                                    <IconCheck size={24} />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <div
                                className={`border position-absolute w-100 ${
                                    currentSection >= step.section
                                        ? "border-main"
                                        : ""
                                }`}
                            ></div>
                        </div>
                        <div
                            className={`fs-14 text-center text-${
                                currentSection >= step.section
                                    ? "main"
                                    : "muted"
                            } fw-bold mt-2`}
                        >
                            {t(step.name)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="row d-md-none row-cols-3 mx-0 align-items-start mt-4">
                {steps.map((step, index) => (
                    <div className="px-0" key={step.section}>
                        <div className="position-relative d-flex justify-content-center align-items-center">
                            <div
                                className={`d-flex fs-14 justify-content-center align-items-center fw-bold ${
                                    currentSection >= step.section
                                        ? "bg-main text-white"
                                        : "border bg-white text-muted"
                                }`}
                                style={{
                                    height:
                                        currentSection >= step.section
                                            ? 40
                                            : 40,
                                    width:
                                        currentSection >= step.section
                                            ? 40
                                            : 40,
                                    borderRadius: "50%",
                                    zIndex: 10,
                                }}
                            >
                                {currentSection <= step.section && index + 1}

                                {currentSection > step.section && (
                                    <IconCheck size={24} />
                                )}
                            </div>
                            <div
                                className={`border position-absolute w-100 ${
                                    currentSection >= step.section
                                        ? "border-main"
                                        : ""
                                }`}
                            ></div>
                        </div>
                        {currentSection == step.section && (
                            <div
                                className={`fs-14 text-center overflow-hidden text-${
                                    currentSection >= step.section
                                        ? "main"
                                        : "muted"
                                } fw-bold mt-2`}
                            >
                                {t(step.name)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {children}
        </>
    );
}
