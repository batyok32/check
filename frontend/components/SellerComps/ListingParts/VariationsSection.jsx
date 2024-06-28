import React, { useState } from "react";
import VariationCategory from "../VariationCategory/VariationCategory";
import VariationQuantityTablePart from "./VariationQuantityTablePart";
import { capitalize } from "@/components/utils/jsutils";
import { IconPlus, IconTablePlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

function VariationsSection({ formData, setFormData }) {
    const [variationCategoryShowAddInput, setVariationCategoryShowAddInput] =
        useState(false);
    const [variationCategoryAddValue, setVariationCategoryAddValue] =
        useState(null);
    const t = useTranslations();

    const addNewVariationCategory = () => {
        const variation = capitalize(variationCategoryAddValue);
        const categoryExists = formData.variationCategories.some(
            (category) =>
                category.name.toLowerCase() === variation.toLowerCase()
        );

        if (!categoryExists) {
            const newCategory = {
                name: variation,
                variations: [],
            };

            setFormData({
                ...formData,
                variationCategories: [
                    ...formData.variationCategories,
                    newCategory,
                ],
            });
        } else {
            console.log(`The category '${variation}' already exists.`);
        }

        setVariationCategoryAddValue("");
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mt-3 fw-bold">{t("Listings.variations")}</h4>
                    <div className="text-muted fs-14 mb-3">
                        {t("Listings.variationsDescription")}
                    </div>
                </div>
                <div>
                    <div
                        role="button"
                        className="border bg-white fs-15 px-3 py-2 rounded-small"
                        onClick={() =>
                            setVariationCategoryShowAddInput(
                                !variationCategoryShowAddInput
                            )
                        }
                    >
                        <span className="d-none d-md-inline">
                            <IconTablePlus size={20} className="me-1" />{" "}
                            {t("Listings.addVariation")}
                        </span>
                        <span className="d-inline d-md-none">
                            {t("AddressEditModal.Add")}
                        </span>
                    </div>
                </div>
            </div>
            {variationCategoryShowAddInput && (
                <div className="row row-gap-3  pb-3 align-items-center">
                    <div className="col col-md-5">
                        <input
                            type="text"
                            className="form-control border shadow-none rounded-small fs-14  sm-placeholder"
                            placeholder={t("Listings.variations")}
                            value={variationCategoryAddValue}
                            onChange={(e) =>
                                setVariationCategoryAddValue(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-auto col-md-1 ">
                        <button
                            onClick={() => addNewVariationCategory()}
                            disabled={
                                !variationCategoryAddValue &&
                                !variationCategoryAddValue?.trim()?.length > 0
                            }
                            className="btn btn-main fs-14 rounded-small w-100"
                        >
                            <IconPlus />
                        </button>
                    </div>
                </div>
            )}
            {formData.variationCategories &&
                (formData.variationCategories || []).map((category, index) => (
                    <VariationCategory
                        key={index}
                        category={category}
                        index={index}
                        formData={formData}
                        setFormData={setFormData}
                    />
                ))}

            {/* ----------------------------VARIATION QUANTITY-------------------------------------------------------------------------- */}
            {formData.variationCategories &&
                formData.variationCategories.length > 0 &&
                formData.variationCategories[0]?.variations.length > 0 &&
                formData.limited && (
                    <VariationQuantityTablePart
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}
        </>
    );
}

export default VariationsSection;
