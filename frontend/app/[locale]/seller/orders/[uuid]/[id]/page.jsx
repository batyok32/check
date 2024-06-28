"use client";

import { dateGlobalOptions } from "@/components/utils/jsutils";
import { retrieveSellerOrder } from "@/redux/actions/sellerActions";
import { useAppDispatch } from "@/redux/hooks";
import { convertToLocale, getWindowLocale } from "@/redux/utils/shop";
import { IconCheck, IconPrinter } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

function Page({ params: { uuid, id } }) {
    const [orderItem, setOrderItem] = useState(null);
    const t = useTranslations();
    const dispatch = useAppDispatch();
    useEffect(() => {
        //   Get client order
        if (id) {
            dispatch(retrieveSellerOrder(id)).then((res) => {
                if (res?.status > 205) {
                    setOrderItem(null);
                } else {
                    setOrderItem(res.data);
                    console.log("ORDER Data", res.data);
                }
            });
        }
    }, [id]);

    const printRef = useRef();
    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        // const printStyle = "<style>body { background-color: white; }</style>";
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };
    return (
        <>
            <div className="pb-4 pt-3 px-3 mb-5">
                <div className="d-flex justify-content-between align-items-center  mb-3">
                    <div className="fs-5 fw-bold">
                        {t("OrderDetailPage.orderdetails")}{" "}
                    </div>
                    <div
                        className="btn-gray fs-14 px-3 py-1 rounded-small user-select-none d-flex align-items-center gap-2"
                        role="button"
                        onClick={() => handlePrint()}
                    >
                        {t("OrderDetailPage.Printpage")}{" "}
                        <IconPrinter className="text-black" />
                    </div>
                </div>
                <div className="row" ref={printRef}>
                    <div className="order-1 order-lg-0 col-lg-10 mx-auto">
                        <div className="bg-white rounded-small shadow-sm p-3 fs-15">
                            <div className="fs-6 fw-bold mb-3">
                                {t("OrderDetailPage.Orderinformation")}
                            </div>
                            <div className=" mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="text-muted">
                                        {t("OrderDetailPage.Timeplaced")}
                                    </div>
                                    <div className="">
                                        {new Date(
                                            orderItem?.order?.created_at
                                        ).toLocaleDateString(
                                            convertToLocale(getWindowLocale()),
                                            dateGlobalOptions
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="text-muted">
                                        {t("OrderDetailPage.Ordernumber")}
                                    </div>
                                    <div className="">{orderItem?.uuid}</div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="text-muted">
                                        {t("Listings.price")}
                                    </div>
                                    <div className="">${orderItem?.price}</div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="text-muted">
                                        {t("OrderItem.quantity")}
                                    </div>
                                    <div className="">
                                        {orderItem?.quantity}{" "}
                                        {t("AccountPage.items")}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="text-muted">
                                        {t("Listings.totalPrice")}
                                    </div>
                                    <div className="fw-medium">
                                        ${orderItem?.total_price}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="text-muted">
                                        {t("Listings.appFee")}
                                    </div>
                                    <div className="fw-medium ">
                                        <span className="text-danger">-</span>$
                                        {orderItem?.app_fee}
                                    </div>
                                </div>
                                {/* Total price */}
                                {/* Fee price */}
                                {/* Without fee */}

                                <div className="d-flex justify-content-between align-items-center border-top mt-2 pt-2">
                                    <div className="text-muted">
                                        {t("Cart.Total")}
                                    </div>
                                    <div className="fw-medium">
                                        ${orderItem?.without_app_fee} (
                                        {orderItem?.quantity}{" "}
                                        {t("OrderDetailPage.item")})
                                    </div>
                                </div>
                            </div>
                            <div className="fs-6 fw-bold mb-3">
                                {t("OrderDetailPage.Deliveryinfo")}
                            </div>
                            {/* <div>
                                        Estimated delivery:{" "}
                                        <span className="fw-medium">
                                            Mon, Apr 15
                                        </span>
                                    </div> */}
                            <div>
                                <div className="row row-cols-3 mx-0 align-items-start my-4">
                                    <div className="px-0">
                                        <div className="position-relative d-flex justify-content-center align-items-center">
                                            <div
                                                className={`d-flex fs-14 justify-content-center align-items-center fw-bold bg-main text-white`}
                                                // className={`d-flex fs-14 justify-content-center align-items-center fw-bold ${
                                                //     currentSection >= step.section
                                                //         ? "bg-main text-white"
                                                //         : "border bg-white text-muted"
                                                // }`}
                                                style={{
                                                    height: 40,
                                                    width: 40,

                                                    borderRadius: "50%",
                                                    zIndex: 10,
                                                }}
                                            >
                                                <IconCheck size={24} />
                                                {/* {currentSection > step.section && (
                                 <IconCheck size={24} />
                             )} */}
                                            </div>
                                            <div
                                                className={`border position-absolute w-100 border-main`}
                                                // className={`border position-absolute w-100 ${
                                                //     currentSection >= step.section
                                                //         ? "border-main"
                                                //         : ""
                                                // }`}
                                            ></div>
                                        </div>

                                        <div
                                            className={`fs-14 text-center overflow-hidden text-main fw-bold mt-2`}
                                        >
                                            {t("OrderDetailPage.Paid")}

                                            <div className="fs-13 text-muted fw-normal px-2 pt-1">
                                                {new Date(
                                                    orderItem?.order?.created_at
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
                                                // className={`d-flex fs-14 justify-content-center align-items-center fw-bold border bg-white text-muted`}
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
                                                {/* <IconCheck size={24} /> */}
                                                {orderItem?.released_time && (
                                                    <IconCheck size={24} />
                                                )}
                                            </div>
                                            <div
                                                // className={`border position-absolute w-100 `}
                                                className={`border position-absolute w-100 ${
                                                    orderItem?.released_time
                                                        ? "border-main"
                                                        : ""
                                                }`}
                                            ></div>
                                        </div>

                                        <div
                                            className={`fs-14 text-center overflow-hidden ${
                                                orderItem?.released_time
                                                    ? "text-main"
                                                    : "text-muted"
                                            } fw-bold mt-2`}
                                        >
                                            {t("OrderDetailPage.Shipped")}

                                            <div className="fs-13 text-muted fw-normal px-2 pt-1">
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
                                                // className={`d-flex fs-14 justify-content-center align-items-center fw-bold border bg-white text-muted`}
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
                                                {/* <IconCheck size={24} /> */}
                                                {orderItem?.delivered_time && (
                                                    <IconCheck size={24} />
                                                )}
                                            </div>
                                            <div
                                                // className={`border position-absolute w-100 `}
                                                className={`border position-absolute w-100 ${
                                                    orderItem?.delivered_time
                                                        ? "border-main"
                                                        : ""
                                                }`}
                                            ></div>
                                        </div>

                                        <div
                                            className={`fs-14 text-center overflow-hidden ${
                                                orderItem?.delivered_time
                                                    ? "text-main"
                                                    : "text-muted"
                                            }  fw-bold mt-2`}
                                        >
                                            {t("OrderDetailPage.Delivered")}

                                            {orderItem?.delivered_time ? (
                                                <div className="fs-13 text-muted fw-normal px-2 pt-1">
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
                            {/* <div className="fs-6 fw-bold mb-3">
                                    Tracking details
                                </div>
                                {orderItem?.labels && Array.isArray(orderItem?.labels) ? orderItem.labels.map(label => (
                                    <div className="mb-3">
                                    <div className="d-flex gap-3 fs-14 mb-1">
                                        <div className="text-muted fw-light">
                                            Number
                                        </div>
                                        <div></div>
                                    </div>
                                    <div className="d-flex gap-3 fs-14 mb-1">
                                        <div className="text-muted fw-light">
                                            Service
                                        </div>
                                        <div>USPS</div>
                                    </div>
                                </div>
                                )): <>
                                <div className="mb-3">
                                    <div className="d-flex gap-3 fs-14 mb-1">
                                        <div className="text-muted fw-light">
                                            Number
                                        </div>
                                        <div>Tracking not set yet</div>
                                    </div>
                                    <div className="d-flex gap-3 fs-14 mb-1">
                                        <div className="text-muted fw-light">
                                            Service
                                        </div>
                                        <div>{courier}</div>
                                    </div>
                                </div>
                                </> } */}

                            <div className="fs-6 fw-bold mb-3">
                                {" "}
                                {t("OrderDetailPage.Iteminfo")}
                            </div>
                            <div className="row border row-gap-2 p-3 shadow-sm">
                                <Link
                                    href={`/products/${orderItem?.product?.slug}/${orderItem?.product?.id}/`}
                                    className="col-md-3"
                                >
                                    <img
                                        className="img-fluid"
                                        src={orderItem?.product?.image}
                                        alt=""
                                    />
                                </Link>
                                <div className="col-md-6 fs-14">
                                    <Link
                                        href={`/products/${orderItem?.product?.slug}/${orderItem?.product?.id}/`}
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
                                        {t("OrderDetailPage.Itemnumber")}:{" "}
                                        <span className="fw-medium">
                                            {orderItem?.product?.id}
                                        </span>
                                    </div>
                                    {orderItem?.variations && (
                                        <div className="mb-1 text-muted">
                                            {t("OrderDetailPage.Variations")}:{" "}
                                            <span className="fw-medium">
                                                {orderItem?.variations}
                                            </span>
                                        </div>
                                    )}
                                    {orderItem?.bought_in_containers && (
                                        <div>
                                            <div className="text-muted  fs-13">
                                                {orderItem.container_name} - (
                                                {orderItem.container_length}x
                                                {orderItem.container_width}x
                                                {orderItem.container_height})
                                                {t("meters")}
                                            </div>
                                            <div className="text-muted  fs-13">
                                                {t("Listings.weight")}:
                                                <span className="fw-medium">
                                                    {
                                                        orderItem?.container_weight
                                                    }{" "}
                                                    {t("kg")}
                                                </span>
                                            </div>
                                            <div className="text-muted  fs-13">
                                                {t("itemsinside")}:
                                                <span className="fw-medium">
                                                    {
                                                        orderItem?.items_inside_container
                                                    }{" "}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-3">
                                    {orderItem?.review && (
                                        <>
                                            <div className="fs-13  text-muted">
                                                {t("Listings.commentDate")}:
                                                {new Date(
                                                    orderItem?.review?.created_at
                                                ).toLocaleDateString(
                                                    convertToLocale(
                                                        getWindowLocale()
                                                    ),
                                                    dateGlobalOptions
                                                )}
                                            </div>
                                            <div className="fs-13  text-muted">
                                                {t("Listings.commentRating")}:
                                                {orderItem?.review?.rating}
                                            </div>
                                            <div className="fs-13  text-muted">
                                                {t("Listings.comment")}:
                                                {orderItem?.review?.subject}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* <div
                                        role="button"
                                        className="text-decoration-underline text-end"
                                    >
                                        Leave feedback or see comment
                                    </div> */}
                        </div>
                    </div>
                    {/* <div className="order-0 order-lg-1 col-lg-4">
                        <div
                            className="bg-white rounded-small shadow-sm p-3 fs-15 position-sticky"
                            style={{ top: 10 }}
                        >
                            <div className="fs-6 fw-bold">Origin address</div>
                            <div className="fs-13 my-3">
                                
                                <div>
                                    {
                                        orderItem?.origin_address_line1
                                    }{" "}
                                    {
                                        orderItem?.origin_address_line2
                                    }
                                </div>
                                <div>
                                    {orderItem?.origin_city},{" "}
                                    {orderItem?.origin_state}{" "}
                                    {orderItem?.origin_zip_code}
                                </div>
                                <div>
                                    {orderItem?.origin_country}
                                </div>
                            </div>
                            <div className="fs-6 fw-bold ">Payment details</div>
                            <div className="my-3">
                                <div className="d-flex justify-content-between my-4">
                                    
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
                                            items
                                        </div>
                                        <div>
                                            $
                                            {parseFloat(
                                                orderGeneralData?.total_price
                                            ) -
                                                parseFloat(
                                                    orderGeneralData?.total_shipping_price
                                                ) -
                                                parseFloat(
                                                    orderGeneralData?.total_tax_price
                                                )}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div>Shipping</div>
                                        <div>
                                            $
                                            {
                                                orderGeneralData?.total_shipping_price
                                            }
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div>Tax</div>
                                        <div>
                                            ${orderGeneralData?.total_tax_price}
                                        </div>
                                    </div>

                                    <div className="border-top pt-2 d-flex mt-3 justify-content-between align-items-center">
                                        <div className="fs-15 fw-bold">
                                            Order total
                                        </div>
                                        <div className="fs-15 fw-bold">
                                            ${orderGeneralData?.total_price}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default Page;
