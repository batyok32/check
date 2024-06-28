"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

import "./ProductDetailSliderV1.css";

const productOptions = {
    slidesPerView: 5,

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
            slidesPerView: 5,
        },
    },
};

function ProductDetailSliderV1() {
    return (
        <Swiper
            // navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Autoplay, Pagination]}
            // spaceBetween={50}
            // slidesPerView={5}
            grabCursor
            observer
            autoplay
            // observeParents
            speed={500}
            className="productdetailslider"
            {...productOptions}
            // onSlideChange={() => console.log("slide change")}
            // onSwiper={(swiper) => console.log(swiper)}
        >
            <SwiperSlide>
                <div className="px-1">
                    <img
                        src="https://m.media-amazon.com/images/I/31Pi8SF6YGL._SS64_.jpg"
                        alt=""
                        className="border"
                    />
                    <div className="fw-medium truncate-overflow-1 mt-1 text-center">
                        5 inside
                    </div>
                    <div className="text-center ">$7.89</div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="px-1">
                    <img
                        src="https://m.media-amazon.com/images/I/31Pi8SF6YGL._SS64_.jpg"
                        alt=""
                        className="border"
                    />
                    <div className="fw-medium truncate-overflow-1 mt-1 text-center">
                        4 inside
                    </div>
                    <div className="text-center ">$7.89</div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="px-1">
                    <img
                        src="https://m.media-amazon.com/images/I/31Pi8SF6YGL._SS64_.jpg"
                        alt=""
                        className="border"
                    />
                    <div className="fw-medium truncate-overflow-1 mt-1 text-center">
                        3 inside
                    </div>
                    <div className="text-center ">$7.89</div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="px-1">
                    <img
                        src="https://m.media-amazon.com/images/I/31Pi8SF6YGL._SS64_.jpg"
                        alt=""
                        className="border"
                    />
                    <div className="fw-medium truncate-overflow-1 mt-1 text-center">
                        2 inside
                    </div>
                    <div className="text-center ">$7.89</div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="px-1">
                    <img
                        src="https://m.media-amazon.com/images/I/31Pi8SF6YGL._SS64_.jpg"
                        alt=""
                        className="border"
                    />
                    <div className="fw-medium truncate-overflow-1 mt-1 text-center">
                        5 inside
                    </div>
                    <div className="text-center ">$7.89</div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="px-1">
                    <img
                        src="https://m.media-amazon.com/images/I/31Pi8SF6YGL._SS64_.jpg"
                        alt=""
                        className="border"
                    />
                    <div className="fw-medium truncate-overflow-1 mt-1 text-center">
                        5 inside
                    </div>
                    <div className="text-center ">$7.89</div>
                </div>
            </SwiperSlide>
        </Swiper>
    );
}

export default ProductDetailSliderV1;
