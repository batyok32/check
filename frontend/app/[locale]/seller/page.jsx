"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IconChevronDown } from "@tabler/icons-react";

import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
    convertToLocale,
    getSellerSellingDetails,
    getSellerTransactionConfi,
} from "@/redux/utils/shop";
import {
    fetchSellerFinanceTransactions,
    fetchSellerListingDetails,
    fetchSellerSellingDetails,
} from "@/redux/actions/sellerActions";
import ProductCardV2 from "@/components/ProductCardV2/ProductCardV2";
import { useTranslations } from "next-intl";
import { logout } from "@/redux/features/authSlice";

function Seller() {
    const { seller_profile } = useAppSelector((state) => state.auth);
    const [tooltipData, setTooltipData] = useState(null);
    const t = useTranslations("Seller");

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [dateRange, setDateRange] = useState([yesterday, tomorrow]);
    const handleCalendarChange = (value) => {
        setDateRange(value);
    };

    const adjustDateWithinRange = (date) => {
        if (date < new Date(seller_profile?.created))
            return new Date(seller_profile?.created);
        if (date > new Date()) return new Date();
        return date;
    };
    const setToday = () => {
        const today = adjustDateWithinRange(new Date());
        setDateRange([today, today]);
    };

    const setYesterday = () => {
        const yesterday = adjustDateWithinRange(
            new Date(new Date().setDate(new Date().getDate() - 1))
        );
        setDateRange([yesterday, yesterday]);
    };

    const setThisWeek = () => {
        const today = new Date();
        const firstDayOfWeek = adjustDateWithinRange(
            new Date(today.setDate(today.getDate() - today.getDay() + 1))
        );
        const lastDayOfWeek = adjustDateWithinRange(
            new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6))
        );
        setDateRange([firstDayOfWeek, lastDayOfWeek]);
    };

    const setThisMonth = () => {
        const today = new Date();
        const firstDayOfMonth = adjustDateWithinRange(
            new Date(today.getFullYear(), today.getMonth(), 1)
        );
        const lastDayOfMonth = adjustDateWithinRange(
            new Date(today.getFullYear(), today.getMonth() + 1, 0)
        );
        setDateRange([firstDayOfMonth, lastDayOfMonth]);
    };

    const setLastMonth = () => {
        const today = new Date();
        const firstDayOfLastMonth = adjustDateWithinRange(
            new Date(today.getFullYear(), today.getMonth() - 1, 1)
        );
        const lastDayOfLastMonth = adjustDateWithinRange(
            new Date(today.getFullYear(), today.getMonth(), 0)
        );
        setDateRange([firstDayOfLastMonth, lastDayOfLastMonth]);
    };

    const setThisYear = () => {
        const today = new Date();
        const firstDayOfYear = adjustDateWithinRange(
            new Date(today.getFullYear(), 0, 1)
        );
        const lastDayOfYear = adjustDateWithinRange(
            new Date(today.getFullYear(), 11, 31)
        );
        setDateRange([firstDayOfYear, lastDayOfYear]);
    };
    const options = { year: "numeric", month: "long", day: "numeric" };
    const url = window.location.pathname;
    const urlSegments = url.split("/");
    const locale = urlSegments[1];
    const dispatch = useAppDispatch();

    const [listingDetails, setListingDetails] = useState(null);

    useEffect(() => {
        dispatch(fetchSellerListingDetails()).then((res) => {
            if (res.status > 205) {
                setListingDetails(null);
            } else {
                setListingDetails(res.data);
            }
        });
    }, []);

    const [revenueData, setRevenueData] = useState(null);

    useEffect(() => {
        if (dateRange) {
            const confi = getSellerSellingDetails(dateRange);
            dispatch(fetchSellerSellingDetails(confi)).then((res) => {
                if (res.status > 205) {
                    dispatch(logout());
                } else {
                    console.log("RESULT", res);
                    setRevenueData(res.data);
                    const label = res.data.daily_data[0]?.label;
                    const total_earning = res.data.daily_data[0]?.total_earning;
                    const total_amount = res.data.daily_data[0]?.total_amount;
                    setTooltipData({
                        label,
                        total_earning,
                        total_amount,
                    });
                }
            });
        }
    }, [dateRange]);

    console.log("REVENUE DATA", revenueData);
    // ?date_after=2024-03-01&date_before=2024-03-31

    return (
        <div className="">
            <div className="border-start py-2 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                <h5 className="m-0 fw-bold">
                    {t("hello")}, {seller_profile.store_name}
                </h5>

                <div className="fs-14 m-0 d-flex">
                    <div className=" text-lightgray fw-medium dropdown ">
                        <div
                            className="d-flex align-items-center gap-2 user-select-none"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            data-bs-auto-close="outside"
                            role="button"
                        >
                            <span>
                                {dateRange[0].toLocaleDateString(
                                    convertToLocale(locale),
                                    options
                                )}{" "}
                                -{" "}
                                {dateRange[1].toLocaleDateString(
                                    convertToLocale(locale),
                                    options
                                )}{" "}
                            </span>{" "}
                            <IconChevronDown size={16} />
                        </div>
                        <div class="dropdown-menu rounded-small border-0 shadow mt-3">
                            <div className="p-4 d-md-flex gap-3">
                                <div
                                    style={{ width: 250 }}
                                    className="fs-14 border-0 mb-2 mb-md-0"
                                >
                                    <Calendar
                                        className={"border-0 customCalendar"}
                                        selectRange
                                        onChange={handleCalendarChange}
                                        value={dateRange}
                                        locale={convertToLocale(locale)}
                                        minDate={
                                            new Date(seller_profile?.created)
                                        } // Allow any end date, but restrict the start date
                                        maxDate={new Date()}
                                    />
                                </div>

                                <div
                                    className="fs-13 fw-light "
                                    style={{ minWidth: 150 }}
                                >
                                    <div className="d-flex flex-column gap-1  text-center">
                                        <div role="button" onClick={setToday}>
                                            {t("today")}
                                        </div>
                                        <div
                                            role="button"
                                            onClick={setYesterday}
                                        >
                                            {t("yesterday")}
                                        </div>
                                        <div
                                            role="button"
                                            onClick={setThisWeek}
                                        >
                                            {t("thisWeek")}
                                        </div>
                                        <div
                                            role="button"
                                            onClick={setThisMonth}
                                        >
                                            {t("thisMonth")}
                                        </div>
                                        <div
                                            role="button"
                                            onClick={setLastMonth}
                                        >
                                            {t("lastMonth")}
                                        </div>
                                        <div
                                            role="button"
                                            onClick={setThisYear}
                                        >
                                            {t("thisYear")}
                                        </div>
                                    </div>
                                    <div className="pt-3"></div>
                                    {t("range")}: <br />
                                    <span className="fw-medium">
                                        {dateRange[0].toLocaleDateString(
                                            convertToLocale(locale),
                                            options
                                        )}
                                    </span>{" "}
                                    -
                                    <span className="fw-medium">
                                        {dateRange[1].toLocaleDateString(
                                            convertToLocale(locale),
                                            options
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row  p-4 px-0 px-md-4 mx-0 row-gap-2">
                <div className="col-lg-8">
                    <div className="bg-white p-4 shadow-sm">
                        <div className=" d-flex fs-14 align-items-center mb-3 justify-content-between">
                            <div>
                                <span className="fw-medium">{t("data")}:</span>{" "}
                                {new Date(
                                    tooltipData?.label
                                ).toLocaleDateString(locale, options)}
                            </div>
                            <div>
                                <span className="fw-medium">
                                    {t("totalEarnings")}:
                                </span>{" "}
                                ${tooltipData?.total_earning}
                            </div>
                            <div>
                                <span className="fw-medium">
                                    {t("totalOrders")}:
                                </span>{" "}
                                {tooltipData?.total_amount}
                            </div>
                        </div>
                        <Line
                            data={{
                                labels: revenueData?.daily_data?.map((data) =>
                                    new Date(data.label).toLocaleDateString(
                                        locale,
                                        {
                                            month: "short",
                                            day: "numeric",
                                        }
                                    )
                                ),
                                datasets: [
                                    {
                                        label: "Cost",
                                        data: revenueData?.daily_data?.map(
                                            (data) => data.total_earning
                                        ),
                                        backgroundColor: "#FF6A00",
                                        borderColor: "#FF6A00",
                                        pointRadius: 5, // Default radius of points
                                        pointHoverRadius: 10, // Radius of points when hovered
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },

                                    tooltip: {
                                        enabled: false, // Disable the default tooltip

                                        callbacks: {
                                            label: function (context) {
                                                // Custom label format without dataset label and color box
                                                return `${context.parsed.y}`;
                                            },
                                        },
                                    },
                                },
                                onHover: (event, chartElement) => {
                                    if (chartElement.length) {
                                        const index = chartElement[0].index;
                                        const label =
                                            revenueData?.daily_data[index]
                                                .label;
                                        const total_earning =
                                            revenueData?.daily_data[index]
                                                .total_earning;
                                        const total_amount =
                                            revenueData?.daily_data[index]
                                                .total_amount;
                                        setTooltipData({
                                            label,
                                            total_earning,
                                            total_amount,
                                        });
                                    }
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="bg-white p-3 shadow-sm">
                        <div className="d-flex justify-content-between fs-15 mb-2">
                            <div className="fw-light">
                                {t("totalEarnings")}:
                            </div>
                            <div className="fw-medium">
                                ${revenueData?.total_earning}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between fs-15 mb-2">
                            <div className="fw-light">{t("totalOrders")}:</div>
                            <div className="fw-medium">
                                {revenueData?.total_amount}
                            </div>
                        </div>

                        <hr />
                        <div className="d-flex justify-content-between fs-15 mb-2">
                            <div className="fw-light">
                                {t("activeListing")}:
                            </div>
                            <div className="fw-medium">
                                {listingDetails?.active_listing_count}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between fs-15 mb-2">
                            <div className="fw-light">
                                {t("waitingForShipping")}:
                            </div>
                            <div className="fw-medium">
                                {listingDetails?.waiting_for_shipping}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between fs-15 mb-2">
                            <div className="fw-light">{t("inTheWay")}:</div>
                            <div className="fw-medium">
                                {listingDetails?.in_the_way}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {Array.isArray(listingDetails?.top_10_selling_items) &&
                listingDetails.top_10_selling_items.length >= 1 && (
                    <div className="container-xxl mb-5 pb-5">
                        <div className="bg-white p-4 shadow-sm">
                            <div className="fs-6 fw-bold mb-3">
                                {t("top10SoldItems")}
                            </div>
                            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6  mx-0">
                                {listingDetails.top_10_selling_items?.map(
                                    (product) => (
                                        <ProductCardV2
                                            key={product.id}
                                            product={product}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default Seller;

// {
// <div className="px-md-4 p-2 pt-md-4">
//                 <div className="row mx-0 row-gap-2">
//                     <div className="col-md-6 border-end bg-white shadow-sm py-3 px-md-5 text-center">
//                         <div className="small text-uppercase fw-medium">
//                             Waiting for shipping
//                         </div>
//                         <div className="d-flex justify-content-center">
//                             <div className=" fs-4 fw-bold my-2 px-3 text-center fw-bold bg-main text-white rounded-small ">
//                                 5
//                             </div>
//                         </div>
//                         <div className="d-flex justify-content-center align-items-center text-center text-secondary fs-15">
//                             10 completed orders | 0 in the way
//                         </div>
//                     </div>
//                     <div className="col-md-6  bg-white shadow-sm py-3 px-md-5 text-center">
//                         <div className="small text-uppercase fw-medium">
//                             Active listing
//                         </div>
//                         <div className="py-1 fs-4 fw-bold">151</div>
//                         <div className="d-flex justify-content-center align-items-center text-center text-secondary fs-15">
//                             5 sold | 9 unsold
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="px-md-4 p-2 pt-md-4">
//                 <div className="bg-white shadow-sm ">
//                     <div className="d-flex flex-wrap justify-content-md-start justify-content-center gap-1 gap-md-3 align-items-center py-3 px-2 px-md-4 border-bottom">
//                         <div className="fw-bold">Stats overview for</div>
//                         <div className="d-flex ">
//                             <select
//                                 className="form-select fs-14 rounded-small w-auto mx-2 shadow-none border"
//                                 aria-label="Default select example"
//                             >
//                                 <option value="1">Time</option>
//                                 <option value="2">Today</option>
//                                 <option value="2">Yesterday</option>
//                                 <option value="2">Last 30 days</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="py-0 px-3">
//                         <div className="row mx-0 py-3 row-gap-2 row-gap-md-0">
//                             <div className="col-6 col-md-3 border-end text-center">
//                                 <div className="small text-uppercase fw-medium fs-14 text-secondary">
//                                     VIEWS
//                                 </div>
//                                 <div className="py-1 fs-5 fw-bold">410</div>
//                             </div>
//                             <div className="col-6 col-md-3 border-end text-center">
//                                 <div className="small text-uppercase fw-medium fs-14 text-secondary">
//                                     ORDERS
//                                 </div>
//                                 <div className="py-1 fs-5 fw-bold">12</div>
//                             </div>
//                             <div className="col-6 col-md-3 border-end text-center">
//                                 <div className="small text-uppercase fw-medium fs-14 text-secondary">
//                                     REVENUE
//                                 </div>
//                                 <div className="py-1 fs-5 fw-bold">$550,51</div>
//                             </div>
//                             <div className="col-6 col-md-3 text-center">
//                                 <div className="small text-uppercase fw-medium fs-14 text-secondary">
//                                     LISTED ITEMS
//                                 </div>
//                                 <div className="py-1 fs-5 fw-bold">124</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

// }
