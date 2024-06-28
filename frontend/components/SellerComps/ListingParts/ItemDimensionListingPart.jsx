import {
    lengthMeasuringUnits,
    weightMeasuringUnits,
} from "@/components/utils/dbs";
import { useTranslations } from "next-intl";
import React from "react";

function ItemDimensionListingPart({ formData, setFormData }) {
    const t = useTranslations();

    const onChange = (e) => {
        const { name, value } = e.target;
        if (["height", "length", "width", "weight"].includes(name)) {
            if (parseFloat(value) < 0.1 || isNaN(parseFloat(value))) {
                return; // Do not update state if value is less than 1
            }
            setFormData({
                ...formData,
                itemDimension: {
                    ...formData.itemDimension,
                    [name]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const onBlur = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseFloat(value);
        if (parsedValue < 0.1 || isNaN(parsedValue)) {
            setFormData({
                ...formData,
                itemDimension: {
                    ...formData.itemDimension,
                    [name]: "",
                },
            });
        } else {
            setFormData({
                ...formData,
                itemDimension: {
                    ...formData.itemDimension,
                    [name]: parsedValue,
                },
            });
        }
    };

    return (
        <div>
            {" "}
            <hr />
            <h4 className="mt-3 fw-bold ">{t("Listings.itemDimensions")}</h4>
            <div className="text-muted fs-14 mb-3">
                {t("Listings.itemDimensionDescription")}
            </div>
            <div className="row mb-2 mt-3">
                <div className="col-6">
                    <select
                        className="form-select fs-14  rounded-0 border shadow-none"
                        id="lengthMeasuringUnit"
                        name="lengthMeasuringUnit"
                        value={formData.lengthMeasuringUnit}
                        onChange={onChange}
                        aria-label="Default select example"
                        required
                    >
                        <option value="" disabled>
                            {t("Listings.lengthMeasuringUnit")}
                        </option>

                        {lengthMeasuringUnits.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-6">
                    <select
                        className="form-select fs-14  rounded-0 border shadow-none"
                        id="weightMeasuringUnit"
                        name="weightMeasuringUnit"
                        value={formData.weightMeasuringUnit}
                        onChange={onChange}
                        aria-label="Default select example"
                        required
                    >
                        <option value="" disabled>
                            {t("Listings.weightMeasuringUnit")}
                        </option>

                        {weightMeasuringUnits.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="border-bottom my-4"></div>
            <div className="row row-gap-2">
                <div className="col-6 col-md-3">
                    <input
                        type="number"
                        name="height"
                        className="form-control rounded-small shadow-none border fs-15"
                        placeholder={t("Listings.heightIn", {
                            lengthMeasuringUnit: formData.lengthMeasuringUnit,
                        })}
                        value={formData.itemDimension.height}
                        onChange={(e) => onChange(e)}
                        onBlur={onBlur}
                        step={0.1}
                    />
                </div>
                <div className="col-6 col-md-3">
                    <input
                        type="number"
                        name="length"
                        className="form-control rounded-small shadow-none border fs-15"
                        placeholder={t("Listings.lengthIn", {
                            lengthMeasuringUnit: formData.lengthMeasuringUnit,
                        })}
                        value={formData.itemDimension.length}
                        onChange={(e) => onChange(e)}
                        onBlur={onBlur}
                        step={0.1}
                    />
                </div>
                <div className="col-6 col-md-3">
                    <input
                        type="number"
                        name="width"
                        className="form-control rounded-small shadow-none border fs-15"
                        placeholder={t("Listings.widthIn", {
                            lengthMeasuringUnit: formData.lengthMeasuringUnit,
                        })}
                        value={formData.itemDimension.width}
                        onChange={(e) => onChange(e)}
                        onBlur={onBlur}
                        step={0.1}
                    />
                </div>
                <div className="col-6 col-md-3">
                    <input
                        type="number"
                        name="weight"
                        className="form-control rounded-small shadow-none border fs-15"
                        placeholder={t("Listings.weightIn", {
                            lengthMeasuringUnit: formData.weightMeasuringUnit,
                        })}
                        value={formData.itemDimension.weight}
                        onChange={(e) => onChange(e)}
                        onBlur={onBlur}
                        step={0.1}
                    />
                </div>
            </div>
        </div>
    );
}

export default ItemDimensionListingPart;
