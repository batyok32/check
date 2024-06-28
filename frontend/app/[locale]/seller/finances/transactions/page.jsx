"use client";
import { capitalize } from "@/components/utils/jsutils";
import { fetchSellerFinanceTransactions } from "@/redux/actions/sellerActions";
import { useAppDispatch } from "@/redux/hooks";
import { getSellerTransactionConfi } from "@/redux/utils/shop";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
    const dispatch = useAppDispatch();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const [filterData, setFilterData] = useState({
        search: null,
    });
    const [searchValue, setSearchValue] = useState(null);
    const t = useTranslations();
    const handleSubmitSearch = () => {
        if (searchValue.trim().length >= 1) {
            setFilterData({
                search: searchValue,
            });
        } else {
            setFilterData({
                search: null,
            });
        }
    };

    const [res, setRes] = useState({
        results: null,
        count: null,
        next: null,
    });
    const [loadMore, setLoadMore] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const confi = getSellerTransactionConfi(filterData, loadMore);
        console.log("CONGI", confi);
        dispatch(fetchSellerFinanceTransactions(confi)).then((response) => {
            if (response.status > 205) {
                setRes({
                    results: null,
                    count: null,
                    next: null,
                });
            } else {
                if (loadMore) {
                    setRes({
                        ...response.data,
                        results: [...res.results, ...response.data.results],
                    });
                } else {
                    setRes(response.data);
                }
            }
        });
    }, [loadMore]);

    function exportTransactionsToCSV(transactions) {
        const csvRows = [];
        if (transactions.length < 1) {
            return;
        }

        // Get the headers
        const headers = Object.keys(transactions[0]).filter(
            (header) => header !== "seller"
        );
        csvRows.push(headers.join(","));

        // Add the data
        for (const transaction of res.results) {
            const values = headers.map((header) => {
                const escaped = ("" + transaction[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(","));
        }

        const csvData = csvRows.join("\n");

        // Create a Blob with the CSV data
        const blob = new Blob([csvData], { type: "text/csv" });

        // Create a link to download the Blob as a file
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "transactions.csv";
        link.style.display = "none";

        // Append the link to the document and click it to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    const getTransactionTypeName = (transaction_type) => {
        switch (transaction_type) {
            case "DR":
                return "Debit";
            case "CR":
                return "Credit";

            default:
                break;
        }
    };

    return (
        <div className="container-xxl">
            <div className="row mt-4 mb-5">
                <div className="col-md-10 mx-auto">
                    <div className=" fw-medium text-black-50 fs-6">
                        {t("Listings.transactions")} ({res?.count}){" "}
                        {filterData.search && (
                            <>
                                <span>- {filterData.search}</span>
                                <span
                                    role="button"
                                    onClick={() => {
                                        setFilterData({
                                            ...filterData,
                                            search: null,
                                        });
                                    }}
                                    class="badge bg-main text-white btn-custom ms-2"
                                >
                                    <IconX size={18} />
                                </span>
                            </>
                        )}
                    </div>

                    <div className="bg-white px-3 py-2 mt-4">
                        <div className="d-md-flex justify-content-between align-items-center">
                            <div className="py-2">
                                <div className="text-secondary d-flex border align-items-center py-2 px-1 rounded-small">
                                    <IconSearch size={20} className="me-2" />
                                    <input
                                        type="text"
                                        class="form-control border-0 p-0 rounded-0 shadow-none placeholder-gray fs-13"
                                        id="exampleFormControlInput1"
                                        placeholder={t(
                                            "Listings.searchInputPlaceholder"
                                        )}
                                        value={searchValue}
                                        onChange={(e) =>
                                            setSearchValue(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                handleSubmitSearch();
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={() =>
                                        exportTransactionsToCSV(res?.results)
                                    }
                                    className="btn btn-gray fs-13 rounded-small fw-medium text-black-50"
                                >
                                    {t("Listings.exportTransactions")} (
                                    {res?.results?.length})
                                </button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table class="table fs-13 table-hover mt-3 ">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="text-lightgray"
                                        >
                                            {t("Listings.date")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="text-lightgray"
                                        >
                                            {t("Listings.type")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="text-lightgray"
                                        >
                                            {t("Listings.referenceNo")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="text-lightgray"
                                        >
                                            {t("Listings.description")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="text-lightgray"
                                        >
                                            {t("Listings.amount")} ($)
                                        </th>
                                        <th
                                            scope="col"
                                            className="text-lightgray"
                                        >
                                            {t("Listings.closing_balance")} ($)
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Array.isArray(res.results) &&
                                        res.results.length >= 1 &&
                                        res.results.map((result, index) => (
                                            <tr
                                                // onClick={() =>
                                                //     router.push(`/seller/finances/cases/${result.id}`)
                                                // }
                                                key={index}
                                                role="button"
                                            >
                                                <th
                                                    className="text-lightgray"
                                                    scope="row"
                                                >
                                                    {new Date(
                                                        result?.timestamp
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        options
                                                    )}
                                                </th>
                                                <td>
                                                    {getTransactionTypeName(
                                                        result.transaction_type
                                                    )}
                                                </td>
                                                <td>{result.reference_id}</td>

                                                <td>{result.description}</td>
                                                <td className="text-center">
                                                    {result.amount}
                                                </td>
                                                <td className="text-center">
                                                    {result.closing_balance}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {res.next && (
                            <div className="row my-3 justify-content-center">
                                <button
                                    className="btn btn-main fw-bold fs-14 rounded-small mt-3"
                                    style={{
                                        width: "300px",
                                        fontWeight: "600 !important",
                                    }}
                                    onClick={() =>
                                        setLoadMore(res.results?.length)
                                    }
                                >
                                    {t("loadMore")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
