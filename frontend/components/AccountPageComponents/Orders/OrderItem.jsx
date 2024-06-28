"use client";
import { useAppDispatch } from "@/redux/hooks";
import { fetchPDF } from "@/redux/actions/shopActions";
import { convertUppercaseToNormal } from "@/redux/utils/opts";
import { IconListDetails } from "@tabler/icons-react";
import React, { useState } from "react";
import Link from "next/link";
import { convertToLocale, getWindowLocale } from "@/redux/utils/shop";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import { useTranslations } from "next-intl";

export default function OrderItem({
    orderItem,
    setCaseInitialData,
    setReviewInitialData,
    openModalRef,
    openReviewModalRef,
}) {
    const t = useTranslations("OrderItem");
    const allTrnslations = useTranslations();
    const options = { year: "numeric", month: "long", day: "numeric" };

    const dispatch = useAppDispatch();
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
    const showPDF = () => {
        setIsLoadingPdf(true);
        dispatch(fetchPDF(`/api/orders/customer/${orderItem.id}/pdf/`))
            .then((url) => {
                window.open(url, "_blank");
            })
            .finally(() => {
                setIsLoadingPdf(false);
            });
    };
    const lessThan2WeeksFn = () => {
        if (orderItem.order.created_at && orderItem.delivered_time) {
            const lessThan2weeks =
                Math.abs(new Date(orderItem.delivered_time) - new Date()) <
                14 * 24 * 60 * 60 * 1000; // Convert 14 days to milliseconds
            if (lessThan2weeks) {
                return true;
            }
            return false;
        }
        return true;
    };

    if (isLoadingPdf) {
        return <LoadingScreen />;
    }

    const getInitalDataForCaseOpen = (order) => {
        return {
            subject: `${t("caseSubject")}${order.id}`,
            message: t("caseMessage"),
        };
    };
    const getInitialDataForReviewModal = (order) => {
        return {
            rating: 5,
            comment: t("reviewComment"),
            product: order.product.id,
            order_item: order.id,
            subject: t("reviewSubject"),
            country: order.order.destination_country,
        };
    };

    const openCaseModal = () => {
        setCaseInitialData(getInitalDataForCaseOpen(orderItem));
        openModalRef.current.click();
    };
    const openReviewModal = () => {
        setReviewInitialData(getInitialDataForReviewModal(orderItem));
        openReviewModalRef.current.click();
    };

    return (
        <>
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
                <div className="col-6 mt-2 mt-md-0 col-md order-3 order-md-2 align-self-start">
                    <div className="fw-medium fs-14 truncate-overflow-2">
                        {allTrnslations(`OrderItemStates.${orderItem.status}`)}
                        {/* {convertUppercaseToNormal(orderItem.status)} */}
                    </div>
                    <div className="text-decoration-underline fs-13 truncate-overflow-2">
                        {orderItem.product_name}
                    </div>
                    <div className="d-flex fs-13 text-muted  flex-wrap gap-2 mt-2 dropdown user-select-none">
                        <div
                            role="button"
                            className="border bg-white  px-2 py-1 rounded-small"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <IconListDetails size={18} className="me-1" />{" "}
                            {t("viewOrderDetails")}
                        </div>
                        <ul class="main-drop dropdown-menu fs-13 rounded-1">
                            <li>
                                <div
                                    onClick={() => showPDF()}
                                    role="button"
                                    class="dropdown-item"
                                >
                                    {t("receipt")}
                                </div>
                            </li>

                            <li role="button" onClick={() => openCaseModal()}>
                                <span class="dropdown-item">
                                    {t("contactSupport")}
                                </span>
                            </li>
                            {/* {![
                                "CANCELLED",
                                "CANCEL_REQUESTED",
                                "RETURNED_BACK",
                            ].includes(orderItem.status) &&
                                lessThan2WeeksFn() && (
                                    <li>
                                        <Link
                                            href={`/account/orders/refund/${orderItem.id}/`}
                                            className="dropdown-item"
                                        >
                                            {t("requestRefund")}
                                        </Link>
                                    </li>
                                )} */}
                        </ul>
                    </div>
                </div>
                <div className="col-6 col-md-4 order-2 order-md-4 text-end">
                    <div className="fw-medium fs-15 mb-1">
                        ${orderItem.total_price}{" "}
                        <span className="text-muted align-self-end fs-13">
                            - {t("shipping")} (${orderItem.shipping_price})
                        </span>
                    </div>

                    <div className="text-muted  fs-13">
                        {t("quantity")}:{" "}
                        {/* {orderItem?.bought_in_containers
                            ? orderItem.quantity *
                              orderItem?.items_inside_container
                            : orderItem.quantity} */}
                        {orderItem.quantity}
                    </div>
                    {orderItem.variations && (
                        <div className="text-muted  fs-13">
                            {orderItem.variations}
                        </div>
                    )}
                    {orderItem?.bought_in_containers && (
                        <div>
                            <div className="text-muted  fs-13">
                                {orderItem.container_name} - (
                                {orderItem.container_length}x
                                {orderItem.container_width}x
                                {orderItem.container_height}){" "}
                                {allTrnslations("meters")}
                            </div>
                            <div className="text-muted  fs-13">
                                {allTrnslations("itemsinside")}:
                                {orderItem.items_inside_container}
                            </div>
                        </div>
                    )}
                    <div className="text-muted  fs-13">
                        {t("soldOn")}:{" "}
                        {new Date(
                            orderItem.order.created_at
                        ).toLocaleDateString(
                            convertToLocale(getWindowLocale()),
                            options
                        )}
                    </div>
                    {orderItem.status === "DELIVERED" && (
                        <div className="text-muted  fs-13">
                            {t("delivered")}:{" "}
                            {new Date(
                                orderItem.delivered_time
                            ).toLocaleDateString(
                                convertToLocale(getWindowLocale()),
                                options
                            )}
                        </div>
                    )}

                    <div className="text-muted  fs-13">
                        {t("order")} #{orderItem.id}
                    </div>
                </div>
                <div className="col-6 mt-2 mt-md-0 col-md-3 order-4 order-md-3">
                    <div className="d-flex flex-column align-items-center justify-content-end gap-1 ">
                        {!orderItem.review ? (
                            [
                                "CANCELLED",
                                "RETURNED_BACK",
                                "DELIVERED",
                            ].includes(orderItem.status) && (
                                <div onClick={() => openReviewModal()}>
                                    <button className="btn btn-gray rounded-5 fs-14 fw-bold px-3 d-flex align-items-center">
                                        {t("leaveReview")}
                                    </button>
                                </div>
                            )
                        ) : (
                            <>
                                <Link
                                    href={`/products/${orderItem.product.slug}/${orderItem.product.id}#reviews`}
                                    className="fs-13 underline-on-hover text-muted"
                                >
                                    {t("seeComment")}:{" "}
                                    {new Date(
                                        orderItem.review.created_at
                                    ).toLocaleDateString(undefined, options)}
                                </Link>
                            </>
                        )}
                        <Link
                            href={`/account/orders/order/${orderItem.order.uuid}/${orderItem.order.id}/`}
                        >
                            <button className="btn border rounded-5 fs-14 fw-bold px-3 d-flex align-items-center">
                                {t("viewOrderDetails")}
                            </button>
                        </Link>
                        {/* {![
                            "CANCELLED",
                            "CANCEL_REQUESTED",
                            "RETURNED_BACK",
                        ].includes(orderItem.status) && (
                            <Link
                                href={`/account/orders/refund/${orderItem.id}/`}
                            >
                                <button className="btn border rounded-5 fs-14 fw-bold px-3 d-flex align-items-center">
                                    {t("cancelOrder")}
                                </button>
                            </Link>
                        )} */}
                    </div>
                </div>
            </div>
        </>
    );
}
