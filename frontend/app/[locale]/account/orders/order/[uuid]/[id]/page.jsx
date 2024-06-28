"use client";

import { dateGlobalOptions } from "@/components/utils/jsutils";
import { fetchOrdersWithNoPagination } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { convertToLocale, getWindowLocale } from "@/redux/utils/shop";
import { IconCheck, IconPrinter } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LeaveReviewModal from "@/components/AccountPageComponents/LeaveReviewModal/LeaveReviewModal";
import { useTranslations } from "next-intl";
import { parseAndFormatDecimal } from "@/redux/utils/opts";

function Page({ params: { uuid, id } }) {
    const t = useTranslations("OrderDetailPage");
    const [orderGeneralData, setOrderGeneralData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const dispatch = useAppDispatch();
    const allt = useTranslations();
    useEffect(() => {
        //   Get client order
        if (id) {
            const confi = `order=${id}`;
            dispatch(fetchOrdersWithNoPagination(confi)).then((res) => {
                if (res?.status > 205) {
                    setOrderData(null);
                } else {
                    setOrderData(res.data);
                    setOrderGeneralData(res.data[0].order);
                    console.log("ORDER Data", res.data);
                }
            });
        }
    }, [id]);

    const getInitialDataForReviewModal = (order) => {
        return {
            rating: 5,
            comment: t("Excellentproduct,recommendtobuy"),
            product: order.product.id,
            order_item: order.id,
            subject: t("Greatproduct"),
            country: order.order.destination_country,
        };
    };

    const openReviewModalRef = useRef();
    const [reviewInitialData, setReviewInitialData] = useState({});

    const openReviewModal = (orderItem) => {
        setReviewInitialData(getInitialDataForReviewModal(orderItem));
        openReviewModalRef.current.click();
    };
    const printRef = useRef();
    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };
    return (
        <>
            <LeaveReviewModal
                initialData={reviewInitialData}
                onSuccess={() => {}}
            >
                <div ref={openReviewModalRef}></div>
            </LeaveReviewModal>
            <div className="pb-4 pt-3">
                <div className="d-flex justify-content-between align-items-center  mb-3">
                    <div className="fs-5 fw-bold">{t("orderdetails")}</div>
                    <div
                        className="btn-gray fs-14 px-3 py-1 rounded-small user-select-none d-flex align-items-center gap-2"
                        role="button"
                        onClick={() => handlePrint()}
                    >
                        {t("Printpage")} <IconPrinter className="text-black" />
                    </div>
                </div>
                <div className="row row-gap-2" ref={printRef}>
                    <div className="order-1 order-lg-0 col-lg-8">
                        {Array.isArray(orderData) &&
                            orderData.map((orderItem) => (
                                <div
                                    key={orderItem.id}
                                    className="bg-white rounded-small shadow-sm p-3 fs-15"
                                >
                                    <div className="fs-6 fw-bold mb-3">
                                        {t("Orderinformation")}
                                    </div>
                                    <div className=" mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="text-muted">
                                                {t("Timeplaced")}
                                            </div>
                                            <div className="">
                                                {new Date(
                                                    orderGeneralData?.created_at
                                                ).toLocaleDateString(
                                                    convertToLocale(
                                                        getWindowLocale()
                                                    ),
                                                    dateGlobalOptions
                                                )}
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="text-muted">
                                                {t("Ordernumber")}
                                            </div>
                                            <div className="">
                                                {orderItem?.id}
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="text-muted">
                                                {t("Shippingprice")}
                                            </div>
                                            <div className="fw-medium">
                                                ${orderItem?.shipping_price}
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="text-muted">
                                                {t("Tax")}
                                            </div>
                                            <div className="fw-medium">
                                                ${orderItem?.total_tax_price}
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center border-top mt-2 pt-2">
                                            <div className="text-muted">
                                                {t("Total")}
                                            </div>
                                            <div className="fw-medium">
                                                $
                                                {(
                                                    parseFloat(
                                                        orderItem?.total_price
                                                    ) +
                                                    parseFloat(
                                                        orderItem?.shipping_price
                                                    ) +
                                                    parseFloat(
                                                        orderItem?.total_tax_price
                                                    )
                                                ).toFixed(2)}{" "}
                                                ({orderItem?.quantity}{" "}
                                                {t("item")})
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fs-6 fw-bold mb-3">
                                        {t("Deliveryinfo")}
                                    </div>

                                    <div>
                                        <div className="row row-cols-3 mx-0 align-items-start my-4">
                                            <div className="px-0">
                                                <div className="position-relative d-flex justify-content-center align-items-center">
                                                    <div
                                                        className={`d-flex fs-14 justify-content-center align-items-center fw-bold bg-main text-white`}
                                                        style={{
                                                            height: 40,
                                                            width: 40,

                                                            borderRadius: "50%",
                                                            zIndex: 10,
                                                        }}
                                                    >
                                                        <IconCheck size={24} />
                                                    </div>
                                                    <div
                                                        className={`border position-absolute w-100 border-main`}
                                                    ></div>
                                                </div>

                                                <div
                                                    className={`fs-14 text-center overflow-hidden text-main fw-bold mt-2`}
                                                >
                                                    {t("Paid")}
                                                    <div className="fs-13 text-muted fw-normal">
                                                        {new Date(
                                                            orderGeneralData?.created_at
                                                        ).toLocaleDateString(
                                                            convertToLocale(
                                                                getWindowLocale()
                                                            ),
                                                            dateGlobalOptions
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-0">
                                                <div className="position-relative d-flex justify-content-center align-items-center">
                                                    <div
                                                        className={`d-flex fs-14 justify-content-center align-items-center fw-bold ${
                                                            orderItem?.released_time
                                                                ? "bg-main text-white"
                                                                : "border bg-white text-muted"
                                                        }`}
                                                        style={{
                                                            height: 40,
                                                            width: 40,

                                                            borderRadius: "50%",
                                                            zIndex: 10,
                                                        }}
                                                    >
                                                        {orderItem?.released_time && (
                                                            <IconCheck
                                                                size={24}
                                                            />
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`border position-absolute w-100 ${
                                                            orderItem?.released_time
                                                                ? "border-main"
                                                                : ""
                                                        }`}
                                                    ></div>
                                                </div>

                                                <div
                                                    className={`fs-14 text-center overflow-hidden text-muted fw-bold mt-2`}
                                                >
                                                    {t("Shipped")}
                                                    <div className="fs-13 text-muted fw-normal">
                                                        {orderItem?.released_time ? (
                                                            <div className="fs-13 text-muted fw-normal">
                                                                {new Date(
                                                                    orderItem?.released_time
                                                                ).toLocaleDateString(
                                                                    convertToLocale(
                                                                        getWindowLocale()
                                                                    ),
                                                                    dateGlobalOptions
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-0">
                                                <div className="position-relative d-flex justify-content-center align-items-center">
                                                    <div
                                                        className={`d-flex fs-14 justify-content-center align-items-center fw-bold ${
                                                            orderItem?.delivered_time
                                                                ? "bg-main text-white"
                                                                : "border bg-white text-muted"
                                                        }`}
                                                        style={{
                                                            height: 40,
                                                            width: 40,

                                                            borderRadius: "50%",
                                                            zIndex: 10,
                                                        }}
                                                    >
                                                        {orderItem?.delivered_time && (
                                                            <IconCheck
                                                                size={24}
                                                            />
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`border position-absolute w-100 ${
                                                            orderItem?.delivered_time
                                                                ? "border-main"
                                                                : ""
                                                        }`}
                                                    ></div>
                                                </div>

                                                <div
                                                    className={`fs-14 text-center overflow-hidden text-muted fw-bold mt-2`}
                                                >
                                                    {t("Delivered")}
                                                    {orderItem?.delivered_time ? (
                                                        <div className="fs-13 text-muted fw-normal">
                                                            {new Date(
                                                                orderItem?.delivered_time
                                                            ).toLocaleDateString(
                                                                convertToLocale(
                                                                    getWindowLocale()
                                                                ),
                                                                dateGlobalOptions
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="fs-6 fw-bold mb-3">
                                        {t("Iteminfo")}
                                    </div>
                                    <div className="row">
                                        <Link
                                            href={`/products/${orderItem.product.slug}/${orderItem?.product?.id}/`}
                                            className="col-md-3"
                                        >
                                            <img
                                                className="img-fluid"
                                                src={orderItem?.product?.image}
                                                alt=""
                                            />
                                        </Link>
                                        <div className="col-md fs-14">
                                            <Link
                                                href={`/products/${orderItem.product.slug}/${orderItem?.product?.id}/`}
                                                className="d-flex mb-2 justify-content-between align-items-start"
                                            >
                                                <div className="truncate-overflow-2 fw-medium">
                                                    {orderItem?.product?.name}
                                                </div>
                                                <div className="fw-bold">
                                                    ${orderItem?.price}
                                                </div>
                                            </Link>
                                            <div className="mb-1 text-muted">
                                                {t("Itemnumber")}:{" "}
                                                <span className="fw-medium fs-14">
                                                    {orderItem?.product?.id}
                                                </span>
                                            </div>
                                            {orderItem?.variations && (
                                                <div className="mb-1 text-muted">
                                                    {t("Variations")}:{" "}
                                                    <span className="fw-medium">
                                                        {orderItem?.variations}
                                                    </span>
                                                </div>
                                            )}
                                            {orderItem?.bought_in_containers && (
                                                <div className="border-top border-bottom py-1">
                                                    <div className="text-muted  fs-14">
                                                        {
                                                            orderItem.container_name
                                                        }{" "}
                                                        - (
                                                        {
                                                            orderItem.container_length
                                                        }
                                                        x
                                                        {
                                                            orderItem.container_width
                                                        }
                                                        x
                                                        {
                                                            orderItem.container_height
                                                        }
                                                        ) {allt("meters")}
                                                    </div>
                                                    <div className="text-muted  fs-14 ">
                                                        {allt(
                                                            "Listings.weight"
                                                        )}
                                                        :
                                                        <span className="fw-medium">
                                                            {
                                                                orderItem?.container_weight
                                                            }{" "}
                                                            {allt("kg")}
                                                        </span>
                                                    </div>
                                                    <div className="text-muted  fs-14 mb-1">
                                                        {allt("itemsinside")}:
                                                        <span className="fw-medium">
                                                            {
                                                                orderItem?.items_inside_container
                                                            }{" "}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="text-muted">
                                                {t("Returnsnotaccepted")}
                                            </div>
                                        </div>
                                    </div>

                                    {!orderItem.review ? (
                                        [
                                            "CANCELLED",
                                            "RETURNED_BACK",
                                            "DELIVERED",
                                        ].includes(orderItem.status) && (
                                            <div
                                                onClick={() =>
                                                    openReviewModal(orderItem)
                                                }
                                            >
                                                <button className="btn btn-gray rounded-5 fs-14 fw-bold px-3 d-flex align-items-center">
                                                    {t("LeaveReview")}
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            <Link
                                                href={`/products/${orderItem.product.slug}/${orderItem.product.id}#reviews`}
                                                className="fs-13 underline-on-hover text-muted"
                                            >
                                                {t("Seecomment")}
                                                {new Date(
                                                    orderItem.review.created_at
                                                ).toLocaleDateString(
                                                    convertToLocale(
                                                        getWindowLocale()
                                                    ),
                                                    dateGlobalOptions
                                                )}
                                            </Link>
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>
                    <div className="order-0 order-lg-1 col-lg-4">
                        <div
                            className="bg-white rounded-small shadow-sm p-3 fs-15 position-sticky"
                            style={{ top: 10 }}
                        >
                            <div className="fs-6 fw-bold">
                                {t("Shippingaddress")}
                            </div>
                            <div className="fs-13 my-3">
                                <div>
                                    {orderGeneralData?.destination_full_name}
                                </div>
                                <div>
                                    {
                                        orderGeneralData?.destination_address_line1
                                    }{" "}
                                    {
                                        orderGeneralData?.destination_address_line2
                                    }
                                </div>
                                <div>
                                    {orderGeneralData?.destination_city},{" "}
                                    {orderGeneralData?.destination_state}{" "}
                                    {orderGeneralData?.destination_zip_code}
                                </div>
                                <div>
                                    {orderGeneralData?.destination_country}
                                </div>
                            </div>
                            <div className="fs-6 fw-bold ">
                                {t("Paymentdetails")}
                            </div>
                            <div className="my-3">
                                <div className="d-flex justify-content-between my-4">
                                    <div>
                                        <span
                                            className={`${
                                                orderGeneralData?.card_brand
                                                    ? orderGeneralData?.card_brand
                                                    : "VISA"
                                            } medium`}
                                        ></span>
                                        <span className="ms-2 fw-medium">
                                            x-{orderGeneralData?.card_last_4}
                                        </span>
                                    </div>
                                    <div className="fs-14 text-end">
                                        <div>
                                            ${orderGeneralData?.total_price}
                                        </div>
                                        <div className="text-muted fs-12">
                                            {new Date(
                                                orderGeneralData?.created_at
                                            ).toLocaleDateString(
                                                convertToLocale(
                                                    getWindowLocale()
                                                ),
                                                dateGlobalOptions
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 fs-14">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div>
                                            {
                                                orderGeneralData?.total_item_amount
                                            }{" "}
                                            {t("items")}
                                        </div>
                                        <div>
                                            $
                                            {parseAndFormatDecimal(
                                                parseFloat(
                                                    orderGeneralData?.total_price
                                                ) -
                                                    parseFloat(
                                                        orderGeneralData?.total_shipping_price
                                                    ) -
                                                    parseFloat(
                                                        orderGeneralData?.total_tax_price
                                                    )
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div>{t("Shippingprice")}</div>
                                        <div>
                                            $
                                            {parseAndFormatDecimal(
                                                orderGeneralData?.total_shipping_price
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div>{t("Tax")}</div>
                                        <div>
                                            $
                                            {parseAndFormatDecimal(
                                                orderGeneralData?.total_tax_price
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-top pt-2 d-flex mt-3 justify-content-between align-items-center">
                                        <div className="fs-15 fw-bold">
                                            {t("Ordertotal")}
                                        </div>
                                        <div className="fs-15 fw-bold">
                                            $
                                            {parseAndFormatDecimal(
                                                orderGeneralData?.total_price
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;
