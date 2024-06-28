"use client";
import { capitalize } from "@/components/utils/jsutils";
import { IconMinus, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function VariationCategory({
    index,
    category,
    formData,
    setFormData,
}) {
    const [variationCategoryAddValue, setVariationCategoryAddValue] =
        useState(null);

    const deleteVariationCategory = () => {
        const updatedVariationCategories = formData.variationCategories.filter(
            (_, i) => i !== index
        );
        setFormData({
            ...formData,
            variationCategories: updatedVariationCategories,
        });
    };

    const addNewVariation = () => {
        const addValue = capitalize(variationCategoryAddValue);
        console.log("ADDING NEW VAIRAIONT", addValue);
        // const categoryExists = formData.variationCategories[
        //     index
        // ].variations.some(
        //     (category) => category.name.toLowerCase() === addValue.toLowerCase()
        // );
        const categoryExists = formData.variationCategories.some(
            (categoryGroup) =>
                categoryGroup.variations.some(
                    (category) =>
                        category.name.toLowerCase() === addValue.toLowerCase()
                )
        );

        console.log("CATEGORY EXIST", categoryExists);
        if (!categoryExists) {
            const updatedVariationCategories = [
                ...formData.variationCategories,
            ];
            console.log("CATEGORY NOT EXIST", categoryExists);
            // Push the new variation to the category
            updatedVariationCategories[index].variations.push({
                name: addValue, // Trim the value to remove any leading/trailing whitespace
            });
            console.log(
                "UPDATED VARIAIONT CATEGORY",
                updatedVariationCategories
            );

            // Update formData with the new set of variationCategories
            setFormData({
                ...formData,
                variationCategories: updatedVariationCategories,
            });
            console.log("FORMDATA UPDATED", formData);
        }
        // Reset the input field for adding new variation names
        setVariationCategoryAddValue("");
    };

    const deleteVariation = (ind) => {
        const updatedVariationCategories = [...formData.variationCategories];
        updatedVariationCategories[index].variations.splice(ind, 1);
        setFormData({
            ...formData,
            variationCategories: updatedVariationCategories,
        });
    };
    const t = useTranslations();
    return (
        <div key={index}>
            <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                <h6 className="">
                    {t("Listings.variationName")} {index + 1}: {category?.name}
                </h6>
                <div
                    role="button"
                    className="border bg-white fs-15 px-3 py-2 rounded-small ms-auto"
                    onClick={() => deleteVariationCategory()}
                >
                    <span className="d-none d-md-inline">
                        <IconMinus size={20} className="me-1" />{" "}
                        {t("Listings.removeVariation")}
                    </span>
                    <span className="d-inline d-md-none">
                        {" "}
                        <IconMinus size={20} className="me-1" />{" "}
                        {t("Listings.remove")}
                    </span>
                </div>
            </div>

            <div className="mx-md-3 mt-4 border p-4 bg-white shadow-sm rounded-small">
                {formData.variationCategories[index]?.variations &&
                    formData.variationCategories[index].variations.map(
                        (variation, idx) => (
                            <div
                                key={idx}
                                className="d-flex fs-15 align-items-center mb-3"
                            >
                                <div className="fw-medium">
                                    {variation.name}
                                </div>
                                <div className="d-flex ms-3 gap-2">
                                    <div
                                        className="border rounded-small py-1 px-2"
                                        role="button"
                                        onClick={() => deleteVariation(idx)}
                                    >
                                        <IconTrash size={18} />
                                    </div>
                                    {/* <div
                                        className="border rounded-small py-1 px-2"
                                        role="button"
                                    >
                                        <IconPencil size={18} />
                                    </div> */}
                                </div>
                            </div>
                        )
                    )}
                {formData.variationCategories[index].variations?.length > 0 && (
                    <div className="border-bottom my-3"></div>
                )}
                <div className="row mb-3 flex-wrap align-items-end">
                    <div className="col col-md-6 ">
                        <div className="fs-15 mb-1">{t("Listings.name")}</div>
                        <input
                            type="text"
                            placeholder={t("Listings.variationName")}
                            className="form-control fs-15 rounded-small border shadow-none"
                            value={variationCategoryAddValue}
                            onChange={(e) =>
                                setVariationCategoryAddValue(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-auto col-md-6 d-flex justify-content-start">
                        <button
                            onClick={() => addNewVariation()}
                            className="btn btn-main fs-14 rounded-small"
                        >
                            <span className="d-none d-md-inline">
                                {t("Listings.addVariation")}
                            </span>
                            <span className="d-inline d-md-none">
                                {" "}
                                {t("AddressEditModal.Add")}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
