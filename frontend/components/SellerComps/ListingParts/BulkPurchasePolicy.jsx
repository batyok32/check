import { containerRecommendations } from "@/components/utils/dbs";
import isEmpty from "@/components/utils/isEmpty";
import { validateBulkPolicyFormData } from "@/components/utils/validateForm";
// import { isEmptyTrimmed } from "@/components/utils/validateForm";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

function BulkPurchasePolicy({ formData, setFormData }) {
    const t = useTranslations();

    const [bulkPoliciesFormData, setBulkPoliciesFormData] = useState({
        id: crypto.randomUUID(),
        minimumQuantity: 1,
        price: 1,
        min_lead_time: 1,
        max_lead_time: 2,
        containerName: null,
        containerHeight: null,
        containerLength: null,
        containerWidth: null,
        containerWeight: null,
    });
    const [bulkPolicyFormErrors, setBulkPolicyFormErrors] = useState(null);

    const addNewBulkPolicy = () => {
        setStartShowingErrors(true);
        if (!isEmpty(bulkPolicyFormErrors)) {
            return;
        }
        setFormData({
            ...formData,
            bulkPurchasePolicies: [
                ...formData.bulkPurchasePolicies,
                bulkPoliciesFormData,
            ],
        });

        // Reset form for next input
        setBulkPoliciesFormData({
            ...bulkPoliciesFormData,
            id: crypto.randomUUID(),
            minimumQuantity: parseInt(bulkPoliciesFormData.minimumQuantity) + 1,
            price: bulkPoliciesFormData.price,
            min_lead_time: 1,
            max_lead_time: 2,
        });

        setBulkPolicyFormErrors(null); // Clear any existing errors
    };

    const deleteBulkPolicy = (id) => {
        setFormData({
            ...formData,
            bulkPurchasePolicies: formData.bulkPurchasePolicies.filter(
                (policy) => policy.id !== id
            ),
        });
    };

    useEffect(() => {
        setFormData({
            ...formData,
            bulkPurchasePolicies: [],
        });
    }, [formData.sellingInContainers]);

    const [recommendedContainerImage, setRecommendedContainerImage] =
        useState(null);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        if (
            [
                "containerHeight",
                "containerLength",
                "containerWidth",
                "containerWeight",
                "minimumQuantity",
                "price",
                "min_lead_time",
                "max_lead_time",
            ].includes(name)
        ) {
            if (parseFloat(value) < 1 || isNaN(parseFloat(value))) {
                return; // Do not update state if value is less than 1
            }
        }
        setRecommendedContainerImage(null);
        setBulkPoliciesFormData({
            ...bulkPoliciesFormData,
            [name]: value,
        });
    };

    useEffect(() => {
        const lastPolicy =
            formData.bulkPurchasePolicies[
                formData.bulkPurchasePolicies.length - 1
            ];

        setBulkPolicyFormErrors(
            validateBulkPolicyFormData(
                bulkPoliciesFormData,
                formData.sellingInContainers,
                lastPolicy,
                t
            )
        );
    }, [bulkPoliciesFormData]);
    const [startShowingErrors, setStartShowingErrors] = useState(false);

    return (
        <div>
            <hr />
            <h4 className="mt-4 fw-bold ">
                {t("Listings.bulkPurchasePolicy")}
            </h4>
            <div className="text-muted fs-14 mb-3">
                {t("Listings.bulkPurchasePolicyDescription")}
            </div>
            <div className="px-md-3">
                {!formData.sellingInContainers &&
                    formData.bulkPurchasePolicies.length > 0 && (
                        <div className=" mt-3 fs-15 text-dark ">
                            {t("Listings.minQuantityMessage")}{" "}
                            <span className="text-main fw-bold">
                                {
                                    formData.bulkPurchasePolicies[0]
                                        .minimumQuantity
                                }{" "}
                                {t("Listings.count")}
                            </span>
                        </div>
                    )}
                <div className="row row-cols-lg-2 flex-wrap  row-gap-2 my-3">
                    {formData.bulkPurchasePolicies.map((policy) => (
                        <div key={policy.id} className="px-1">
                            <div className="fs-14 border border-2 py-3 px-3 ">
                                {formData.sellingInContainers ? (
                                    <>
                                        <div className=" d-flex gap-4 align-items-center  justify-content-between">
                                            <div>
                                                <div>
                                                    {t("amountinside")}:{" "}
                                                    <strong>
                                                        {policy.minimumQuantity}
                                                    </strong>
                                                </div>
                                                <div>
                                                    {t("price")}:{" "}
                                                    <strong>
                                                        ${policy.price}
                                                    </strong>
                                                </div>
                                                <div>
                                                    {t("leadtime")}:{" "}
                                                    <strong>
                                                        {policy.min_lead_time} -{" "}
                                                        {policy.max_lead_time}{" "}
                                                        {t("CartItem.days")}
                                                    </strong>
                                                </div>
                                                <div>
                                                    {t("Containername")}:{" "}
                                                    <strong>
                                                        {policy.containerName}
                                                    </strong>
                                                </div>
                                                <div>
                                                    {t("Containerdimensions")}:{" "}
                                                    <strong>
                                                        (
                                                        {policy.containerHeight}
                                                        x
                                                        {policy.containerLength}
                                                        x{policy.containerWidth}
                                                        ) {t("meters")}
                                                    </strong>
                                                </div>
                                                <div>
                                                    {t("Containerweight")}:{" "}
                                                    <strong>
                                                        {policy.containerWeight}{" "}
                                                        {t("kg")}
                                                    </strong>
                                                </div>
                                                {formData?.limited && (
                                                    <div>
                                                        {t(
                                                            "averageAmountCanSell"
                                                        )}
                                                        :{" "}
                                                        <strong>
                                                            {formData.quantity /
                                                                policy.minimumQuantity >=
                                                            1
                                                                ? formData.quantity /
                                                                  policy.minimumQuantity
                                                                : t(
                                                                      "notselling"
                                                                  )}{" "}
                                                        </strong>
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className=" d-flex justify-content-end "
                                                role="button"
                                                onClick={() =>
                                                    deleteBulkPolicy(policy.id)
                                                }
                                            >
                                                <IconTrash
                                                    size={18}
                                                    className="text-danger"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            {t("Listings.bulkmessage1")}{" "}
                                            <strong>
                                                {policy.minimumQuantity}{" "}
                                                {t("Listings.count")}
                                            </strong>{" "}
                                            {t("Listings.bulkmessage2")}{" "}
                                            <strong>${policy.price}</strong>{" "}
                                            {t("Listings.bulkmessage3")}{" "}
                                            <strong>
                                                {" "}
                                                {policy.min_lead_time} -{" "}
                                                {policy.max_lead_time}{" "}
                                                {t("CartItem.days")}
                                            </strong>{" "}
                                            {t("Listings.bulkmessage4")}
                                        </div>
                                        <div
                                            className=" d-flex justify-content-end "
                                            role="button"
                                            onClick={() =>
                                                deleteBulkPolicy(policy.id)
                                            }
                                        >
                                            <IconTrash
                                                size={18}
                                                className="text-danger"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row row-gap-3 mx-0 pb-3 align-items-end border p-3">
                    <div className="col-md-3">
                        <label htmlFor="minimumQuantity" className="fs-14">
                            {formData?.sellingInContainers
                                ? "Quantity inside"
                                : t("Listings.minQuantity")}
                        </label>
                        <input
                            type="number"
                            id="minimumQuantity"
                            className="form-control border shadow-none rounded-small fs-14  sm-placeholder"
                            placeholder={t("Listings.minQuantity")}
                            value={bulkPoliciesFormData.minimumQuantity}
                            min={1}
                            onChange={(e) =>
                                setBulkPoliciesFormData({
                                    ...bulkPoliciesFormData,
                                    minimumQuantity: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="priceOfBulk" className="fs-14">
                            {t("Listings.price")} ($)
                        </label>
                        <input
                            type="number"
                            id="priceOfBulk"
                            className="form-control border shadow-none rounded-small fs-14  sm-placeholder"
                            placeholder={t("Listings.price")}
                            min={1}
                            value={bulkPoliciesFormData.price}
                            onChange={(e) =>
                                setBulkPoliciesFormData({
                                    ...bulkPoliciesFormData,
                                    price: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="col-md d-flex gap-1">
                        <div>
                            <label htmlFor="leadTime" className="fs-14">
                                {t("Listings.minLeadTime")} (
                                {t("CartItem.days")})
                            </label>
                            <input
                                type="number"
                                id="leadTime"
                                className="form-control border shadow-none rounded-small fs-14  sm-placeholder"
                                placeholder={t("Listings.minLeadTime")}
                                min={1}
                                value={bulkPoliciesFormData.min_lead_time}
                                onChange={(e) =>
                                    setBulkPoliciesFormData({
                                        ...bulkPoliciesFormData,
                                        min_lead_time: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="maxleadTime" className="fs-14">
                                {t("Listings.maxLeadTime")} (
                                {t("CartItem.days")})
                            </label>
                            <input
                                type="number"
                                id="maxleadTime"
                                className="form-control border shadow-none rounded-small fs-14  sm-placeholder"
                                placeholder={t("Listings.maxLeadTime")}
                                min={
                                    parseInt(
                                        bulkPoliciesFormData.min_lead_time
                                    ) + 1
                                }
                                value={bulkPoliciesFormData.max_lead_time}
                                onChange={(e) =>
                                    setBulkPoliciesFormData({
                                        ...bulkPoliciesFormData,
                                        max_lead_time: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="col-auto ">
                        <button
                            onClick={() => addNewBulkPolicy()}
                            // disabled={
                            //     !variationCategoryAddValue &&
                            //     !variationCategoryAddValue?.trim()?.length >
                            //         0
                            // }
                            className="btn btn-main fs-14 rounded-small w-100"
                        >
                            <IconPlus />
                        </button>
                    </div>
                    {formData?.sellingInContainers && (
                        <div className="mt-3">
                            <div className="d-flex mb-2 justify-content-between align-items-center">
                                <div className="fs-14 fw-medium">
                                    {t("containersettings")}
                                </div>
                                <div>
                                    {" "}
                                    <select
                                        className="form-select fs-14  rounded-0 border shadow-none "
                                        aria-label="Default select example"
                                        required
                                        onChange={(e) => {
                                            const foundBox =
                                                containerRecommendations.find(
                                                    (box) =>
                                                        box.name ===
                                                        e.target.value
                                                );

                                            const itemDimensionBox =
                                                foundBox?.dimensions[0];

                                            setBulkPoliciesFormData({
                                                ...bulkPoliciesFormData,
                                                containerHeight:
                                                    itemDimensionBox?.height
                                                        ? itemDimensionBox.height
                                                        : foundBox
                                                              ?.dimensions[0]
                                                              .height,
                                                containerLength:
                                                    itemDimensionBox?.length
                                                        ? itemDimensionBox.length
                                                        : foundBox
                                                              ?.dimensions[0]
                                                              .length,
                                                containerWidth:
                                                    itemDimensionBox?.width
                                                        ? itemDimensionBox.width
                                                        : foundBox
                                                              ?.dimensions[0]
                                                              .width,
                                                containerWeight: "",
                                                containerName: foundBox?.name,
                                            });
                                            setRecommendedContainerImage({
                                                image: foundBox.image,
                                                name: foundBox.name,
                                            });
                                        }}
                                    >
                                        <option value="" disabled selected>
                                            {t("standartcontainers")}
                                        </option>

                                        {containerRecommendations &&
                                            containerRecommendations.map(
                                                (box) => {
                                                    const itemDimensionBox =
                                                        box.dimensions.find(
                                                            (dimension) =>
                                                                dimension.unit ===
                                                                "m"
                                                        );

                                                    return (
                                                        <option
                                                            key={box.name}
                                                            value={box.name}
                                                        >
                                                            {box.name} (
                                                            {t("LxHxW")}) - (
                                                            {
                                                                itemDimensionBox?.length
                                                            }
                                                            x
                                                            {
                                                                itemDimensionBox?.height
                                                            }
                                                            x
                                                            {
                                                                itemDimensionBox?.width
                                                            }
                                                            ) {t("meters")}
                                                        </option>
                                                    );
                                                }
                                            )}
                                    </select>
                                </div>
                            </div>

                            {recommendedContainerImage ? (
                                <div className="d-flex mb-3 fs-15">
                                    <div>
                                        <img
                                            src={
                                                recommendedContainerImage?.image
                                            }
                                            style={{
                                                height: "50px",
                                                width: "50px",
                                            }}
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control ms-2 rounded-small shadow-none border fs-15"
                                            placeholder={t("Containername")}
                                            value={
                                                bulkPoliciesFormData.containerName
                                            }
                                            min={1}
                                            onChange={(e) => onChangeInput(e)}
                                            name="containerName"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex mb-3 fs-15 ">
                                    <div>
                                        <img
                                            src="https://www.oceanboxcontainers.com/wp-content/uploads/2022/06/20ft-shipping-container-Mockup-only.jpg"
                                            style={{
                                                height: "50px",
                                                width: "50px",
                                            }}
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control ms-2 rounded-small shadow-none border fs-15"
                                            placeholder={t("Containername")}
                                            value={
                                                bulkPoliciesFormData.containerName
                                            }
                                            min={1}
                                            onChange={(e) => onChangeInput(e)}
                                            name="containerName"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="row row-gap-2">
                                <div className="col-6">
                                    <input
                                        type="number"
                                        className="form-control rounded-small shadow-none border fs-15"
                                        placeholder={t("Listings.length")}
                                        value={
                                            bulkPoliciesFormData.containerLength
                                        }
                                        min={1}
                                        onChange={(e) => onChangeInput(e)}
                                        name="containerLength"
                                    />
                                </div>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        className="form-control rounded-small shadow-none border fs-15"
                                        placeholder={t("Listings.height")}
                                        value={
                                            bulkPoliciesFormData.containerHeight
                                        }
                                        min={1}
                                        onChange={(e) => onChangeInput(e)}
                                        name="containerHeight"
                                    />
                                </div>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        className="form-control rounded-small shadow-none border fs-15"
                                        placeholder={t("Listings.width")}
                                        value={
                                            bulkPoliciesFormData.containerWidth
                                        }
                                        min={1}
                                        onChange={(e) => onChangeInput(e)}
                                        name="containerWidth"
                                    />
                                </div>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        className="form-control rounded-small shadow-none border fs-15"
                                        placeholder={t("Listings.weight")}
                                        value={
                                            bulkPoliciesFormData.containerWeight
                                        }
                                        min={1}
                                        onChange={(e) => {
                                            onChangeInput(e);
                                        }}
                                        name="containerWeight"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {startShowingErrors &&
                        bulkPolicyFormErrors &&
                        Object.keys(bulkPolicyFormErrors).length > 0 && (
                            <div className="col-12 fs-14 text-danger">
                                {Object.values(bulkPolicyFormErrors).map(
                                    (error, index) => (
                                        <div key={index}>{error}</div>
                                    )
                                )}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default BulkPurchasePolicy;
