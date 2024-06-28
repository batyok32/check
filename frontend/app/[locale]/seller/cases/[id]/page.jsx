"use client";
import {
    createSupportCaseMessage,
    retrieveSupportCase,
} from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { formatDate } from "@/redux/utils/opts";
import { IconClockHour1 } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page({ params }) {
    const { id } = params;
    const [data, setData] = useState(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = () => {
        dispatch(retrieveSupportCase(id)).then((res) => {
            if (res.status > 205) {
                setData(null);
            } else {
                setData(res.data);
            }
        });
    };
    const t = useTranslations();

    const [messageText, setMessageText] = useState("");
    const onSubmit = () => {
        if (messageText.trim().length > 0) {
            dispatch(
                createSupportCaseMessage({
                    case: id,
                    message: messageText,
                })
            ).then((res) => {
                if (res.status > 205) {
                    toast.error(t("SupportCase.messageNotSent"), {
                        className: "fs-14",
                    });
                    console.log("ERROR", res);
                } else {
                    toast.success(t("SupportCase.messageSent"), {
                        className: "fs-14",
                    });
                    setMessageText("");
                    loadData();
                }
            });
        }
    };

    return (
        <div className="px-4">
            <div className="bg-white rounded-sm shadow-sm fs-14 mt-3 p-3">
                <div className="fw-bold">{data?.subject}</div>
                <div className="my-2 text-muted fs-12 d-flex align-items-center gap-1">
                    <IconClockHour1 size={18} />
                    {formatDate(data?.created_at)} {t("SupportCase.by")}{" "}
                    {data?.user?.first_name}
                </div>
                <div className="fs-13">{data?.message}</div>
                <div className="border-top my-3"></div>

                {data &&
                    Array.isArray(data?.messages) &&
                    data?.messages.length > 0 &&
                    data.messages.map((message) => (
                        <div key={message.id}>
                            <div className="my-2 text-muted fs-12 d-flex align-items-center gap-1">
                                <IconClockHour1 size={18} />
                                {formatDate(message?.created_at)}{" "}
                                {t("SupportCase.by")}{" "}
                                {message?.user?.first_name}
                            </div>
                            <div className="fs-13">{message?.message}</div>

                            <div className="border-top my-3"></div>
                        </div>
                    ))}

                <textarea
                    class="form-control mt-3 shadow-none border rounded-small fs-13 pt-3"
                    // id="exampleFormControlTextarea1"
                    rows="10"
                    value={messageText}
                    onChange={(e) => {
                        setMessageText(e.target.value);
                    }}
                    placeholder={t("SupportCase.placeholderMessage")}
                ></textarea>
                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        onClick={() => onSubmit()}
                        className="btn btn-main  fs-14 rounded-small mt-3 fw-medium"
                    >
                        {t("SupportCase.submit")}
                    </button>
                </div>
            </div>
            {/* Case data */}
            {/* Messages list */}
            {/* Add message form */}
        </div>
    );
}
