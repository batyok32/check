"use client";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import { dateGlobalOptions } from "@/components/utils/jsutils";
import {
    getPickupHistory,
    schedulePickup,
} from "@/redux/actions/sellerActions";
import { useAppDispatch } from "@/redux/hooks";
import { convertUppercaseToNormal } from "@/redux/utils/opts";
import { convertToLocale, getWindowLocale } from "@/redux/utils/shop";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Page({ params: { id } }) {
    const dispatch = useAppDispatch();
    const t = useTranslations();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [cancellationNotes, setCancellationNotes] = useState(null);

    useEffect(() => {
        dispatch(getPickupHistory(id)).then((res) => {
            if (res.status > 205) {
                router.push("/seller/orders");
                toast.error("Something went wrong!", { className: "fs-14" });
                return;
            } else {
                setData(res.data);
            }
        });
    }, [id]);

    const cancelPickup = () => {
        const pickupData = {
            orderitem: id,
            date: data["date"],
            status: "CANCELLED",
            notes: cancellationNotes,
        };
        dispatch(schedulePickup(pickupData)).then((res) => {
            if (res.status > 205) {
                toast.error("Something went wrong!", { className: "fs-14" });
            } else {
                toast.success("Successfully cancelled.", {
                    className: "fs-14",
                });
            }
        });
    };

    if (!data) {
        return <LoadingScreen></LoadingScreen>;
    }

    return (
        <div className="pb-4">
            <div className="row mx-2 mt-3">
                <div className="col-md-8 bg-white mx-auto shadow-sm rounded-small py-4 ">
                    <div className="px-4">
                        <h5 className=" fw-bold mb-3 text-center ">
                            {t("schedules")}
                        </h5>

                        <div className="d-flex justify-content-between align-items-center fs-14 mb-4">
                            <div>
                                <div>
                                    {t("currentStatus")}:{" "}
                                    <span className="text-main fw-bold">
                                        {convertUppercaseToNormal(
                                            data["state"]
                                        )}
                                    </span>
                                </div>
                                {data["state"] && (
                                    <div className="mt-1">
                                        <span className="fs-14 text-muted fs-13 ">
                                            {new Date(
                                                data?.date
                                            ).toLocaleDateString(
                                                convertToLocale(
                                                    getWindowLocale()
                                                ),
                                                dateGlobalOptions
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="fs-14  m-0 d-flex gap-0 ">
                                {(data["state"] === "FAILED" ||
                                    data["state"] === "SCHEDULED") && (
                                    <>
                                        <div className="text-secondary d-flex  align-items-center px-1 rounded-small py-2">
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/seller/orders/schedule-pickup/${data["orderitem"]}/`
                                                    )
                                                }
                                                className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center"
                                            >
                                                {t("reschedule")}
                                            </button>
                                        </div>
                                        {/* <div className=" d-flex  align-items-center px-1 rounded-small py-2">
                                            <button
                                                onClick={() => {
                                                    // open cancel modal
                                                }}
                                                className="btn btn-gray rounded-small fs-14 fw-bold px-3 d-flex align-items-center"
                                            >
                                                Cancel
                                            </button>
                                        </div> */}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 mb-3 fw-bold fs-5 text-center">
                            {t("history")}
                        </div>
                        <div className="table-responsive">
                            <table className="table fs-14 table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">{t("beforeState")}</th>
                                        <th scope="col">{t("afterState")}</th>
                                        <th scope="col">{t("timestamp")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data["statushistories"] &&
                                    data["statushistories"].length > 0 ? (
                                        data["statushistories"].map(
                                            (history, index) => (
                                                <tr key={index} role="button">
                                                    <td className="underline-on-hover">
                                                        {convertUppercaseToNormal(
                                                            history[
                                                                "before_state"
                                                            ]
                                                        )}
                                                    </td>
                                                    <td>
                                                        {convertUppercaseToNormal(
                                                            history[
                                                                "finished_state"
                                                            ]
                                                        )}
                                                    </td>
                                                    <td>
                                                        {new Date(
                                                            history[
                                                                "change_time"
                                                            ]
                                                        ).toLocaleDateString(
                                                            convertToLocale(
                                                                getWindowLocale()
                                                            ),
                                                            dateGlobalOptions
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center"
                                            >
                                                {t("nohistory")}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
