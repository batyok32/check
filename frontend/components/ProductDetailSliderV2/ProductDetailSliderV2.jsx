"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./ProductDetailSliderV2.css";

function ProductDetailSliderV2({ children }) {
    return (
        <Swiper
            // navigation
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            // spaceBetween={50}
            slidesPerView={4}
            grabCursor
            observer
            autoplay
            // observeParents
            speed={500}
            className="productdetailslider2"
            // onSlideChange={() => console.log("slide change")}
            // onSwiper={(swiper) => console.log(swiper)}
        >
            {children}
        </Swiper>
    );
}

export default ProductDetailSliderV2;
