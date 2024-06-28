import { useTranslations } from "next-intl";

function FooterHome() {
    const t = useTranslations("Footer");

    return (
        <div className="bg-halfblack py-4">
            <div className="container-xl pb-5 pb-md-0">
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 cd  mx-0 fs-14 text-white mt-5">
                    <div>
                        <div className="fw-bold text-white mb-2 ">
                            {t("getToKnowUs")}
                        </div>
                        <div>{t("careers")}</div>
                        <div>{t("about")}</div>
                        <div>{t("accessibility")}</div>
                        <div>{t("sustainability")}</div>
                        <div>{t("pressCenter")}</div>
                        <div>{t("investorRelations")}</div>
                    </div>
                    <div>
                        <div className="fw-bold text-white mb-2">
                            {t("makeMoneyWithUs")}
                        </div>
                        <div>{t("sell")}</div>
                        <div>{t("supplyToAmazon")}</div>
                        <div>{t("protectAndBuildBrand")}</div>
                        <div>{t("becomeAffiliate")}</div>
                        <div>{t("becomeDeliveryDriver")}</div>
                        <div>{t("startPackageDeliveryBusiness")}</div>
                        <div>{t("advertiseProducts")}</div>
                        <div>{t("selfPublish")}</div>
                        <div>{t("seeMoreWaysToMakeMoney")}</div>
                    </div>

                    <div>
                        <div className="fw-bold text-white mb-2">
                            {t("paymentProducts")}
                        </div>
                        <div>{t("shopWithPoints")}</div>
                        <div>{t("creditCardMarketplace")}</div>
                        <div>{t("reloadBalance")}</div>
                        <div>{t("giftCards")}</div>
                        <div>{t("currencyConverter")}</div>
                    </div>
                    <div className="py-2">
                        <div className="fw-bold text-white mb-2 ">
                            {t("letUsHelpYou")}
                        </div>
                        <div>{t("yourAccount")}</div>
                        <div>{t("yourOrders")}</div>
                        <div>{t("shippingRatesAndPolicies")}</div>
                        <div>{t("returnsAndReplacements")}</div>
                        <div>{t("manageContentAndDevices")}</div>
                        <div>{t("productSafetyAlerts")}</div>
                        <div>{t("help")}</div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}

export default FooterHome;
