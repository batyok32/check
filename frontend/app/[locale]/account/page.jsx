"use client";
import { capitalize } from "@/components/utils/jsutils";
import { getClientDashData } from "@/redux/actions/authActions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IconBoxSeam, IconHeart, IconStar } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { convertUppercaseToNormal } from "@/redux/utils/opts";

function AccountPage() {
    const t = useTranslations("AccountPage");
    const alltrans = useTranslations("");
    const { user } = useAppSelector((state) => state.auth);
    const { wishItems } = useAppSelector((state) => state.wishlist);
    const [data, setData] = useState(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(getClientDashData()).then((res) => {
            setData(res.data);
        });
    }, []);
    const uniqueProductIds = new Set();

    return (
        <>
            <div className="rounded-1 fs-14 mt-3">
                <div className="mb-3 fs-5 text-end fw-medium">
                    {t("hello")},{" "}
                    <span className="fw-bold  text-main">
                        {user?.first_name}
                    </span>
                </div>

                <div className="row align-items-center">
                    <div className="col-6 pb-2 col-md-4 text-secondary  px-2">
                        <Link href="/wishlist">
                            <div className="bg-white rounded-1 p-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-dark fw-bold fs-15">
                                        {t("inWishlist")}
                                    </div>
                                    <div className="fs-12">
                                        {wishItems.length} {t("product")}
                                    </div>
                                </div>
                                <div>
                                    <IconHeart size={24} />
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-6 pb-2 col-md-4 text-secondary px-2">
                        <Link href="/account/orders">
                            <div className="bg-white  rounded-1 p-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-dark fw-bold fs-15">
                                        {t("orders")}
                                    </div>
                                    <div className="fs-12">
                                        {data?.order_item_count} {t("orders")}
                                    </div>
                                </div>
                                <div>
                                    <IconBoxSeam size={24} />
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-6 pb-2 col-md-4 text-secondary px-2">
                        <Link href="/account/reviews">
                            <div className="bg-white rounded-1 p-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-dark fw-bold fs-15">
                                        {t("reviews")}
                                    </div>
                                    <div className="fs-12">
                                        {data?.review_count} {t("reviews")}
                                    </div>
                                </div>
                                <div>
                                    <IconStar size={24} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {data?.last_order_items &&
                    Array.isArray(data?.last_order_items) &&
                    data.last_order_items.length > 0 && (
                        <>
                            <div className="bg-white p-3 mt-4">
                                <div className="fw-bold  fs-6 mb-3">
                                    {t("yourLastOrders")}
                                </div>
                                <div className="row row-cols-2 row-gap-2 row-cols-md-3 row-cols-lg-4 ">
                                    {data.last_order_items.map((item) => (
                                        <div key={item.id} className="px-1">
                                            <div
                                                role="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/account/orders/order/${item.uuid}/${item.id}`
                                                    )
                                                }
                                                className="border rounded-small p-3 text-center"
                                            >
                                                <div>
                                                    {alltrans(
                                                        `OrderItemStates.${item.status}`
                                                    )}
                                                </div>
                                                <div className="my-1 fw-bold ">
                                                    ${item.total_price}
                                                </div>
                                                <div className="text-muted">
                                                    {item.quantity} {t("items")}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-3 mt-4">
                                <div className="fw-bold  fs-6 mb-3">
                                    {t("buyAgain")}
                                </div>
                                <div className="row row-cols-2 row-gap-2 row-cols-md-4 row-cols-lg-5 ">
                                    {Array.isArray(data.last_order_items) &&
                                        data.last_order_items.length > 0 &&
                                        data.last_order_items.map((item) => {
                                            if (
                                                !uniqueProductIds.has(
                                                    item?.product?.id
                                                )
                                            ) {
                                                uniqueProductIds.add(
                                                    item?.product?.id
                                                );
                                                return (
                                                    <Link
                                                        key={item?.product?.id}
                                                        href={`/products/${item?.product?.slug}/${item?.product?.id}`}
                                                        className="px-1"
                                                    >
                                                        <div className="border p-1 py-2 rounded-small">
                                                            <img
                                                                src={
                                                                    item
                                                                        ?.product
                                                                        ?.image
                                                                }
                                                                alt=""
                                                                className="img-fluid"
                                                            />
                                                        </div>
                                                    </Link>
                                                );
                                            }
                                            return null; // Return null for duplicate products
                                        })}
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </>
    );
}

export default AccountPage;
