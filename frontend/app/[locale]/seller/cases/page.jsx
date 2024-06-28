"use client";

import OpenCaseModal from "@/components/SupportCaseModal/OpenCaseModal";
import { capitalize } from "@/components/utils/jsutils";
import { fetchSupportCases } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import {
    convertToLocale,
    getSupportCaseConfi,
    getWindowLocale,
} from "@/redux/utils/shop";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const dispatch = useAppDispatch();
    const options = { year: "numeric", month: "long", day: "numeric" };

    const [res, setRes] = useState({
        results: null,
        count: null,
        next: null,
    });
    const [loadMore, setLoadMore] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const confi = getSupportCaseConfi(loadMore);
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
    }, [loadMore]);

    const t = useTranslations("SupportCases");

    return (
        <div className="row mx-0">
            <div className="mt-3 px-4 col-lg-10 mx-auto">
                <div className="mb-3 d-flex justify-content-between align-items-end ">
                    <div className="">
                        <div className="fw-bold  fs-5">{t("cases")}</div>
                        {/* <div className=" fs-14 mt-1 ">
                            Enter the first name and last name associated with
                            your Yuusell account.
                        </div> */}
                    </div>
                    <div className="fs-14 m-0 d-flex gap-4">
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
                {/* List */}
                <table class="table fs-14 table-hover">
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
                                            `/seller/cases/${result.id}`
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
                                            convertToLocale(getWindowLocale()),
                                            options
                                        )}
                                    </td>
                                    <td>
                                        {new Date(
                                            result?.resolved_at
                                        ).toLocaleDateString(
                                            convertToLocale(getWindowLocale()),
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
    );
}
