"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Slider.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadsliders } from "@/redux/actions/shopActions";
import { useRouter } from "next/navigation";

function Slider() {
    const [sliders, setSliders] = useState([]);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!Array.isArray(sliders) || sliders.length < 1) {
            dispatch(loadsliders()).then((result) => {
                if (result.status > 205) {
                    setSliders([]);
                } else {
                    setSliders(result.data.results);
                }
                console.log("Sliders", result.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Swiper
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination, Autoplay]}
            className="slider-image  rounded-2 text-white"
            // spaceBetween={50}
            slidesPerView={1}
            loop
            grabCursor
            observer
            observeParents
            speed={1000}
            autoplay={true}

            // onSlideChange={() => console.log("slide change")}
            // onSwiper={(swiper) => console.log(swiper)}
        >
            {sliders &&
                sliders.length > 0 &&
                sliders.map((slider) => (
                    <SwiperSlide key={slider.id}>
                        {/* {slider.image} */}
                        <div
                            onClick={() => router.push(slider.link)}
                            className="slider-image"
                            style={{
                                backgroundImage: `url(${slider.image})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: " center center",
                            }}
                        ></div>
                    </SwiperSlide>
                ))}
        </Swiper>
    );
}

export default Slider;
