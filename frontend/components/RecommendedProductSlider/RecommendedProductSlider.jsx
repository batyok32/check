"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./RecommendedProductSlider.css";

const productOptions = {
    slidesPerView: 6,
    navigation: true,

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        320: {
            slidesPerView: 2,
            spaceBetween: 5,
        },

        640: {
            slidesPerView: 3,
        },
        768: {
            slidesPerView: 4,
        },
        1024: {
            slidesPerView: 6,
        },
    },
};

function RecommendedProductSlider({ children, customConfigs }) {
    return (
        <Swiper
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination, Navigation]}
            grabCursor
            observer
            autoplay
            speed={500}
            className="recommendedProductSlider"
            {...productOptions}
            {...customConfigs}
        >
            {children}
        </Swiper>
    );
}

export default RecommendedProductSlider;
