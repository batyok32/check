"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const CategoryOption = ({ cat, filterData, setFilterData }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleOptionChange = (opt, isChecked) => {
        const optionValue = `${cat.id}:${opt}`; // Combine categoryOption ID and option value

        const updatedOptions = isChecked
            ? [...filterData.optionValues, optionValue]
            : filterData.optionValues.filter((value) => value !== optionValue);
        setFilterData({ ...filterData, optionValues: updatedOptions });
    };
    const t = useTranslations();
    return (
        <div key={cat.id}>
            {cat.unique_values.length >= 1 && (
                <div className="fw-bold">{cat.name}</div>
            )}
            <ul className="list-unstyled mt-2 mb-1">
                {cat.unique_values
                    .slice(0, isExpanded ? cat.unique_values.length : 10)
                    .map((opt) => (
                        <li key={opt}>
                            <div
                                className="form-check custom-formcheck"
                                style={{ minHeight: "1rem" }}
                            >
                                <input
                                    className="customcheckbox form-check-input"
                                    type="checkbox"
                                    name={cat.id}
                                    id={opt}
                                    checked={filterData.optionValues.includes(
                                        `${cat.id}:${opt}`
                                    )}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            opt,
                                            e.target.checked
                                        )
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={opt}
                                >
                                    {opt}
                                </label>
                            </div>
                        </li>
                    ))}
            </ul>
            {cat.unique_values.length > 10 && (
                <div
                    role="button"
                    className="  fs-13 text-muted mb-3"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? t("showLess") : t("showMore")}
                </div>
            )}
        </div>
    );
};
