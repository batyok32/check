"use client";
import { retrieveSellerOrder } from "@/redux/actions/sellerActions";
import {
    createOrderItemBox,
    fetchOrders,
    retrieveCustomerOrder,
} from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
    const { id } = useParams();
    const t = useTranslations();
    const [orderItem, setOrderItem] = useState(null);
    const dispatch = useAppDispatch();
    const [newBox, setNewBox] = useState({
        boxLength: "",
        boxWidth: "",
        boxHeight: "",
        boxWeight: "",
        itemsAmount: "",
    });
    const [boxes, setBoxes] = useState([]);
    const [measuringUnits, setMeasuringUnits] = useState({
        dimensionUnit: "",
        weightUnit: "",
    });
    const router = useRouter();

    const onSubmit = () => {
        if (!Object.values(newBox).every((value) => value !== "")) {
            toast.error(t("Listings.fillInMessage"), {
                className: "fs-14",
            });
            console.log("NEW BOX", newBox);
            return;
        }

        setBoxes([...boxes, newBox]);
        setNewBox({
            boxLength: "",
            boxWidth: "",
            boxHeight: "",
            boxWeight: "",
            itemsAmount: "",
        });
    };

    const handleChange = (e, field) => {
        const { value } = e.target;
        // Allow only numbers and decimals
        if (/^\d*\.?\d*$/.test(value) || value === "") {
            setNewBox({ ...newBox, [field]: value });
        }
    };

    useEffect(() => {
        if (id) {
            dispatch(retrieveSellerOrder(id)).then((res) => {
                if (res?.status > 205) {
                    setOrderItem(null);
                    toast.error(t("notfound"), { className: "fs-14" });
                    router.push("/seller/orders");
                    return;
                } else {
                    setOrderItem(res.data);
                    if (res.data?.product) {
                        setMeasuringUnits({
                            dimensionUnit: res.data?.product?.dimensions_unit,
                            weightUnit: res.data?.product?.weight_unit,
                        });
                    }
                }
            });
        }
    }, [id]);

    const setOrderItemBoxes = () => {
        if (boxes.length > 0 && orderItem) {
            const refinedBoxes = boxes.map(
                ({
                    boxLength,
                    boxWidth,
                    boxHeight,
                    boxWeight,
                    itemsAmount,
                }) => ({
                    length: parseFloat(boxLength),
                    width: parseFloat(boxWidth),
                    height: parseFloat(boxHeight),
                    weight: parseFloat(boxWeight),
                    items_amount: parseInt(itemsAmount),
                    dimension_unit: measuringUnits.dimensionUnit, // Change "unit" to the correct unit value
                    weight_unit: measuringUnits.weightUnit, // Change "unit" to the correct unit value
                })
            );

            dispatch(
                createOrderItemBox({
                    boxes: refinedBoxes,
                    order_item: orderItem.id,
                })
            ).then((res) => {
                if (res.status > 205) {
                    toast.error(t("AddressEditModal.errorOccurred"), {
                        className: "fs-14",
                    });
                } else {
                    toast.success(t("Listings.boxesError"), {
                        className: "fs-14",
                    });
                    setBoxes([]);
                    setNewBox({});
                    router.push("/seller/orders/");
                }
            });
        } else {
            toast.error(t("Listings.boxesWarning"), { className: "fs-14" });
        }
    };

    return (
        <div className="pb-4">
            <div className="row mx-2 mt-3">
                <div className="col-md-8 bg-white mx-auto shadow-sm rounded-small py-4 ">
                    <div className="px-4">
                        <h5 className=" fw-medium mb-3 text-center ">
                            {t("Listings.boxes")}#{orderItem?.id}{" "}
                        </h5>
                        <div>
                            <div className="table-responsive">
                                <table class="table fs-13 table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">
                                                {t("Listings.dimensions")}
                                            </th>
                                            <th scope="col">
                                                {t("Listings.weight")}
                                            </th>
                                            <th scope="col">
                                                {t("Listings.itemsInside")}
                                            </th>
                                            <th scope="col">
                                                {t("Address.actions")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boxes.map((box, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{`${box.boxLength}x${box.boxWidth}x${box.boxHeight} ${measuringUnits.dimensionUnit}`}</td>
                                                <td>{`${box.boxWeight} ${measuringUnits.weightUnit}`}</td>
                                                <td>{box.itemsAmount}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-danger p-0 m-0 "
                                                        onClick={() => {
                                                            const updatedBoxes =
                                                                [...boxes];
                                                            updatedBoxes.splice(
                                                                index,
                                                                1
                                                            );
                                                            setBoxes(
                                                                updatedBoxes
                                                            );
                                                        }}
                                                    >
                                                        <IconTrash
                                                            size={18}
                                                            className="mb-3"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {boxes.length > 0 && (
                                <div className="d-flex justify-content-end mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setOrderItemBoxes()}
                                        className="btn btn-main rounded-small fw-bold fs-13"
                                    >
                                        {t("Listings.createLabels")}
                                    </button>
                                </div>
                            )}

                            <div className="row mx-0 border-top mt-4 pt-2">
                                <div className="col d-flex flex-wrap gap-1 align-items-center">
                                    <div>
                                        <label
                                            className="fs-12 fw-bold"
                                            htmlFor="boxLength"
                                        >
                                            {t("Listings.length")}
                                        </label>
                                        <input
                                            className="form-control rounded-small shadow-none border fs-13 px-0 text-center"
                                            name="boxLength"
                                            // placeholder="Length"
                                            id="boxLength"
                                            value={newBox.boxLength}
                                            onChange={(e) =>
                                                handleChange(e, "boxLength")
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label
                                            className="fs-12 fw-bold"
                                            htmlFor="boxWidth"
                                        >
                                            {t("Listings.width")}
                                        </label>
                                        <input
                                            className="form-control rounded-small shadow-none border fs-13 px-0 text-center"
                                            name="boxWidth"
                                            id="boxWidth"
                                            value={newBox.boxWidth}
                                            onChange={(e) =>
                                                handleChange(e, "boxWidth")
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="fs-12 fw-bold"
                                            htmlFor="boxHeight"
                                        >
                                            {t("Listings.height")}
                                        </label>
                                        <input
                                            className="form-control rounded-small shadow-none border fs-13 px-0 text-center"
                                            name="boxHeight"
                                            id="boxHeight"
                                            value={newBox.boxHeight}
                                            onChange={(e) =>
                                                handleChange(e, "boxHeight")
                                            }
                                        />
                                    </div>
                                    <span className="fs-13 text-muted  me-2">
                                        {measuringUnits.dimensionUnit}
                                    </span>

                                    <div>
                                        <label
                                            className="fs-12 fw-bold"
                                            htmlFor="boxWeight"
                                        >
                                            {t("Listings.weight")}
                                        </label>
                                        <input
                                            className="form-control rounded-small shadow-none border fs-13 px-0 text-center"
                                            id="boxWeight"
                                            name="boxWeight"
                                            value={newBox.boxWeight}
                                            onChange={(e) =>
                                                handleChange(e, "boxWeight")
                                            }
                                        />
                                    </div>
                                    <span className="fs-13 text-muted my-auto me-2">
                                        {measuringUnits.weightUnit}
                                    </span>

                                    <div>
                                        <label
                                            className="fs-12 fw-bold"
                                            htmlFor="boxWeight"
                                        >
                                            {t("Listings.itemsInside")}
                                        </label>
                                        <input
                                            className="form-control rounded-small shadow-none border fs-13 px-0 text-center"
                                            name="itemsAmount"
                                            id="itemsAmount"
                                            value={newBox.itemsAmount}
                                            onChange={(e) =>
                                                handleChange(e, "itemsAmount")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-3">
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    className="btn btn-main rounded-small fw-bold fs-13"
                                >
                                    {t("Listings.addNewBox")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
