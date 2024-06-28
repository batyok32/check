"use client";

import { IconChevronRight } from "@tabler/icons-react";
import { useEffect } from "react";
import Link from "next/link";
import SliderHeader from "@/components/Home/SliderHeader";
import { SwiperSlide } from "swiper/react";
import { fetchGlobalPickups } from "@/redux/actions/shopActions";
import { gotGlobalPickups } from "@/redux/features/shopSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function GlobalPickups() {
    const { globalPickups } = useAppSelector((state) => state.shop);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGlobalPickups()).then((res) => {
            if (res?.data) {
                dispatch(gotGlobalPickups(res.data));
            }
        });
    }, []);

    return (
        <div>
            <div className="container-xxl">
                <div className="bg-white rounded-1  mt-3 py-3 px-sm-3 ">
                    <div>
                        <h6
                            role="button"
                            className="fs-6  underline-on-hover pb-2 fw-bold  ms-3 ms-sm-0 d-flex align-items-center"
                        >
                            Global pickups{" "}
                            <span className="ps-3">
                                <IconChevronRight size={18} />
                            </span>
                        </h6>
                    </div>
                    <div className="fs-14 px-0 py-2 mx-0 fw-medium user-select-none ">
                        <SliderHeader
                            opts={{
                                slidesPerView: 6,
                                spaceBetween: 20,
                                navigation: true,
                            }}
                        >
                            {Array.isArray(globalPickups) &&
                                globalPickups?.length > 0 &&
                                globalPickups.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <Link
                                            href="/"
                                            className="w-100 d-flex py-2  align-items-center flex-column"
                                        >
                                            <div
                                                style={{
                                                    borderRadius: "3%",
                                                }}
                                                className="d-flex justify-content-center align-items-center overflow-hidden"
                                            >
                                                <img
                                                    className="img-fluid"
                                                    src={item.image}
                                                    style={{
                                                        height: "140px",
                                                    }}
                                                    // src={`https://medias.utsavfashion.com/blog/wp-content/uploads/2016/09/tradional-wear-from-pakistan.jpg`}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="text-center mt-1">
                                                {item.name}
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            {/* {Array(16)
                                .fill()
                                .map((_, index) => (
                                    <SwiperSlide key={index}>
                                        <Link
                                            href="/"
                                            className="w-100 d-flex py-2  align-items-center flex-column"
                                        >
                                            <div
                                                style={{
                                                    borderRadius: "3%",
                                                }}
                                                className="bg-main-50 d-flex justify-content-center align-items-center overflow-hidden"
                                            >
                                                <img
                                                    className="img-fluid"
                                                    src={`https://centralasia.news/uploads/posts/2023-03/prazdnik-novruz-bajram-v-turkmenistane.jpg`}
                                                    // src={`https://medias.utsavfashion.com/blog/wp-content/uploads/2016/09/tradional-wear-from-pakistan.jpg`}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="text-center mt-1">
                                                🇹🇲 PK - Classic Pakistani Men's
                                                Clothing
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))} */}
                        </SliderHeader>
                    </div>
                </div>
            </div>
        </div>
    );
}
