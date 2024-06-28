"use client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchSupportCases } from "@/redux/actions/shopActions";
import {
    convertToLocale,
    getSupportCaseConfi,
    getWindowLocale,
} from "@/redux/utils/shop";
import { IconFilter, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import OpenCaseModal from "@/components/SupportCaseModal/OpenCaseModal";
import { capitalize } from "@/components/utils/jsutils";
import FilterCasesModal from "@/components/SupportCaseModal/FilterCasesModal";

export default function Page() {
    const t = useTranslations("SupportCases");
    const dispatch = useAppDispatch();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const [res, setRes] = useState({
        results: null,
        count: null,
        next: null,
    });
    const [loadMore, setLoadMore] = useState(null);
    const router = useRouter();
    const [filterData, setFilterData] = useState({
        sort: null,
        status: null,
    });

    useEffect(() => {
        const confi = getSupportCaseConfi(loadMore, filterData);
        dispatch(fetchSupportCases(confi)).then((response) => {
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
    }, [loadMore, dispatch]);

    return (
        <div className="row mx-2 mx-md-0">
            <div className="col-lg-10 mx-auto">
                <div className="mt-3">
                    <div className="mb-3 d-flex justify-content-between align-items-center ">
                        <div className="fw-bold  fs-5">{t("cases")}</div>
                        <div className="fs-14 m-0 d-flex gap-2 d-none">
                            <div className="d-flex  align-items-center px-1 rounded-small py-2">
                                <FilterCasesModal
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                >
                                    <button className="btn btn-gray rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                                        <span>{t("filters")}</span>{" "}
                                        <IconFilter
                                            size={22}
                                            stroke={2}
                                            className="ms-1"
                                        />
                                    </button>
                                </FilterCasesModal>
                            </div>
                            <div className="text-secondary d-flex  align-items-center px-1 rounded-small py-2">
                                <OpenCaseModal>
                                    <button className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                                        <IconPlus className="me-1" size={22} />{" "}
                                        {t("openNewCase")}
                                    </button>
                                </OpenCaseModal>
                            </div>
                        </div>
                    </div>
                    <table className="table fs-14 table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{t("subject")}</th>
                                <th scope="col">{t("status")}</th>
                                <th scope="col">{t("createdTime")}</th>
                                <th scope="col">{t("resolvedTime")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(res.results) &&
                                res.results.length >= 1 &&
                                res.results.map((result, index) => (
                                    <tr
                                        onClick={() =>
                                            router.push(
                                                `/account/cases/${result.id}`
                                            )
                                        }
                                        key={index}
                                        role="button"
                                    >
                                        <th scope="row">{index + 1}</th>
                                        <td>{result.subject}</td>
                                        <td>{capitalize(result.status)}</td>
                                        <td>
                                            {new Date(
                                                result?.created_at
                                            ).toLocaleDateString(
                                                convertToLocale(
                                                    getWindowLocale()
                                                ),
                                                options
                                            )}
                                        </td>
                                        <td>
                                            {new Date(
                                                result?.resolved_at
                                            ).toLocaleDateString(
                                                convertToLocale(
                                                    getWindowLocale()
                                                ),
                                                options
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {res.next && (
                        <div className="row my-3 justify-content-center">
                            <button
                                className="btn btn-main fw-bold fs-14 rounded-small mt-3"
                                style={{
                                    width: "300px",
                                    fontWeight: "600 !important",
                                }}
                                onClick={() => setLoadMore(res.results?.length)}
                            >
                                {t("loadMore")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
