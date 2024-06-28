"use client";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRef } from "react";
import { CategoryOption } from "./CategoryOption";
import { CountryOption } from "./CountryOption";
import { useTranslations } from "next-intl";

export default function MoreFiltersModal({
    children,
    parentsCategories,
    selectCategoryFn,
    setSelected,
    categories,
    categoryOptions,
    filterData,
    setFilterData,
    priceValues,
    handlePriceChange,
}) {
    const closeBtnRef = useRef(null);
    const t = useTranslations("MoreFiltersModal");
    const catlist = useTranslations("CategoriesList");
    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target="#moreFiltersModal"
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id="moreFiltersModal"
                // tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-small border-0 shadow-sm">
                        <div className="modal-header ">
                            <div
                                className="modal-title fs-5 py-0 fw-bold"
                                id="exampleModalLabel"
                            >
                                {t("moreFilters")}
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="ps-0 fs-14 ">
                                <div className="bg-white p-3 ">
                                    <div>
                                        <div className="fw-bold">
                                            {t("categories")}
                                        </div>

                                        <ul className="list-unstyled custom-list mt-2 ">
                                            {parentsCategories?.map(
                                                (categor) => (
                                                    <li
                                                        key={categor.id}
                                                        onClick={() => {
                                                            selectCategoryFn(
                                                                categor
                                                            );
                                                        }}
                                                        className="ms-1 fw-medium underline-on-hover d-flex align-items-center"
                                                        role="button"
                                                        // style={{ fontSize: "16px" }}
                                                    >
                                                        <IconChevronLeft
                                                            size={16}
                                                        />{" "}
                                                        {categor?.name}
                                                        {/* {catlist(categor?.name)} */}
                                                    </li>
                                                )
                                            )}
                                            <li className="mb-1"></li>
                                            {categories?.map((category) => (
                                                <li
                                                    key={category.id}
                                                    onClick={() =>
                                                        setSelected(category.id)
                                                    }
                                                    role="button"
                                                    className=""
                                                >
                                                    {category.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {categoryOptions &&
                                        categoryOptions.length > 0 &&
                                        categoryOptions.map((cat) => (
                                            <CategoryOption
                                                key={cat.id}
                                                filterData={filterData}
                                                setFilterData={setFilterData}
                                                cat={cat}
                                            />
                                        ))}
                                    <CountryOption
                                        filterData={filterData}
                                        setFilterData={setFilterData}
                                    />
                                    <div>
                                        <div className="fw-bold">
                                            {t("price")}
                                        </div>
                                        <div className="d-flex gap-1 mt-2">
                                            <div>
                                                <div>{t("min")}:</div>
                                                <div className="border d-flex align-items-center rounded-small py-1 ps-1 pe-1">
                                                    <input
                                                        type="number"
                                                        className="form-control border-0 shadow-none p-0 fs-14 rounded-0"
                                                        id="exampleInputEmail1"
                                                        aria-describedby="emailHelp"
                                                        value={
                                                            priceValues.min ||
                                                            null
                                                        }
                                                        onChange={(e) =>
                                                            handlePriceChange(
                                                                e,
                                                                "min"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div>{t("max")}:</div>
                                                <div className="border d-flex align-items-center rounded-small pe-1 ps-1 py-1">
                                                    <input
                                                        type="number"
                                                        className="form-control border-0 shadow-none p-0 fs-14 rounded-0 "
                                                        id="exampleInputEmail1"
                                                        aria-describedby="emailHelp"
                                                        value={
                                                            priceValues.max ||
                                                            null
                                                        }
                                                        onChange={(e) =>
                                                            handlePriceChange(
                                                                e,
                                                                "max"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-main fs-14"
                                data-bs-dismiss="modal"
                                ref={closeBtnRef}
                            >
                                {t("cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
