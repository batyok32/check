import { fetchSimilarItems } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import React from "react";
import { useEffect, useState } from "react";
import RecommendedProductSlider from "../RecommendedProductSlider/RecommendedProductSlider";
import { SwiperSlide } from "swiper/react";
import ProductCardV1 from "../ProductCardV1/ProductCardV1";
import { useTranslations } from "next-intl";

export default function SimilarItems({ id }) {
    const dispatch = useAppDispatch();
    const [data, setData] = useState([]);
    useEffect(() => {
        dispatch(fetchSimilarItems(id)).then((res) => {
            if (res.status > 205) {
                setData([]);
            } else {
                setData(res.data);
            }

            console.log("RES", res);
        });
    }, [id]);
    const t = useTranslations();
    return (
        <>
            {data && data.length > 0 && (
                <>
                    <div className="bg-white p-3 p-md-0 mt-4">
                        <div className="fw-bold  ">{t("similarItems")}</div>
                        <RecommendedProductSlider>
                            {data &&
                                data.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <ProductCardV1 product={product} />
                                    </SwiperSlide>
                                ))}
                        </RecommendedProductSlider>
                    </div>
                </>
            )}
        </>
    );
}
