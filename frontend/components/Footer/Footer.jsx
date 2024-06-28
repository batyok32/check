import { useTranslations } from "next-intl";

function Footer() {
    const t = useTranslations("Footer");

    return (
        <div>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 cd  mx-0 fs-14 text-lightgray mt-5">
                <div className="px-sm-5 pt-0 py-2">
                    <img
                        src="/products/qr-code-1.png"
                        alt=""
                        className="img-fluid"
                    />
                    <div className="text-center fw-medium">
                        {t("downloadApp")}
                    </div>
                </div>

                <div>
                    <div className="fw-medium text-black mb-2 ">
                        {t("getToKnowUs")}
                    </div>
                    <div>{t("careers")}</div>
                    <div>{t("newsletter")}</div>
                    <div>{t("about")}</div>
                    <div>{t("accessibility")}</div>
                    <div>{t("sustainability")}</div>
                    <div>{t("pressCenter")}</div>
                    <div>{t("investorRelations")}</div>
                    <div>{t("devices")}</div>
                    <div>{t("science")}</div>
                </div>
                <div>
                    <div className="fw-medium text-black mb-2">
                        {t("makeMoneyWithUs")}
                    </div>
                    <div>{t("sellOnAmazon")}</div>
                    <div>{t("sellApps")}</div>
                    <div>{t("supplyToAmazon")}</div>
                    <div>{t("protectAndBuildBrand")}</div>
                    <div>{t("becomeAffiliate")}</div>
                    <div>{t("becomeDeliveryDriver")}</div>
                    <div>{t("startPackageDeliveryBusiness")}</div>
                    <div>{t("advertiseProducts")}</div>
                    <div>{t("selfPublish")}</div>
                    <div>{t("hostAmazonHub")}</div>
                    <div>{t("seeMoreWaysToMakeMoney")}</div>
                </div>

                <div>
                    <div className="fw-medium text-black mb-2">
                        {t("amazonPaymentProducts")}
                    </div>
                    <div>{t("amazonVisa")}</div>
                    <div>{t("amazonStoreCard")}</div>
                    <div>{t("amazonSecuredCard")}</div>
                    <div>{t("amazonBusinessCard")}</div>
                    <div>{t("shopWithPoints")}</div>
                    <div>{t("creditCardMarketplace")}</div>
                    <div>{t("reloadBalance")}</div>
                    <div>{t("giftCards")}</div>
                    <div>{t("currencyConverter")}</div>
                </div>
                <div className="py-2">
                    <div className="fw-medium text-black mb-2 ">
                        {t("letUsHelpYou")}
                    </div>
                    <div>{t("yourAccount")}</div>
                    <div>{t("yourOrders")}</div>
                    <div>{t("shippingRatesAndPolicies")}</div>
                    <div>{t("amazonPrime")}</div>
                    <div>{t("returnsAndReplacements")}</div>
                    <div>{t("manageContentAndDevices")}</div>
                    <div>{t("productSafetyAlerts")}</div>
                    <div>{t("help")}</div>
                </div>
            </div>
            <hr />
        </div>
    );
}

export default Footer;
