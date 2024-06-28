"use client";
import ProductCardV1 from "@/components/ProductCardV1/ProductCardV1";
import { useAppSelector } from "@/redux/hooks";
import { selectWishItems, selectWishStores } from "@/redux/selectors/wish";
import { IconBuildingStore, IconFileStar } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

const mapState = (state) => ({
    wishItems: selectWishItems(state),
});

function Wishlist() {
    const { wishItems } = useAppSelector(mapState);
    const [page, setPage] = useState("items");
    const t = useTranslations("Wishlist");
    return (
        <div className="container-xxl mb-5 pb-4">
            <div className="row mx-0 mt-3">
                <div className="order-1 pe-md-2 order-md-0  d-none col-12 mb-2 col-lg-2 px-0 ">
                    <div className="bg-white p-2 fs-14 rounded-1 ps-3">
                        <div className="mb-4 mt-2">
                            <div
                                onClick={() => setPage("items")}
                                className={`btn light-link fs-14 w-100 text-start d-flex align-items-center fw-medium border-0 ${
                                    page === "items" ? "active" : ""
                                }`}
                            >
                                <IconFileStar size={24} className="me-1 " />{" "}
                                {t("productAndList")}
                            </div>
                        </div>
                        {/* {page === "items" && (
                            <div>
                                <div className="fw-bold text-dark mb-2 ">
                                    Availability
                                </div>
                                <ul className="list-unstyled  ">
                                    <li>
                                        <div className="form-check custom-formcheck pb-0">
                                            <input
                                                className="customradio form-check-input "
                                                type="radio"
                                                name="delivery"
                                                id="delivery1"
                                            />
                                            <label
                                                className="form-check-label"
                                                for="delivery1"
                                            >
                                                Don&apos;t matter
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-check custom-formcheck">
                                            <input
                                                className="form-check-input customradio"
                                                type="radio"
                                                name="delivery"
                                                id="delivery2"
                                            />
                                            <label
                                                className="form-check-label"
                                                for="delivery2"
                                            >
                                                Available
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-check custom-formcheck">
                                            <input
                                                className="form-check-input customradio"
                                                type="radio"
                                                name="delivery"
                                                id="delivery3"
                                            />
                                            <label
                                                className="form-check-label"
                                                for="delivery3"
                                            >
                                                Not available
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )} */}
                    </div>
                </div>

                <div className="order-0 order-md-1 col-12 mb-3 col-lg-12 pe-0 ps-0">
                    <div className="bg-white p-3 mx-0 row  justify-content-between align-items-center flex-wrap">
                        <div className="fw-bold col">
                            {t("wishlist")}{" "}
                            {page === "items" ? t("Items") : t("Shops")}
                        </div>
                        {/* <div className="d-flex align-items-center gap-3 col-auto col-md-4">
                            <div
                                onClick={() => setPage("items")}
                                className={`btn light-link fs-14 w-100 text-start d-flex align-items-center fw-medium border-0 ${
                                    page === "items" ? "active" : ""
                                }`}
                            >
                                <IconFileStar size={24} className="me-1 " />{" "}
                                Wishlist
                            </div>
                            {/* <div
                                onClick={() => setPage("shops")}
                                className={`btn light-link fs-14 w-100 text-start d-flex align-items-center fw-medium border-0 ${
                                    page === "shops" ? "active" : ""
                                }`}
                            >
                                <IconBuildingStore
                                    size={24}
                                    className="me-1 "
                                />
                                Shops
                            </div> */}
                        {/* <select
                                className="form-select fs-13 mt-1 mt-md-0 rounded-small shadow-none border"
                                aria-label="Default select example"
                            >
                                <option selected>Sort by: Newest</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select> 
                        </div> */}
                    </div>
                    <div className="bg-white p-2 mt-2">
                        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6  mx-0">
                            {Array.isArray(wishItems) &&
                            wishItems.length >= 1 ? (
                                wishItems.map((product, index) => (
                                    <ProductCardV1
                                        product={product}
                                        key={index}
                                    />
                                ))
                            ) : (
                                <div className="w-100 w-md-30 mx-auto  text-center py-3 py-md-5">
                                    {/* <div className="fw-medium text-dark fs-md-4 mb-5 text-muted">
                                    No products was found for this query.
                                </div> */}
                                    <img
                                        src="/nothingfound.png"
                                        className="img-fluid px-5"
                                        alt=""
                                    />
                                </div>
                            )}
                            {/* <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/417OJaY3DAL._AC_UL450_SR450,320_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/41isZ6WaV9L._AC_UL450_SR450,320_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/41vhe0X8wbL._AC_UL450_SR450,320_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/713xuNx00oS._AC_UL450_SR450,320_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/71JSM9i1bQL._AC_UL450_SR450,320_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/61ZDwijKtxL._AC_UL450_SR450,320_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/51hUUjfardL._AC_UL450_SR450,320_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/518cRYanpbL._AC_UL450_SR450,320_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/61s3zZQuVHL._AC_UL600_SR600,400_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/513qVqoyb0L._AC_UL600_SR600,400_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/51Am3f1xedL._AC_UL300_SR300,200_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/51RVkm7S4rL._AC_UL300_SR300,200_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/610GWgeQAuL._AC_UL300_SR300,200_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/71wrvwWAgbL._AC_UL300_SR300,200_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/71eN+wQrK1L._AC_UL300_SR300,200_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/61494AqMZWL._AC_UL300_SR300,200_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/51kuTlLiaNL._AC_UL600_SR600,400_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/51S9n+Tc4QL._AC_UL600_SR600,400_.jpg" />
                            <ProductCardV1 img="https://images-na.ssl-images-amazon.com/images/I/61J8HL+O4tL._AC_UL600_SR600,400_.jpg" /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Wishlist;
