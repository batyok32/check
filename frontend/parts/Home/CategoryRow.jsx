"use client";

import MenuCategoryItem from "@/components/Header/MenuCategoryItem/MenuCategoryItem";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect } from "react";
import Link from "next/link";
import SliderHeader from "@/components/Home/SliderHeader";
import { SwiperSlide } from "swiper/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategories } from "@/redux/actions/shopActions";
import { gotCategories } from "@/redux/features/shopSlice";
import { useTranslations } from "next-intl";

export default function CategoryRow() {
    const { categories } = useAppSelector((state) => state.shop);
    const t = useTranslations();

    return (
        <div>
            <div className="container-xxl">
                <div className="bg-white rounded-1  mt-3 py-3 px-sm-3 ">
                    <Link href="/category">
                        <h6
                            role="button"
                            className="fs-6  underline-on-hover pb-2 fw-bold  ms-3 ms-sm-0 d-flex align-items-center"
                        >
                            {t("categories")}{" "}
                            <span className="ps-3">
                                <IconChevronRight size={18} />
                            </span>
                        </h6>
                    </Link>
                    <div className="fs-14 px-0 py-2 mx-0 fw-medium user-select-none ">
                        <SliderHeader
                            opts={{
                                spaceBetween: 10,
                                navigation: true,

                                breakpoints: {
                                    0: {
                                        slidesPerView: 4,
                                    },
                                    320: {
                                        slidesPerView: 4,
                                    },

                                    640: {
                                        slidesPerView: 6,
                                    },
                                    768: {
                                        slidesPerView: 7,
                                    },
                                    1024: {
                                        slidesPerView: 10,
                                    },
                                },
                                className: "productdetailslider2 pb-0 px-3",
                            }}
                        >
                            {Array.isArray(categories) &&
                                categories?.length > 0 &&
                                categories?.map((category, index) => (
                                    <SwiperSlide key={index}>
                                        <Link
                                            href={`/products/?category=${category?.id}`}
                                            // href={`/category/${category?.slug}/${category?.id}`}
                                            className="w-100 d-flex py-2  align-items-center flex-column"
                                        >
                                            <div
                                                style={{
                                                    borderRadius: "50%",
                                                }}
                                                className="d-flex justify-content-center align-items-center overflow-hidden"
                                            >
                                                <img
                                                    className="img-fluid category-image-responsive"
                                                    src={category.image}
                                                    alt=""
                                                    // style={{ height: "120px" }}
                                                />
                                            </div>
                                            <div className="text-center mt-1 fs-13 truncate-overflow-1 text-break">
                                                {category.name}
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                        </SliderHeader>
                    </div>
                </div>
            </div>
        </div>
    );
}
