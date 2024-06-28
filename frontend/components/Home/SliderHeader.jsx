"use client";
// Import Swiper React components
import { Swiper } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "./SliderHeader.css";

function SliderHeader({ children, opts }) {
    return (
        <Swiper
            // navigation

            // pagination={{ clickable: true }}
            modules={[Autoplay, Navigation, Pagination]}
            // spaceBetween={10}
            // slidesPerView={2}
            // grabCursor
            // observer
            // autoplay
            // observeParents
            // speed={500}
            className="productdetailslider2 pb-30"
            {...opts}

            // onSlideChange={() => console.log("slide change")}
            // onSwiper={(swiper) => console.log(swiper)}
        >
            {children}
        </Swiper>
    );
}

export default SliderHeader;
