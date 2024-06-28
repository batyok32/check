"use client";
import { CategoryOption } from "@/components/Products/CategoryOption";
import MoreFiltersModal from "@/components/Products/MoreFiltersModal";
import ProductsList from "@/parts/Home/ProductsList";
import { fetchFullCategoryOptions } from "@/redux/actions/sellerActions";
import {
    fetchCategories,
    fetchNestedCategories,
} from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { getCategoryOptionsConfig } from "@/redux/utils/shop";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { CountryOption } from "@/components/Products/CountryOption";
import { findPathToSelectedId } from "@/redux/utils/product";
import { useTranslations } from "next-intl";

function Products() {
    const searchParams = useSearchParams();
    const categoryParamId = searchParams.get("category");
    const searchParamText = searchParams.get("search");
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [parentsCategories, setParentsCategories] = useState([]);
    const [count, setCount] = useState(0);
    const [filterData, setFilterData] = useState({
        search: null,
        bulk: true,
        sort: "",
        optionValues: [],
        minPrice: null,
        maxPrice: null,
        originCountries: [],
    });
    const dispatch = useAppDispatch();
    const router = useRouter();
    const t = useTranslations("Products");
    const catlist = useTranslations("CategoriesList");
    useEffect(() => {
        if (!selected) {
            dispatch(fetchCategories(null)).then((res) => {
                const translatedCategories = res.data.map((category) => ({
                    ...category,
                    name: catlist(category.name),
                    childrens: category?.childrens?.map((child) => ({
                        ...child,
                        name: catlist(child.name),
                    })),
                }));
                // console.log("CATEGORIES RESPONSE", res);
                setCategories(translatedCategories);
                setParentsCategories([]);
                setSelectedData(null);
            });
        } else if (selected) {
            dispatch(fetchNestedCategories(selected)).then((res) => {
                setSelectedData({
                    ...res.data.category,
                    name: catlist(res.data.category?.name),
                    childrens: res.data.category?.childrens?.map((child) => ({
                        ...child,
                        name: catlist(child.name),
                    })),
                });
                setCategories(
                    res.data.category?.childrens?.map((child) => ({
                        ...child,
                        name: catlist(child.name),
                    }))
                );
                let parentCategories = [];
                if (res.data.parents.length > 0) {
                    parentCategories = findPathToSelectedId(
                        res.data.parents,
                        selected
                    );
                } else {
                    parentCategories = [res.data.category];
                }

                const selectedIndex = parentCategories?.findIndex(
                    (category) => {
                        return category.id === parseInt(selected);
                    }
                );

                if (selectedIndex !== -1) {
                    parentCategories = parentCategories?.slice(
                        0,
                        selectedIndex + 1
                    );
                }
                if (parentCategories?.length === 0) {
                    parentCategories?.push(res.data.category);
                }

                setParentsCategories(parentCategories);
            });
        }
    }, [selected]);

    const selectCategoryFn = (category) => {
        if (selected && category.id === selected) {
            if (category.parent) {
                setSelected(category.parent);
            } else {
                setSelected(null);
            }
        } else {
            setSelected(category.id);
        }
    };

    const extractIds = () => {
        if (selectedData) {
            const ids = [selectedData.id];
            if (selectedData.childrens && selectedData.childrens.length > 0) {
                selectedData.childrens.forEach((child) => {
                    ids.push(child.id);
                    if (child.childrens && child.childrens.length > 0) {
                        child.childrens.forEach((grandchild) => {
                            ids.push(grandchild.id);
                        });
                    }
                });
            }
            return ids;
        }
        return null;
    };

    useEffect(() => {
        if (categoryParamId) {
            setSelected(categoryParamId);
            router.replace("/products", undefined, { shallow: true });
        }
    }, [categoryParamId]);

    useEffect(() => {
        if (searchParamText) {
            setFilterData({ ...filterData, search: searchParamText });
            router.replace("/products", undefined, { shallow: true });
        }
    }, [searchParamText]);

    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        const ids = extractIds();
        if (ids) {
            const confi = getCategoryOptionsConfig(ids);
            dispatch(fetchFullCategoryOptions(confi)).then((res) => {
                setCategoryOptions(res.data);
            });
        } else {
            setCategoryOptions([]);
        }
    }, [selectedData]);

    const [priceValues, setPriceValues] = useState({ min: null, max: null });

    const updatePriceFilterData = useCallback(
        debounce((newPriceValues) => {
            setFilterData((prev) => ({
                ...prev,
                ...newPriceValues,
            }));
        }, 1000),
        []
    );

    useEffect(() => {
        updatePriceFilterData({
            minPrice: priceValues.min,
            maxPrice: priceValues.max,
        });
    }, [priceValues.min, priceValues.max, updatePriceFilterData]);

    const handlePriceChange = (e, type) => {
        const value = e.target.value;
        if (!value) {
            setPriceValues((prev) => ({ ...prev, [type]: null }));
        } else {
            setPriceValues((prev) => ({ ...prev, [type]: value }));
        }
    };

    return (
        <div className="container-xxl">
            <div className="d-flex justify-content-between align-items-center bg-white my-2 rounded-1 p-3 flex-wrap ">
                <div className="fs-14 mb-2 mb-md-0 truncate-overflow-1 user-select-none">
                    {parentsCategories?.map((categor) => (
                        <span
                            key={categor.id}
                            // onClick={() => setSelected(categor.id)}
                            onClick={() => selectCategoryFn(categor.id)}
                            className="ms-1 underline-on-hover fs-13 fw-medium"
                            role="button"
                        >
                            {/* {categor.name} */}
                            {catlist(categor?.name)}{" "}
                            <IconChevronRight size={16} />
                        </span>
                    ))}

                    {filterData?.search ? (
                        <div className="d-flex align-items-center mt-2">
                            <div className="fs-5 fw-bold truncate-overflow-1">
                                {filterData?.search}
                            </div>{" "}
                            <span
                                role="button"
                                onClick={() => {
                                    setFilterData({
                                        ...filterData,
                                        search: null,
                                    });
                                    router.replace("/products", undefined, {
                                        shallow: true,
                                    });
                                }}
                                class="badge bg-main text-white btn-custom ms-2"
                            >
                                <IconX size={18} />
                            </span>
                            <span className="text-muted fs-12 ms-2 user-select-none">
                                ({count} {t("products")})
                            </span>
                        </div>
                    ) : selectedData ? (
                        <div className="d-flex align-items-center mt-2">
                            <div className="fs-5 fw-bold truncate-overflow-1">
                                {selectedData?.name}
                            </div>{" "}
                            <span className="text-muted fs-12 ms-2">
                                ({count} {t("products")})
                            </span>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center mt-2">
                            <div className="fs-5 fw-bold">
                                {t("allCategories")}
                            </div>{" "}
                            <span className="text-muted fs-12 ms-2">
                                ({count} {t("products")})
                            </span>
                        </div>
                    )}
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <div class="form-check form-switch align-items-center d-flex gap-2 ps-0 me-2">
                        <label
                            class="form-check-label fw-medium fs-15"
                            for="flexSwitchCheckDefault"
                        >
                            {t("retail")}
                        </label>
                        <input
                            class="form-check-input main-form-check shadow-none mx-1"
                            type="checkbox"
                            role="button"
                            checked={filterData.bulk}
                            onClick={() =>
                                setFilterData({
                                    ...filterData,
                                    bulk: !filterData.bulk,
                                })
                            }
                            id="flexSwitchCheckDefault"
                        />
                        <label
                            class="form-check-label fw-medium fs-15"
                            for="flexSwitchCheckDefault"
                        >
                            {t("bulk")}
                        </label>
                    </div>

                    <div>
                        <select
                            className="form-select fs-13 rounded-small shadow-none border"
                            aria-label="Default select example"
                            value={filterData.sort}
                            onChange={(e) =>
                                setFilterData({
                                    ...filterData,
                                    sort: e.target.value,
                                })
                            }
                        >
                            <option value="" disabled>
                                {t("sortBy")}
                            </option>
                            <option value="-created">{t("newArrivals")}</option>
                            <option value="min_price">
                                {t("lowestPrice")}
                            </option>
                            <option value="-min_price">
                                {t("highestPrice")}
                            </option>
                            <option value="quantity_sold">
                                {t("bestsellers")}
                            </option>
                            <option value="avg_rating">{t("mostRated")}</option>
                        </select>
                    </div>
                </div>
                <div className="d-block d-md-none  mt-2">
                    <MoreFiltersModal
                        parentsCategories={parentsCategories}
                        selectCategoryFn={selectCategoryFn}
                        setSelected={setSelected}
                        categories={categories}
                        categoryOptions={categoryOptions}
                        filterData={filterData}
                        setFilterData={setFilterData}
                        priceValues={priceValues}
                        handlePriceChange={handlePriceChange}
                    >
                        <div
                            className="form-select fs-13 rounded-small"
                            role="button"
                        >
                            {t("filters")}
                        </div>
                    </MoreFiltersModal>
                </div>
            </div>

            <div className="row  my-2 rounded-1  mx-0">
                <div className="d-none d-md-block col-2  ps-0 fs-14 ">
                    <div className="bg-white p-3 position-sticky top-0">
                        <div>
                            <div className="fw-bold">{t("categories")}</div>

                            <ul className="list-unstyled custom-list mt-2 ">
                                {parentsCategories?.map((categor) => (
                                    <li
                                        key={categor.id}
                                        onClick={() => {
                                            selectCategoryFn(categor);
                                        }}
                                        className="ms-1 fw-medium underline-on-hover d-flex align-items-center"
                                        role="button"
                                    >
                                        <IconChevronLeft size={16} />{" "}
                                        {catlist(categor?.name)}
                                    </li>
                                ))}
                                <li className="mb-1"></li>
                                {categories?.map((category) => (
                                    <li
                                        key={category.id}
                                        onClick={() => setSelected(category.id)}
                                        role="button"
                                        className=""
                                    >
                                        {category.name}
                                        {/* {catlist(category?.name)} */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {categoryOptions &&
                            categoryOptions.length > 0 &&
                            Array.from(
                                new Set(
                                    categoryOptions
                                        .filter(
                                            (cat) =>
                                                cat.unique_values.length >= 1
                                        )
                                        .map((cat) => cat.name)
                                )
                            ).map((uniqueCatName) => (
                                <CategoryOption
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    cat={categoryOptions.find(
                                        (cat) => cat.name === uniqueCatName
                                    )}
                                    key={uniqueCatName}
                                />
                            ))}
                        <CountryOption
                            filterData={filterData}
                            setFilterData={setFilterData}
                        />
                        <div>
                            <div className="fw-bold">{t("price")}</div>
                            <div className="d-flex gap-1 mt-2">
                                <div>
                                    <div>{t("min")}:</div>
                                    <div className="border d-flex align-items-center rounded-small py-1 ps-1 pe-1">
                                        <input
                                            type="number"
                                            className="form-control border-0 shadow-none p-0 fs-14 rounded-0"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                            value={priceValues.min || null}
                                            onChange={(e) =>
                                                handlePriceChange(e, "min")
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
                                            value={priceValues.max || null}
                                            onChange={(e) =>
                                                handlePriceChange(e, "max")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-10 ps-0 pe-0 mb-5 mb-md-0">
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 bg-white p-3 mx-0 ">
                        <ProductsList
                            categories={extractIds()}
                            noPreview={true}
                            onDataArrive={(res) => setCount(res.count)}
                            filtersData={filterData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;
