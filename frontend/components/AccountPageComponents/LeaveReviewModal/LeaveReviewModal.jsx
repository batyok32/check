"use client";
import { createReview } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import {
    IconMoodAnnoyed,
    IconMoodAnnoyed2,
    IconMoodEmpty,
    IconMoodHappy,
    IconMoodHeart,
} from "@tabler/icons-react";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export default function LeaveReviewModal({ children, initialData, onSuccess }) {
    const t = useTranslations("LeaveReviewModal");
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        rating: 5,
        comment: "",
        product: "",
        order_item: "",
        subject: "",
        country: "",
    });
    const closeBtnRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = () => {
        if (formData.rating > 0 && formData.comment.trim().length > 0) {
            dispatch(createReview(formData)).then((res) => {
                if (res.status > 205) {
                    toast.error(t("reviewError"), { className: "fs-14" });
                } else {
                    if (onSuccess) {
                        onSuccess();
                    }
                    closeBtnRef.current.click();
                    toast.success(t("reviewSuccess"), { className: "fs-14" });
                }
            });
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target="#reviewModal"
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id="reviewModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-small border-0 shadow-sm">
                        <div className="modal-header py-3">
                            <div
                                className="modal-title fs-5 py-0 fw-bold"
                                id="exampleModalLabel"
                            >
                                {t("leaveReview")}
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmit}>
                                <div className="d-flex justify-content-center align-items-center gap-3 text-muted">
                                    <div
                                        role="button"
                                        className="pb-2"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                rating: 1,
                                                subject: t("veryBad"),
                                            })
                                        }
                                    >
                                        <IconMoodAnnoyed2
                                            size={50}
                                            className={`worst-review-icon ${
                                                formData.rating === 1
                                                    ? "active"
                                                    : ""
                                            }`}
                                        />
                                        <div className="fs-13 fw-medium text-center">
                                            {t("oneStar")}
                                        </div>
                                    </div>
                                    <div
                                        role="button"
                                        className="pb-2"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                rating: 2,
                                                subject: t("bad"),
                                            })
                                        }
                                    >
                                        <IconMoodAnnoyed
                                            size={50}
                                            className={`bad-review-icon ${
                                                formData.rating === 2
                                                    ? "active"
                                                    : ""
                                            }`}
                                        />
                                        <div className="fs-13 fw-medium text-center">
                                            {t("twoStars")}
                                        </div>
                                    </div>
                                    <div
                                        role="button"
                                        className="pb-2"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                rating: 3,
                                                subject: t("notBad"),
                                            })
                                        }
                                    >
                                        <IconMoodEmpty
                                            size={50}
                                            className={`normal-review-icon ${
                                                formData.rating === 3
                                                    ? "active"
                                                    : ""
                                            }`}
                                        />
                                        <div className="fs-13 fw-medium text-center">
                                            {t("threeStars")}
                                        </div>
                                    </div>
                                    <div
                                        role="button"
                                        className="pb-2"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                rating: 4,
                                                subject: t("good"),
                                            })
                                        }
                                    >
                                        <IconMoodHappy
                                            size={50}
                                            className={`good-review-icon ${
                                                formData.rating === 4
                                                    ? "active"
                                                    : ""
                                            }`}
                                        />
                                        <div className="fs-13 fw-medium text-center">
                                            {t("fourStars")}
                                        </div>
                                    </div>
                                    <div
                                        role="button"
                                        className="pb-2"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                rating: 5,
                                                subject: t("excellent"),
                                            })
                                        }
                                    >
                                        <IconMoodHeart
                                            size={50}
                                            className={`best-review-icon ${
                                                formData.rating === 5
                                                    ? "active"
                                                    : ""
                                            }`}
                                        />
                                        <div className="fs-13 fw-medium text-center">
                                            {t("fiveStars")}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3 mt-3">
                                    <label className="form-label fw-medium">
                                        {t("describeInTwoWords")}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control fs-15 rounded-small border shadow-none"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder={t("describeInTwoWords")}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">
                                        {t("pleaseTellUsMore")}
                                    </label>
                                    <textarea
                                        className="form-control rounded-small shadow-none border fs-15"
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-gray fs-14"
                                data-bs-dismiss="modal"
                                ref={closeBtnRef}
                            >
                                {t("cancel")}
                            </button>
                            <button
                                type="button"
                                onClick={onSubmit}
                                className="btn btn-main  fs-14"
                            >
                                {t("submit")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
