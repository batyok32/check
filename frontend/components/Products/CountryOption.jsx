"use client";
import { useState } from "react";
import countries from "../utils/countries";
import { useTranslations } from "next-intl";

export const CountryOption = ({ filterData, setFilterData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const handleOptionChange = (opt, isChecked) => {
        const updatedOptions = isChecked
            ? [...filterData.originCountries, opt]
            : filterData.originCountries.filter((value) => value !== opt);
        setFilterData({ ...filterData, originCountries: updatedOptions });
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredCountries = countries
        .filter((country) =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (!searchTerm) {
                const aSelected = filterData.originCountries.includes(a.name);
                const bSelected = filterData.originCountries.includes(b.name);
                return bSelected - aSelected;
            }
            return 0;
        });

    const t = useTranslations();

    return (
        <div className="mt-3">
            <div className="fw-bold">{t("originCountries")}</div>
            <input
                type="text"
                className="form-control fs-13 rounded-small shadow-none border py-1 mt-1"
                placeholder={t("search")}
                value={searchTerm}
                onChange={handleSearchChange}
            />

            <ul
                className={`list-unstyled mt-2 mb-1 custom-list user-select-none`}
            >
                {filteredCountries
                    .slice(0, isExpanded ? countries.length : 10)
                    .map((opt) => (
                        <li key={opt.name}>
                            <div
                                className="form-check custom-formcheck"
                                style={{ minHeight: "1rem" }}
                            >
                                <input
                                    className="customcheckbox form-check-input"
                                    type="checkbox"
                                    name="countries"
                                    id={opt.name}
                                    checked={filterData.originCountries.includes(
                                        opt.name
                                    )}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            opt.name,
                                            e.target.checked
                                        )
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={opt.name}
                                    role="button"
                                >
                                    {t(`Countries.${opt.name}`)}
                                </label>
                            </div>
                        </li>
                    ))}
            </ul>
            {countries.length > 10 && (
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
