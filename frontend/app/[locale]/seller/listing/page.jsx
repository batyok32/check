"use client";
import ListingItem from "@/components/SellerComps/ListingItem/ListingItem";
import {
    IconFilter,
    IconPlus,
    IconSearch,
    IconSortDescending2,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import "./styles.css";
import SellerProductsList from "@/parts/Seller/SellerProductsList";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
    deleteProducts,
    fetchFullCategoryOptions,
} from "@/redux/actions/sellerActions";
import MoreFiltersModal from "@/components/Products/MoreFiltersModal";
import {
    fetchCategories,
    fetchNestedCategories,
} from "@/redux/actions/shopActions";
import { findPathToSelectedId } from "@/redux/utils/product";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import { getCategoryOptionsConfig } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";

const mapState = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    seller_profile: state.auth.seller_profile,
});

function ListingPage() {
    const { seller_profile, isAuthenticated } = useAppSelector(mapState);
    const [filterData, setFilterData] = useState({
        search: null,
        seller: seller_profile?.id,
        // bulk: true,
        sort: "",
        optionValues: [],
        minPrice: null,
        maxPrice: null,
        originCountries: [],
        not_only_active: true,
    });

    const t = useTranslations();

    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [parentsCategories, setParentsCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);

    useEffect(() => {
        if (!selected) {
            dispatch(fetchCategories(null)).then((res) => {
                const translatedCategories = res.data.map((category) => ({
                    ...category,
                    name: t(`CategoriesList.${category.name}`),
                    childrens: category?.childrens?.map((child) => ({
                        ...child,
                        name: t(`CategoriesList.${child.name}`),
                    })),
                }));
                // console.log("CATEGORIES RESPONSE", res);
                // console.log("CATEGORIES RESPONSE", res);
                setCategories(translatedCategories);
                setParentsCategories([]);
                setSelectedData(null);
            });
        } else if (selected) {
            dispatch(fetchNestedCategories(selected)).then((res) => {
                const translatedCategoriesChildren =
                    res.data.category.childrens.map((category) => ({
                        ...category,
                        name: t(`CategoriesList.${category.name}`),
                        childrens: category?.childrens?.map((child) => ({
                            ...child,
                            name: t(`CategoriesList.${child.name}`),
                        })),
                    }));
                setSelectedData({
                    ...res.data.category,
                    name: t(`CategoriesList.${res.data.category.name}`),
                    childrens: translatedCategoriesChildren,
                });
                setCategories(translatedCategoriesChildren);

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

                const translatedCategories = parentCategories.map(
                    (category) => ({
                        ...category,
                        name: t(`CategoriesList.${category.name}`),
                        childrens: category?.childrens?.map((child) => ({
                            ...child,
                            name: t(`CategoriesList.${child.name}`),
                        })),
                    })
                );
                setParentsCategories(translatedCategories);
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
            // console.log("NULL selected", category);
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

    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        const ids = extractIds();
        setCategoryIds(ids);
        if (ids) {
            const confi = getCategoryOptionsConfig(ids);
            dispatch(fetchFullCategoryOptions(confi)).then((res) => {
                setCategoryOptions(res.data);
                // console.log("RES DATA", res.data[0]);
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

    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const searchParamText = searchParams.get("search");
    const router = useRouter();

    useEffect(() => {
        if (!seller_profile && isAuthenticated) {
            // dispatch(logout());
        } else if (seller_profile) {
            setFilterData({ ...filterData, seller: seller_profile?.id });
        }
    }, [seller_profile, isAuthenticated]);

    useEffect(() => {
        if (searchParamText) {
            setFilterData({ ...filterData, search: searchParamText });
            // router.replace("/products", undefined, { shallow: true });
        }
    }, [searchParamText]);

    const [searchValue, setSearchValue] = useState("");

    const handleSubmitSearch = () => {
        if (searchValue.trim().length >= 1) {
            router.push(`/seller/listing?search=${searchValue.trim()}`);
        } else {
            toast.warning(t("HeaderSearch.writeSomething"), {
                className: "fs-14",
            });
        }
    };

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [refetchSignal, setRefetchSignal] = useState(null);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Select all products
            const allProductIds = products.map((product) => product.id);
            setSelectedProducts(allProductIds);
        } else {
            // Deselect all products
            setSelectedProducts([]);
        }
    };
    const handleSelectProduct = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(
                selectedProducts.filter((id) => id !== productId)
            );
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };
    const handleRemoveSelected = () => {
        dispatch(deleteProducts({ product_ids: selectedProducts })).then(
            (res) => {
                if (res?.status === 200) {
                    toast.success(t("deleteSuccess"), {
                        className: "fs-14",
                    });
                    setRefetchSignal(Math.random());
                } else if (res?.status === 401) {
                    toast.error(t("somethingwrong"), { className: "fs-14" });
                }
            }
        );
    };

    return (
        <div>
            <div className="border-start py-2 px-2 px-md-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                <h5 className="m-0 fw-bold d-none d-md-block ">
                    {t("SellerSidebar.Listings")}{" "}
                    {filterData?.search &&
                        filterData?.search?.trim().length > 0 && (
                            <span>
                                {" "}
                                - {filterData?.search}{" "}
                                <span
                                    role="button"
                                    onClick={() => {
                                        setFilterData({
                                            ...filterData,
                                            search: null,
                                        });
                                        router.replace(
                                            "/seller/listing",
                                            undefined,
                                            {
                                                shallow: true,
                                            }
                                        );
                                    }}
                                    class="badge bg-main text-white btn-custom ms-2 rounded-small"
                                >
                                    <IconX size={18} />
                                </span>{" "}
                            </span>
                        )}
                </h5>
                <div className="fs-14 m-0 d-flex gap-4">
                    <div className="text-secondary d-flex border align-items-center px-1 rounded-small">
                        <IconSearch size={22} className="me-2" />
                        <input
                            type="text"
                            class="form-control border-0 p-0 rounded-0 shadow-none placeholder-gray fs-14"
                            id="exampleFormControlInput1"
                            placeholder={t("Listings.searchByTitle")}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSubmitSearch();
                            }}
                        />
                    </div>
                    <Link href="/seller/listing/new">
                        <button className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                            <IconPlus className="me-1" size={22} />{" "}
                            {t("AddressEditModal.Add")}{" "}
                            <span className="d-none d-md-inline ms-1">
                                {" "}
                                {t("Listings.anitem")}
                            </span>
                        </button>
                    </Link>
                </div>
            </div>

            <div className="row mx-0 ">
                <div className="col-md-10 mx-auto ">
                    <div className="d-flex mt-4 gap-1 gap-md-3">
                        <div className="border px-2 d-flex flex-wrap  justify-content-center align-items-center bg-white rounded-1 ">
                            <input
                                className="form-check-input customcheckbox fs-15 "
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                    selectedProducts.length === products.length
                                }
                                id="flexCheckDefault"
                            />
                        </div>

                        <div
                            role="button"
                            onClick={handleRemoveSelected}
                            className="border px-2 py-2 fw-medium bg-white rounded-1 fs-15 text-secondary d-flex align-items-center"
                        >
                            {t("AddressComponent.delete")}{" "}
                            <IconTrash size={20} className="ms-2" />
                        </div>

                        <div className="d-flex justify-content-end gap-1 ms-auto">
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
                                    role="button"
                                    className="border px-2 py-2 fw-medium bg-white rounded-small  fs-15 text-secondary d-flex align-items-center"
                                >
                                    <IconFilter
                                        className="text-main me-1"
                                        size={20}
                                    />
                                    {t("Products.filters")}
                                </div>
                            </MoreFiltersModal>

                            <select
                                className="form-select border px-2 py-2 fw-medium bg-white rounded-small shadow-none  fs-15 text-secondary d-flex align-items-center"
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
                                    {t("ProductDetail.sortBy")}
                                </option>
                                <option value="-created">
                                    {t("Products.newArrivals")}
                                </option>
                                <option value="min_price">
                                    {t("Products.lowestPrice")}
                                </option>
                                <option value="-min_price">
                                    {t("Products.highestPrice")}
                                </option>
                                <option value="quantity_sold">
                                    {t("Products.bestsellers")}
                                </option>
                                <option value="avg_rating">
                                    {t("Products.mostRated")}
                                </option>
                            </select>

                            {/* <div
                                role="button"
                                className="border px-2 py-2 fw-medium bg-white rounded-small  fs-15 text-secondary d-flex align-items-center"
                            >
                                <IconSortDescending2
                                    className="text-main me-1"
                                    size={22}
                                />{" "}
                                Sorts
                            </div> */}
                        </div>
                        {/* <div
                            class="btn-group border ms-auto"
                            role="group"
                            style={{ borderRadius: 3, overflow: "hidden" }}
                            aria-label="Basic radio toggle button group"
                        >
                            <div
                                role="button"
                                className="border-end btn-active px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center"
                            >
                                Active
                            </div>
                            <div
                                role="button"
                                className="border-end px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center"
                            >
                                Drafts
                            </div>
                            <div
                                role="button"
                                className=" px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center"
                            >
                                Unsold
                            </div>
                        </div> */}
                    </div>

                    {/* <div className="d-flex mt-2 justify-content-end gap-1">
                        <div
                            role="button"
                            className="border px-2 py-2 fw-medium bg-white rounded-small  fs-15 text-secondary d-flex align-items-center"
                        >
                            <IconFilter className="text-main me-1" size={20} />
                            Filters
                        </div>
                        <div
                            role="button"
                            className="border px-2 py-2 fw-medium bg-white rounded-small  fs-15 text-secondary d-flex align-items-center"
                        >
                            <IconSortDescending2
                                className="text-main me-1"
                                size={22}
                            />{" "}
                            Sorts
                        </div>
                    </div> */}

                    <div className="   mt-3">
                        <SellerProductsList
                            filtersData={filterData}
                            categories={categoryIds}
                            setProducts={setProducts}
                            selectedProducts={selectedProducts}
                            onSelectProduct={handleSelectProduct}
                            refetchSignal={refetchSignal}
                            // onDataArrive={(res) => setCount(res.count)}
                        />
                    </div>
                </div>
                {/* <div className="col-md-4 py-4 d-none ">
                    <div className="mb-3">
                        <div className="fs-14  fw-bold mb-2">Sort</div>
                        <select
                            className="form-select fs-14 w-100 rounded-0 mb-2 shadow-none border"
                            aria-label="Default select example"
                        >
                            <option value="1">Top Sold</option>
                            <option value="2">Less Sold</option>
                            <option value="2">Title A:Z</option>
                            <option value="2">Title Z:A</option>
                            <option value="2">Stock: lowest to highest</option>
                            <option value="2">Stock: highest to lowest </option>
                            <option value="2">Price: highest to lowest </option>
                            <option value="2">Price: lowest to highest</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <div className="fs-14  fw-bold mb-2">Date & Time</div>
                        <select
                            className="form-select fs-14 w-100 rounded-0 mb-2 shadow-none border"
                            aria-label="Default select example"
                        >
                            <option value="1">Time</option>
                            <option value="2">Today</option>
                            <option value="2">Yesterday</option>
                            <option value="2">Last 30 days</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <div className="fs-14  fw-bold mb-2">Categories</div>
                        <ul className="list-unstyled fs-14">
                            <li>
                                <input
                                    className="form-check-input customcheckbox me-1"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                />{" "}
                                Groceries
                            </li>
                            <li>
                                <input
                                    className="form-check-input customcheckbox me-1"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                />{" "}
                                Electronics
                            </li>
                        </ul>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default ListingPage;
