"use client";
import HelpColumnItem from "@/components/SellerComps/HelpColumnItem/HelpColumnItem";
import HelpSlider from "@/components/SellerComps/HelpSlider/HelpSlider";
import {
    fetchHelpCategories,
    fetchHelpItems,
    openSupportCase,
} from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { getHelpItemsConfi } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function HelpPage() {
    const t = useTranslations("HelpPage");
    const dispatch = useAppDispatch();
    const [loadMore, setLoadMore] = useState(null);
    const [res, setRes] = useState({
        results: null,
        count: null,
        next: null,
    });
    useEffect(() => {
        const confi = getHelpItemsConfi(null, loadMore, "client");
        dispatch(fetchHelpItems(confi)).then((response) => {
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

    const [formData, setFormData] = useState({
        message: "",
        subject: "",
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const [isCreated, setIsCreated] = useState(false);
    const onSubmit = () => {
        if (
            formData.message.trim().length > 0 &&
            formData.subject.trim().length > 0
        ) {
            dispatch(openSupportCase(formData)).then((res) => {
                if (res.status > 205) {
                    toast.error(t("caseError"), { className: "fs-14" });
                } else {
                    toast.success(t("caseSuccess"), { className: "fs-14" });
                    setIsCreated(true);
                }
            });
        }
    };

    return (
        <div className="container-xxl mt-3">
            <div className="row row-gap-3">
                <div className="col-md-7">
                    <div className="shadow-sm rounded-small">
                        <div className="bg-white shadow-sm mb-2">
                            <div className="py-1 px-3 ">
                                <HelpSlider
                                    config={{
                                        breakpoints: {
                                            0: {
                                                slidesPerView: 3,
                                            },
                                            320: {
                                                slidesPerView: 4,
                                            },

                                            640: {
                                                slidesPerView: 5,
                                            },
                                            768: {
                                                slidesPerView: 5,
                                            },
                                            1024: {
                                                slidesPerView: 6,
                                            },
                                        },
                                    }}
                                    helpCategoryConfig={`user_type=client`}
                                />
                            </div>
                        </div>

                        <div className="bg-white shadow-sm">
                            <div className="row row-cols-4 mx-0 py-3 px-3">
                                {Array.isArray(res.results) &&
                                res.results.length >= 1 ? (
                                    res.results.map((item) => (
                                        <HelpColumnItem
                                            item={item}
                                            key={item.id}
                                        />
                                    ))
                                ) : (
                                    <div className="w-100 w-md-30 mx-auto  text-center py-3 py-md-5">
                                        <img
                                            src="/nothingfound.png"
                                            className="img-fluid px-5"
                                            alt=""
                                        />
                                    </div>
                                )}
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

                <div className="col-md-5 ">
                    <div
                        className="bg-white shadow-sm rounded-small p-3 position-sticky "
                        style={{ top: 10 }}
                    >
                        {!isCreated ? (
                            <div>
                                <div className="fw-bold mt-2 mb-2 fs-5 text-center">
                                    {t("contactUs")}
                                </div>
                                {/* <div className="text-center fs-14 mt-1 ">
                                    {t("askQuestion")}{" "}
                                </div> */}
                                <div>
                                    <form
                                        onSubmit={onSubmit}
                                        className="fs-14 mt-3"
                                    >
                                        <div className="mb-3">
                                            <label className="form-label">
                                                {t("subject")}
                                            </label>
                                            <input
                                                className="form-control rounded-small shadow-none border fs-15"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder={t(
                                                    "subjectPlaceholder"
                                                )}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                {t("message")}
                                            </label>
                                            <textarea
                                                className="form-control rounded-small shadow-none border fs-15"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                placeholder={t(
                                                    "messagePlaceholder"
                                                )}
                                            ></textarea>
                                        </div>
                                    </form>

                                    <div className="d-flex justify-content-center mt-2">
                                        <button
                                            // disabled={!isEmpty(formErrors)}
                                            onClick={onSubmit}
                                            // ref={submitBtnRef}
                                            className="btn btn-main fs-14 w-75  mt-2 fw-bold rounded-small"
                                        >
                                            {t("submit")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center py-5 flex-column text-center">
                                <div className="h5">
                                    {t("requestSubmitted")}
                                    <span className="text-main">
                                        {t("submitted")}
                                    </span>
                                </div>
                                <div className="fs-14 text-muted">
                                    {t("contactMessage")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpPage;
