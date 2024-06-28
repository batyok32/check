import { standardBoxSizes } from "@/components/utils/dbs";
import { IconBoxSeam } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

function BoxDimension({ formData, setFormData }) {
    const [showBoxRecommendations, setShowBoxRecommendations] = useState(false);
    const t = useTranslations();

    const onChange = (e) => {
        const { name, value } = e.target;
        if (parseFloat(value) < 0.1 || isNaN(parseFloat(value))) {
            return; // Do not update state if value is less than 1
        }
        setFormData({
            ...formData,
            boxDimension: {
                ...formData.boxDimension,
                [name]: value,
            },
        });
    };

    const onBlur = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseFloat(value);
        if (parsedValue < 0.1 || isNaN(parsedValue)) {
            setFormData({
                ...formData,
                boxDimension: {
                    ...formData.boxDimension,
                    [name]: "",
                },
            });
        } else {
            setFormData({
                ...formData,
                boxDimension: {
                    ...formData.boxDimension,
                    [name]: parsedValue,
                },
            });
        }
    };

    return (
        <div>
            <hr />
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                <div>
                    <h4 className="mt-3 fw-bold">
                        {t("Listings.boxdimension")}
                    </h4>
                    <div className="text-muted fs-14 mb-3">
                        {t("Listings.boxdimensiondescription")}
                    </div>
                </div>
                <div>
                    <div
                        role="button"
                        className="border  bg-white fs-15 px-3 py-2 rounded-small mb-3 mb-md-0"
                        onClick={() =>
                            setShowBoxRecommendations(!showBoxRecommendations)
                        }
                    >
                        <IconBoxSeam size={20} className="me-1" />{" "}
                        {t("Listings.showStandartBoxes")}
                    </div>
                </div>
            </div>

            {showBoxRecommendations && (
                <div>
                    <select
                        className="form-select fs-14  rounded-0 border shadow-none mb-3"
                        aria-label="Default select example"
                        required
                        onChange={(e) => {
                            const foundBox = standardBoxSizes.find(
                                (box) => box.name === e.target.value
                            );
                            const itemDimensionBox = foundBox.dimensions.find(
                                (dimension) =>
                                    dimension.unit ===
                                    formData.lengthMeasuringUnit
                            );
                            setFormData({
                                ...formData,
                                boxDimension: {
                                    height: itemDimensionBox?.height
                                        ? parseFloat(
                                              itemDimensionBox.height
                                          ).toFixed(2)
                                        : parseFloat(
                                              foundBox.dimensions[0].height
                                          ).toFixed(2),
                                    length: itemDimensionBox?.length
                                        ? itemDimensionBox.length
                                        : foundBox.dimensions[0].length,
                                    width: itemDimensionBox?.width
                                        ? itemDimensionBox.width
                                        : foundBox.dimensions[0].width,
                                    weight: 1,
                                },
                            });
                            console.log("BOX DIMENSIONS", itemDimensionBox);
                        }}
                    >
                        <option value="" disabled>
                            {t("Listings.standartBoxes")}
                        </option>

                        {standardBoxSizes.map((box) => {
                            const itemDimensionBox = box.dimensions.find(
                                (dimension) =>
                                    dimension.unit ===
                                    formData.lengthMeasuringUnit
                            );
                            const height = itemDimensionBox?.height
                                ? itemDimensionBox.height
                                : box.dimensions[0].height;
                            const length = itemDimensionBox?.length
                                ? itemDimensionBox.length
                                : box.dimensions[0].length;
                            const width = itemDimensionBox?.width
                                ? itemDimensionBox.width
                                : box.dimensions[0].width;
                            return (
                                <option key={box.name} value={box.name}>
                                    {box.name} (HxLxW) - ({height}x{length}x
                                    {width})
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}

            <div className="row row-gap-2">
                <div className="col-6">
                    <input
                        type="number"
                        step={0.1}
                        className="form-control rounded-small shadow-none border fs-15"
                        placeholder={t(`Listings.heightIn`, {
                            lengthMeasuringUnit: formData.lengthMeasuringUnit,
                        })}
                        value={formData.boxDimension.height}
                        name="height"
                        onChange={(e) => onChange(e)}
                        onBlur={onBlur}
                    />
                </div>
                <div className="col-6">
                    <input
                        type="number"
                        step={0.1}
                        name="length"
                        className="form-control rounded-small shadow-none border fs-15"
                        placeholder={t(`Listings.lengthIn`, {
                            lengthMeasuringUnit: formData.lengthMeasuringUnit,
                        })}
                        value={formData.boxDimension.length}
                        onChange={(e) => onChange(e)}
                        onBlur={onBlur}
                    />
                </div>
                <div className="col-6">
                    <input
                        type="number"
                        step={0.1}
                        name="width"
                        className="form-control rounded-small shadow-none border fs-15"
                        placeholder={t(`Listings.widthIn`, {
                            lengthMeasuringUnit: formData.lengthMeasuringUnit,
                        })}
                        value={formData.boxDimension.width}
                        onChange={(e) => onChange(e)}
                        onBlur={onBlur}
                    />
                </div>
                <div className="col-6">
                    <input
                        type="number"
                        step={0.1}
                        name="weight"
                        className="form-control rounded-small shadow-none border fs-15"
                        placeholder={t(`Listings.weightIn`, {
                            lengthMeasuringUnit: formData.weightMeasuringUnit,
                        })}
                        value={formData.boxDimension.weight}
                        onChange={(e) => onChange(e)}
                        onBlur={onBlur}
                    />
                </div>
            </div>
        </div>
    );
}

export default BoxDimension;
