"use client";
import OrderFilterModal from "@/components/AccountPageComponents/Orders/OrderFilterModal";
import OrderFiltersModal from "@/components/SellerComps/OrderFiltersModal/OrderFiltersModal";
import SellerOrderList from "@/parts/Seller/SellerOrderList";
import {
    IconSearch,
    IconTrash,
    IconListDetails,
    IconFilter,
    IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

const mapState = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    seller_profile: state.auth.seller_profile,
});

export default function OrdersPage() {
    // const { seller_profile, isAuthenticated } = useAppSelector(mapState);
    const [filterData, setFilterData] = useState({
        search: null,
        status: null,
        sort: null,
    });
    // fetch order items which seller is user.seller_profile
    // list them
    // filter them
    // buy shipping label to nearest store or to the client depending on which id of courier
    // marking as shipped to the wholestore
    // buyer paid - shipped - repackaging - shipped - delivered
    const [selectedItems, setSelectedItems] = useState([]);
    const [items, setItems] = useState([]);
    const [refetchSignal, setRefetchSignal] = useState(null);

    const [searchValue, setSearchValue] = useState("");

    const handleSubmitSearch = () => {
        if (searchValue.trim().length > 0) {
            setFilterData({
                ...filterData,
                search: searchValue,
            });
        }
    };
    const t = useTranslations();
    const filterModalOpenRef = useRef();
    console.log("FILTERS", filterData);
    return (
        <div>
            <OrderFilterModal
                filterData={filterData}
                setFilterData={setFilterData}
            >
                <div ref={filterModalOpenRef}></div>
            </OrderFilterModal>
            <div className="border-start py-2 px-2 px-md-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                <h5 className="m-0 fw-bold d-none d-md-block">
                    {t("Header.orders")}
                </h5>
                <div className="fs-14 m-0 d-flex gap-4">
                    <div className="text-secondary d-flex border align-items-center py-2 px-1 rounded-small">
                        <IconSearch size={22} className="me-2" />
                        <input
                            type="text"
                            class="form-control border-0 p-0 rounded-0 shadow-none placeholder-gray fs-14"
                            id="exampleFormControlInput1"
                            placeholder={t("Listings.searchInputPlaceholder")}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSubmitSearch();
                            }}
                        />
                    </div>
                </div>

                <div
                    role="button"
                    onClick={() => {
                        filterModalOpenRef.current.click();
                    }}
                    className="border px-2 ms-2 d-md-none py-2 fw-medium bg-white rounded-1 fs-15 text-secondary d-flex align-items-center"
                >
                    {t("SupportCases.filters")}{" "}
                    <IconFilter size={22} stroke={2} className="ms-1" />
                </div>
            </div>
            {filterData?.search ? (
                <div className="d-flex align-items-center justify-content-center mt-3 ">
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
                            setSearchValue("");
                            // router.replace("/products", undefined, {
                            //     shallow: true,
                            // });
                        }}
                        class="badge bg-main text-white btn-custom ms-2"
                    >
                        <IconX size={18} />
                    </span>
                </div>
            ) : (
                <div className="fw-bold  fs-5"></div>
            )}
            <div className="row mx-0 ">
                <div className="col-md-10 mx-auto">
                    <div className="d-flex flex-wrap row-gap-2 mt-4 gap-1 gap-md-3 ">
                        {/* <div className="border px-2 d-flex flex-md- justify-content-center align-items-center bg-white rounded-1 ">
                            <input
                                className="form-check-input customcheckbox fs-15 "
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                            />
                        </div> */}

                        <div
                            role="button"
                            onClick={() => {
                                filterModalOpenRef.current.click();
                            }}
                            className="border d-none d-md-flex px-2 py-2 fw-medium bg-white rounded-1 fs-15 text-secondary align-items-center"
                        >
                            {t("SupportCases.filters")}{" "}
                            <IconFilter size={22} stroke={2} className="ms-1" />
                        </div>
                        {/* <OrderFiltersModal
                            filterData={filterData}
                            setFilterData={setFilterData}
                        >
                            <div
                                role="button"
                                className="border px-2 py-2 fw-medium bg-white rounded-small  fs-15 text-secondary d-flex align-items-center"
                            >
                                <IconFilter
                                    className="text-main me-1"
                                    size={20}
                                />
                                Filters
                            </div>
                        </OrderFiltersModal> */}

                        {/* </MoreFiltersModal> */}

                        {/* <div>
                            <select
                                className="form-select border px-2 py-2 noselectarrow  fw-medium bg-white rounded-small shadow-none  fs-15 text-secondary d-flex align-items-center"
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
                                    Sort by:
                                </option>
                                <option value="-created">New arrivals</option>
                                <option value="min_price">Lowest price</option>
                                <option value="-min_price">
                                    Highest price
                                </option>
                                <option value="quantity_sold">
                                    Bestsellers
                                </option>
                                <option value="avg_rating">Most rated</option>
                            </select>
                        </div> */}

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
                        <div
                            class="btn-group border ms-auto"
                            role="group"
                            style={{ borderRadius: 3, overflow: "hidden" }}
                            aria-label="Basic radio toggle button group"
                        >
                            <div
                                role="button"
                                onClick={() => {
                                    setFilterData({
                                        ...filterData,
                                        status: null,
                                    });
                                }}
                                className={`${
                                    filterData.status === null
                                        ? "btn-active"
                                        : ""
                                } border-end px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center`}
                            >
                                {t("HeaderSearch.all")}
                            </div>
                            <div
                                role="button"
                                onClick={() => {
                                    setFilterData({
                                        ...filterData,
                                        status: "BUYER_PAID",
                                    });
                                }}
                                className={`${
                                    filterData.status &&
                                    filterData.status?.includes("BUYER_PAID")
                                        ? "btn-active"
                                        : ""
                                } border-end px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center`}
                            >
                                {t("DeliveryStates.paid")}
                            </div>
                            <div
                                role="button"
                                // onClick={() => {
                                //     setFilterData({
                                //         ...filterData,
                                //         status: "SHIPPED",
                                //     });
                                // }}
                                onClick={() =>
                                    setFilterData({
                                        ...filterData,
                                        status: "SHIPPED, IN_WHOLESTORE",
                                    })
                                }
                                className={`${
                                    (filterData.status &&
                                        filterData.status?.includes(
                                            "SHIPPED"
                                        )) ||
                                    filterData.status?.includes("IN_WHOLESTORE")
                                        ? "btn-active"
                                        : ""
                                } border-end px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center`}
                            >
                                {t("DeliveryStates.shipped")}
                            </div>
                            <div
                                role="button"
                                onClick={() => {
                                    setFilterData({
                                        ...filterData,
                                        status: "DELIVERED",
                                    });
                                }}
                                className={`${
                                    filterData.status &&
                                    filterData.status?.includes("DELIVERED")
                                        ? "btn-active"
                                        : ""
                                } border-end px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center`}
                            >
                                {t("DeliveryStates.delivered")}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <SellerOrderList
                            filtersData={filterData}
                            setProducts={setItems}
                            refetchSignal={refetchSignal}
                        />
                    </div>
                </div>
                {/* <div className="col-md-4 py-4 d-none d-md-block">
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
                                From members
                            </li>
                            <li>
                                <input
                                    className="form-check-input customcheckbox me-1"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                />{" "}
                                From Yuusell
                            </li>
                            <li>
                                <input
                                    className="form-check-input customcheckbox me-1"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                />{" "}
                                Unread messages
                            </li>
                        </ul>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
