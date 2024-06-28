import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Layout({ children }) {
    const t = useTranslations("AuthLayout");

    return (
        <div className="d-flex flex-column min-vh-100">
            <Link href="/">
                <div className="d-flex align-items-center justify-content-center">
                    <div className="bg-white p-3 shadow-sm rounded-1 w-100 d-flex justify-content-center">
                        <img src="/logo2.jpg" height={40} />
                        <img
                            src="/logo3.jpg"
                            height={30}
                            style={{ marginLeft: "-8px" }}
                        />
                    </div>
                </div>
            </Link>
            {children}
            <div className="mt-auto">
                <div className="border-top d-none d-md-flex  flex-wrap px-4 justify-content-center fs-13 text-muted mt-3 pt-3">
                    {t("copyright")}
                    {t("additionalInfo")}
                </div>
            </div>
        </div>
    );
}
