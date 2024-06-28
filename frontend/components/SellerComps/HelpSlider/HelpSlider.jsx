"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./HelpSlider.css";
import HelpItem from "../HelpItem/HelpItem";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchHelpCategories } from "@/redux/actions/shopActions";

const productOptions = {
    breakpoints: {
        0: {
            slidesPerView: 3,
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
            slidesPerView: 8,
        },
    },
};

function HelpSlider({ config, helpCategoryConfig, preRoute }) {
    const dispatch = useAppDispatch();
    const [helpCategories, setHelpCategories] = useState([]);

    useEffect(() => {
        dispatch(fetchHelpCategories(helpCategoryConfig)).then((res) => {
            setHelpCategories(res.data);
        });
    }, []);

    return (
        <Swiper
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Autoplay, Pagination]}
            // spaceBetween={50}
            // slidesPerView={5}
            grabCursor
            observer
            autoplay
            // observeParents
            speed={500}
            className="helpslider"
            {...productOptions}
            {...config}
        >
            {Array.isArray(helpCategories) &&
                helpCategories.length > 0 &&
                helpCategories.map((category, index) => (
                    <SwiperSlide key={index}>
                        <HelpItem
                            key={index}
                            preRoute={preRoute}
                            item={category}
                        />
                    </SwiperSlide>
                ))}
        </Swiper>
    );
}

export default HelpSlider;
