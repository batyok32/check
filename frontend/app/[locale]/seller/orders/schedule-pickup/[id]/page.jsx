"use client";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import LoadingSpin from "@/components/SellerComps/ListingParts/ImageAdd/LoadingSpin";
import {
    checkOrderItemPickupStatus,
    retrieveSellerOrder,
    schedulePickup,
} from "@/redux/actions/sellerActions";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";

function Page({ params: { id } }) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(
        tomorrow.getDate() +
            (today.getDay() === 5 ? 3 : today.getDay() === 6 ? 2 : 1)
    ); // Skip weekends

    // tomorrow.setDate(tomorrow.getDate() + 1);
    // const nextWeek = new Date(today);
    // nextWeek.setDate(nextWeek.getDate() + 7);

    const nextWeek = new Date(tomorrow);
    for (let i = 0; i < 7; i++) {
        nextWeek.setDate(nextWeek.getDate() + 1);
        if (nextWeek.getDay() === 6) {
            // If Saturday, skip to Monday
            nextWeek.setDate(nextWeek.getDate() + 2);
        } else if (nextWeek.getDay() === 0) {
            // If Sunday, skip to Monday
            nextWeek.setDate(nextWeek.getDate() + 1);
        }
    }

    const [date, setDate] = useState(tomorrow);
    const [pickupData, setPickupData] = useState(null);
    const handleDateChange = (newDate) => {
        setDate(newDate);
    };
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [statusOfPickup, setStatusOfPickup] = useState("PROCESSING");

    const checkOrderItemHasPickupAlready = () => {
        if (id) {
            dispatch(retrieveSellerOrder(id)).then((res) => {
                if (res.status > 205) {
                    toast.error(t("notfound"), { className: "fs-14" });
                    setStatusOfPickup("NOTALLOWED");
                    return router.push("/seller/listing");
                } else {
                    // check res.data
                    const pickup = res.data["pickup"];
                    // console.log("RESDATA", res.data);
                    // console.log("RESDATAPICKUp", res.data["pickup"]);
                    if (!pickup) {
                        setStatusOfPickup("NOTSCHEDULED");
                    } else {
                        if (
                            pickup["state"] === "SCHEDULED" ||
                            pickup["state"] === "FAILED"
                        ) {
                            setStatusOfPickup("RESCHEDULE");
                            setPickupData(pickup);
                        }
                    }
                }
            });
        } else {
            setStatusOfPickup("NOTALLOWED");
        }
    };

    useEffect(() => {
        checkOrderItemHasPickupAlready();
    }, [id]);

    const onSubmit = () => {
        if (!date || !id) {
            return toast.error(t("enterAllRequiredFields"), {
                className: "fs-14",
            });
        }
        setIsLoading(true);
        const data = {
            date: date,
            orderitem: id,
        };
        dispatch(schedulePickup(data)).then((res) => {
            if (res.status > 205) {
                toast.error(t("AddressEditModal.errorOccurred"), {
                    className: "fs-14",
                });
            } else {
                toast.success(t("pickupscheduled"), { className: "fs-14" });
                router.push("/seller/orders");
            }
            setIsLoading(false);
        });
    };
    if (statusOfPickup === "PROCESSING") {
        return <LoadingScreen></LoadingScreen>;
    }
    if (statusOfPickup === "NOTALLOWED") {
        return router.push("/seller/orders");
    }
    return (
        <div className="pb-4">
            <div className="row mx-2 mt-3">
                <div className="col-md-8 bg-white mx-auto shadow-sm rounded-small py-4 ">
                    <div className="px-4">
                        <h5 className=" fw-bold mb-3 text-center ">
                            {isLoading ? (
                                <LoadingSpin></LoadingSpin>
                            ) : statusOfPickup === "RESCHEDULE" ? (
                                t("reschedule")
                            ) : (
                                t("schedulepickup")
                            )}
                        </h5>

                        <div>
                            <Calendar
                                onChange={handleDateChange}
                                value={date}
                                minDate={tomorrow}
                                maxDate={nextWeek}
                                tileDisabled={({ date }) =>
                                    date.getDay() === 0 || date.getDay() === 6
                                } // Disable Sundays (0) and Saturdays (6)
                                className={
                                    "border-0 customCalendar fs-14 mx-auto mt-2"
                                }
                            />

                            <div className="note-box fs-14 mt-3 border p-3 shadow">
                                <p className="fw-medium">{t("note")}:</p>
                                <ul>
                                    <li>{t("workinghours")}</li>
                                    <li>{t("maxScheduleTime")}</li>
                                    <li>{t("minScheduleTime")}</li>
                                    <li>{t("pickupDate")}</li>
                                    <li>{t("rescheduleConf")}</li>
                                    <li>{t("readyallDocuments")}</li>
                                </ul>
                            </div>

                            <div className="d-flex mt-5 justify-content-end gap-3 ">
                                <button
                                    disabled={isLoading}
                                    onClick={() => onSubmit()}
                                    className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center"
                                >
                                    {statusOfPickup === "RESCHEDULE"
                                        ? t("reschedule")
                                        : t("schedule")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
