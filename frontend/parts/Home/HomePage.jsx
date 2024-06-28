"use client";
import { useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import Link from "next/link";
import {
    IconChevronDown,
    IconChevronRight,
    IconMenu,
} from "@tabler/icons-react";
import CategoryDropItem from "@/components/Home/CategoryDropItem";
import { shuffleArray } from "@/redux/utils/opts";
import CategoryItem from "@/components/Categories/CategoryItem/CategoryItem";
import { useRouter } from "next/navigation";
import Slider from "@/components/Slider/Slider";
import SliderHeader from "@/components/Home/SliderHeader";

export default function HomePage() {
    const t = useTranslations();
    const { categories, fullCategories } = useAppSelector(
        (state) => state.shop
    );
    const filteredCategories = fullCategories?.filter(
        (category) => category.parent === null && category.total_childrens > 0
    );
    const filteredCategoryIds = filteredCategories?.map(
        (category) => category.id
    );

    const otherCategories = shuffleArray(
        fullCategories?.filter(
            (category) => !filteredCategoryIds.includes(category.id)
        )
    );
    const topTenOtherCategories = otherCategories?.slice(0, 10);
    // const topTenOtherCategoriesIds = topTenOtherCategories?.map((c) => c.id);
    // const otherTopCategories = otherCategories
    //     .filter((category) => !topTenOtherCategoriesIds.includes(category.id))
    //     .slice(0, 6);
    const router = useRouter();
    return (
        <div className="container-xxl">
            <div className="bg-white d-block d-md-none rounded-1  mt-3 py-md-3 px-sm-3 shadow-sm">
                <div className="mb-lg-5">
                    <div>
                        <Slider />
                    </div>
                </div>
            </div>
            <div className="bg-white d-md-block d-none rounded-1  mt-3 py-3 px-sm-3 shadow-sm">
                <div className="d-none d-md-flex mx-0">
                    <div style={{ width: "20vw" }}>
                        <Link href="/category">
                            <h6
                                role="button"
                                className="fs-6  underline-on-hover pb-2 fw-bold  ms-3 ms-sm-0 d-flex align-items-center"
                            >
                                <IconMenu className="me-1" size={18} />
                                {t("categories")}{" "}
                                {/* <span className="ps-3">
                                    <IconChevronRight size={18} />
                                </span> */}
                            </h6>
                        </Link>
                        <div className="fs-14">
                            {filteredCategories?.map((category) => (
                                <CategoryDropItem
                                    key={category.id}
                                    category={category}
                                />
                            ))}
                        </div>
                    </div>
                    <div style={{ width: "75vw" }}>
                        <div>
                            <Slider />
                        </div>
                    </div>
                </div>

                <div className="d-block d-md-none">
                    <Link href="/category">
                        <h6
                            role="button"
                            className="fs-6  underline-on-hover text-center pb-2 fw-bold  d-flex justify-content-center"
                        >
                            {t("categories")}{" "}
                        </h6>
                    </Link>
                    <div
                        class="accordion accordion-flush px-3 "
                        id="accordionFlushExample"
                    >
                        {filteredCategories?.map((category) => (
                            <div
                                style={{ fontSize: "14px" }}
                                className="accordion-item border-bottom customaccordion "
                            >
                                <div
                                    className="accordion-header"
                                    id={`flush-heading${category.id}`}
                                >
                                    <div
                                        className="accordion-button collapsed py-2 d-flex"
                                        style={{ fontSize: "16px" }}
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#flush-collapse${category.id}`}
                                        aria-expanded="false"
                                        aria-controls={`flush-collapse${category.id}`}
                                    >
                                        {/*  */}
                                        <div>{category.name}</div>
                                        <div className="ps-3 chevron ms-auto">
                                            <IconChevronDown size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div
                                    id={`flush-collapse${category.id}`}
                                    class="accordion-collapse collapse"
                                    aria-labelledby={`flush-heading${category.id}`}
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div class="accordion-body">
                                        {category.childrens
                                            .slice(0, 7)
                                            .map((cat) => (
                                                <div>
                                                    <Link
                                                        href={`/products?category=${cat.id}`}
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                </div>
                                            ))}
                                        <Link
                                            href={`/products?category=${category.id}`}
                                        >
                                            <div className="text-muted mt-1 underline-on-hover">
                                                View all
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {filteredCategories?.map((category) => (
                <div className="bg-white rounded-1 mt-3 py-3 px-sm-3 shadow-sm">
                    <div className="row mx-0">
                        <div className="col-lg-2 border-end d-none d-md-block">
                            <Link href={`/products?category=${category.id}`}>
                                <div
                                    style={{
                                        background: `url(${category.image})`,
                                        backgroundPosition: "center bottom",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "contain",
                                        height: "100%",
                                        width: "80%",
                                        fontStyle: "italic !important",
                                    }}
                                    className="text-end fs-15 fw-medium"
                                >
                                    {" "}
                                    {category.name}
                                </div>
                            </Link>
                        </div>
                        <div className="d-block d-md-none fs-13">
                            <Link href={`/products?category=${category.id}`}>
                                <div className="fw-bold text-center">
                                    {category.name}
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-9">
                            <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6  ">
                                {category.childrens.slice(0, 6).map((cat) => (
                                    <CategoryItem
                                        // img="http://127.0.0.1:8000/media/category_images/d140a40b-aa78-490e-a75a-796893e6549f.jpg"
                                        img={cat.image}
                                        title={cat?.name}
                                        clickHandler={() =>
                                            router.push(
                                                `/products?category=${cat.id}`
                                            )
                                        }
                                        // className={""}
                                        key={cat?.id}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {/* <div className="bg-white rounded-1  mt-3 py-3 px-sm-3 shadow-sm">
                <h6
                    role="button"
                    className="fs-6  underline-on-hover  fw-bold  ms-3 ms-sm-0 d-flex align-items-center"
                >
                    Random Categories
                </h6>
                <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6  ">
                    {otherTopCategories.map((category) => (
                        <CategoryItem
                            // img="http://127.0.0.1:8000/media/category_images/d140a40b-aa78-490e-a75a-796893e6549f.jpg"
                            img={category.image}
                            title={category?.name}
                            clickHandler={() =>
                                router.push(`/products?category=${category.id}`)
                            }
                            // className={""}
                            key={category?.id}
                        />
                    ))}
                </div>
            </div> */}
        </div>
    );
}
