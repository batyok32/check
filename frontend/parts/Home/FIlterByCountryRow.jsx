"use client";

import { IconChevronRight } from "@tabler/icons-react";
import { useEffect } from "react";
import Link from "next/link";
import SliderHeader from "@/components/Home/SliderHeader";
import { SwiperSlide } from "swiper/react";

export default function FilterByCountryRow() {
    // useEffect(() => {

    // }, [])

    return (
        <div>
            <div className="container-xxl">
                <div className="bg-white rounded-1  mt-3 py-3 px-sm-3 ">
                    <div>
                        <h6
                            role="button"
                            className="fs-6  underline-on-hover pb-2 fw-bold  ms-3 ms-sm-0 d-flex align-items-center"
                        >
                            Filter by country{" "}
                            <span className="ps-3">
                                <IconChevronRight size={18} />
                            </span>
                        </h6>
                    </div>
                    <div className="fs-14 px-0 py-2 mx-0 fw-medium user-select-none ">
                        <SliderHeader
                            opts={{
                                slidesPerView: 8,
                                spaceBetween: 20,
                                navigation: true,
                            }}
                        >
                            <SwiperSlide>
                                <Link
                                    href="/"
                                    className="w-100 d-flex py-2  align-items-center flex-column"
                                >
                                    <div
                                        style={{
                                            borderRadius: "5%",
                                        }}
                                        className="bg-main-50 d-flex justify-content-center align-items-center overflow-hidden"
                                    >
                                        <img
                                            className="img-fluid"
                                            style={{ height: "90px" }}
                                            src={`https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Turkmenistan.svg/1200px-Flag_of_Turkmenistan.svg.png`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="text-center mt-1">
                                        Turkmenistan
                                    </div>
                                </Link>
                            </SwiperSlide>

                            <SwiperSlide>
                                <Link
                                    href="/"
                                    className="w-100 d-flex py-2  align-items-center flex-column"
                                >
                                    <div
                                        style={{
                                            borderRadius: "5%",
                                        }}
                                        className="bg-main-50 d-flex justify-content-center align-items-center overflow-hidden"
                                    >
                                        <img
                                            className="img-fluid"
                                            style={{ height: "90px" }}
                                            src={`https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Flag_of_the_United_States.png/800px-Flag_of_the_United_States.png`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="text-center mt-1">USA</div>
                                </Link>
                            </SwiperSlide>
                            <SwiperSlide>
                                <Link
                                    href="/"
                                    className="w-100 d-flex py-2  align-items-center flex-column"
                                >
                                    <div
                                        style={{
                                            borderRadius: "5%",
                                        }}
                                        className="bg-main-50 d-flex justify-content-center align-items-center overflow-hidden"
                                    >
                                        <img
                                            className="img-fluid"
                                            style={{ height: "90px" }}
                                            src={`https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/255px-Flag_of_the_People%27s_Republic_of_China.svg.png`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="text-center mt-1">
                                        China
                                    </div>
                                </Link>
                            </SwiperSlide>
                        </SliderHeader>
                    </div>
                </div>
            </div>
        </div>
    );
}
