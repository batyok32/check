"use client";
import {
    fetchShippingLabelsForOrderItem,
    setShippedStatusForOrderItem,
} from "@/redux/actions/sellerActions";
import { useAppDispatch } from "@/redux/hooks";
import { IconPrinter } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function Page({ params }) {
    const { id } = params;
    const [labels, setLabels] = useState([]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchShippingLabelsForOrderItem(id)).then((res) => {
            console.log("RES", res);
            if (res.status === 200) {
                setLabels(res.data);
            } else {
                setLabels([]);
            }
        });
    }, [id]);

    const printLabel = (label) => {
        dispatch(
            setShippedStatusForOrderItem({
                order_id: id,
                labels_state: "PRINTED",
                labels_is_created: true,
                status: "SHIPPED",
            })
        );
        // Send request to make order item shipped and label's status shipped
        // Print label from label.shipping_document url of pdf
        window.open(label.shipping_document, "_blank");
    };

    const t = useTranslations();

    return (
        <div>
            <div className="border-start py-2 px-2 px-md-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                <h5 className="m-0 fw-bold d-none d-md-block">
                    {t("Listings.labels")}
                </h5>
                <div
                    className="fs-14 m-0 btn-gray fw-medium px-3 py-1 rounded-small d-flex gap-2 align-items-center"
                    role="button"
                >
                    <IconPrinter size={18} />{" "}
                    <div>{t("Listings.printAll")}</div>
                </div>
            </div>
            <div className="p-4">
                <table class="table fs-14 table-hover ">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{t("Listings.courierName")}</th>
                            <th scope="col">{t("Listings.trackingNumber")}</th>
                            <th scope="col">{t("Listings.format")}</th>
                            <th scope="col">{t("Address.actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labels &&
                            labels.length > 0 &&
                            labels.map((label, index) => (
                                <tr key={index} role="button">
                                    <th>{index + 1}</th>
                                    <td className="underline-on-hover">
                                        {label.courier_name}
                                    </td>
                                    <td>{label.tracking}</td>
                                    <td>
                                        {label.shipping_document_format} /{" "}
                                        {label.shipping_document_size}
                                    </td>
                                    <td>
                                        <div
                                            onClick={() => printLabel(label)}
                                            className="fw-medium text-main "
                                            role="button"
                                        >
                                            <IconPrinter size={18} />
                                            {/* <IconTrashX size={16} /> */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
