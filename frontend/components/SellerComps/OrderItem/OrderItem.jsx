"use client";

import { IconListDetails } from "@tabler/icons-react";
import React, { useState } from "react";
import Link from "next/link";
import { fetchPDF } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import { convertUppercaseToNormal } from "@/redux/utils/opts";
import OpenCaseModal from "@/components/SupportCaseModal/OpenCaseModal";
import { useRef } from "react";
import { convertToLocale, getWindowLocale } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";

export default function OrderItem({ orderItem }) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const openModalRef = useRef();
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
    const t = useTranslations();
    const [initialDataForCaseOpen, setInitialDataForCaseOpen] = useState({
        subject: t("Listings.contactCustomer"),
        message: t("Listings.orderProblem"),
    });
    const dispatch = useAppDispatch();
    const showPDF = () => {
        setIsLoadingPdf(true);
        dispatch(fetchPDF(`/api/orders/seller/${orderItem.id}/pdf/`))
            .then((url) => {
                if (url?.status) {
                    // not logged
                } else {
                    window.open(url, "_blank");
                }
            })

            .finally(() => {
                setIsLoadingPdf(false);
            });
    };
    if (isLoadingPdf) {
        return <LoadingScreen />;
    }

    return (
        <>
            <OpenCaseModal initialData={initialDataForCaseOpen}>
                <div ref={openModalRef}></div>
            </OpenCaseModal>
            <div className="row mx-0 fs-15 bg-white border mb-1 rounded-small py-2 align-items-center ">
                <div className="col col-md-2 order-1">
                    <img
                        src={`${
                            orderItem?.product?.image
                                ? orderItem?.product?.image
                                : "/6583192421.webp"
                        }`}
                        alt=""
                        className="img-fluid"
                    />
                </div>
                <div className="col-md order-3 pt-2 pt-md-0 order-md-2 align-self-start d-flex d-md-flex justify-content-between align-items-center">
                    <div className="d-block">
                        <div>
                            <div className="fw-medium fs-14 truncate-overflow-2">
                                {t(`OrderItemStates.${orderItem.status}`)}
                            </div>
                            <Link
                                href={`/products/${orderItem?.product?.slug}/${orderItem.product?.id}`}
                            >
                                <div className="text-decoration-underline fs-13 truncate-overflow-2">
                                    {orderItem.product_name}
                                </div>
                            </Link>
                            <div className="fs-13 text-muted mt-1">
                                {orderItem?.variations}
                            </div>
                            {orderItem?.bought_in_containers && (
                                <div className="text-muted  fs-13">
                                    {orderItem.container_name} - (
                                    {orderItem.container_length}x
                                    {orderItem.container_width}x
                                    {orderItem.container_height}) {t("meters")}
                                </div>
                            )}
                        </div>

                        <div className="d-flex fs-13 text-muted  flex-wrap gap-2 mt-2 dropdown">
                            <div
                                role="button"
                                className="border bg-white  px-2 py-1 rounded-small"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <IconListDetails size={18} className="me-1" />{" "}
                                {t("Listings.orderdetailsview")}
                            </div>
                            <ul
                                class={`main-drop dropdown-menu fs-13 rounded-1 `}
                            >
                                <li
                                    role="button"
                                    onClick={() => {
                                        setInitialDataForCaseOpen({
                                            subject: t(
                                                "Listings.contactCustomer"
                                            ),
                                            message: t(
                                                "Listings.orderdetailsmoreinformation"
                                            ),
                                        });
                                        openModalRef.current.click();
                                    }}
                                >
                                    <span class="dropdown-item">
                                        {t("OrderItem.contactSupport")}
                                    </span>
                                </li>

                                {orderItem.labels_state === "GENERATED" ||
                                    (orderItem.labels_state === "PRINTED" && (
                                        <li>
                                            <Link
                                                class="dropdown-item"
                                                href={`/seller/orders/label/list/${orderItem.id}`}
                                            >
                                                {t("Listings.showLabels")}
                                            </Link>
                                        </li>
                                    ))}
                                <li>
                                    <div
                                        class="dropdown-item"
                                        onClick={() => showPDF()}
                                        role="button"
                                    >
                                        {t("Listings.orderDetailsPdf")}
                                    </div>
                                </li>
                                {orderItem?.pickup && (
                                    <li>
                                        <Link
                                            class="dropdown-item"
                                            href={`/seller/orders/pickups/${orderItem.id}`}
                                        >
                                            {t("pickupschedules")}
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <Link
                            href={`/seller/orders/${orderItem.uuid}/${orderItem.id}/`}
                        >
                            <button className="btn border rounded-5 fs-14 fw-bold px-3 d-flex align-items-center">
                                {t("Listings.orderdetailsview")}
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="col-6 col-md-4 order-2 order-md-3 text-end">
                    <div className="fw-medium fs-15 mb-1">
                        ${orderItem.total_price}{" "}
                        {/* <span className="text-muted align-self-end fs-13">
                        - Shipping (${orderItem.shipping_price})
                    </span> */}
                    </div>

                    <div className="text-muted  fs-13">
                        {orderItem.quantity} {t("Listings.count")}
                    </div>
                    <div className="text-muted  fs-13">
                        {t("OrderItem.soldOn")}:{" "}
                        {new Date(
                            orderItem.order.created_at
                        ).toLocaleDateString(
                            convertToLocale(getWindowLocale()),
                            options
                        )}
                    </div>
                    {orderItem.status === "DELIVERED" && (
                        <div className="text-muted  fs-13">
                            {t("OrderItem.delivered")}:{" "}
                            {new Date(
                                orderItem.delivered_time
                            ).toLocaleDateString(
                                convertToLocale(getWindowLocale()),
                                options
                            )}
                        </div>
                    )}

                    <div className="text-muted  fs-13">
                        {t("OrderDetailPage.Ordernumber")}: {orderItem.id}
                    </div>

                    {orderItem.labels_state === "NOT_STARTED" &&
                        orderItem.shipping_courier_type === "YUUSELL" &&
                        !orderItem.bought_in_containers && (
                            <Link
                                class="btn btn-main  fs-14 my-1 rounded-small fw-medium py-1"
                                href={`/seller/orders/label/buy/${orderItem.id}`}
                            >
                                {t("Listings.buylabel")}
                            </Link>
                        )}
                    {orderItem.labels_state === "NOT_STARTED" &&
                        orderItem.shipping_courier_type === "YUUSELL" &&
                        orderItem.bought_in_containers &&
                        !orderItem?.pickup && (
                            <Link
                                class="btn btn-main  fs-14 my-1 rounded-small fw-medium py-1"
                                href={`/seller/orders/schedule-pickup/${orderItem.id}`}
                            >
                                {t("schedulepickup")}
                            </Link>
                        )}
                    {orderItem.labels_state === "NOT_STARTED" &&
                        orderItem.shipping_courier_type === "YUUSELL" &&
                        orderItem.bought_in_containers &&
                        orderItem?.pickup &&
                        orderItem?.pickup.state === "SCHEDULED" && (
                            <div className="fs-13 fw-medium text-muted">
                                {t("scheduledon")}{" "}
                                {new Date(
                                    orderItem?.pickup?.date
                                ).toLocaleDateString(
                                    convertToLocale(getWindowLocale()),
                                    options
                                )}
                            </div>
                        )}
                    {orderItem.labels_state === "GENERATED" && (
                        <Link
                            class="btn btn-main  fs-14 my-1 rounded-small fw-medium py-1"
                            href={`/seller/orders/label/list/${orderItem.id}`}
                        >
                            {t("Listings.showLabels")}
                        </Link>
                    )}
                    {orderItem.labels_state === "ERROR" && (
                        <div className="fs-14 fw-medium text-muted">
                            {t("Listings.labelsError")}
                        </div>
                    )}

                    {orderItem.labels_state === "PENDING" && (
                        <div className="fs-13 fw-medium text-muted">
                            {t("Listings.labelsProcessing")}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
