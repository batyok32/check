"use client";
// Import Swiper React components
import { Swiper } from "swiper/react";
// Import Swiper styles
import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// import "./ProductDetailSliderV2.css";

function HeaderAddressSlider({ children }) {
    return (
        <Swiper
            // navigation
            // pagination={{ clickable: true }}
            // modules={[Autoplay, Pagination]}
            spaceBetween={10}
            slidesPerView={2}
            grabCursor
            observer
            autoplay
            // observeParents
            // speed={500}
            // className="productdetailslider2"
            // onSlideChange={() => console.log("slide change")}
            // onSwiper={(swiper) => console.log(swiper)}
        >
            {children}
        </Swiper>
    );
}

export default HeaderAddressSlider;
