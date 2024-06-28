import { convertToLocale, getWindowLocale } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";
import Link from "next/link";

function ListingItem({ product, selected, onSelect }) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const t = useTranslations();

    const translatedCategoryHierarchy = product?.category_hierarchy?.map(
        (category) => ({
            ...category,
            name: t(`CategoriesList.${category.name}`),
            childrens: category?.childrens?.map((child) => ({
                ...child,
                name: t(`CategoriesList.${child.name}`),
            })),
        })
    );
    return (
        <div
            // key={product.id}
            // role="button"
            className="row mx-0  bg-white border mb-1 rounded-0 py-3 py-md-3 align-items-center d-none d-md-flex"
        >
            <div className="order-0 col-auto">
                <input
                    className="form-check-input customcheckbox fs-15"
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                    id="flexCheckDefault"
                />
            </div>
            <div className="order-1 mb-2 mb-md-0 col col-md-auto">
                <Link
                    href={`/seller/listing/edit/${product?.id}`}
                    className=" d-flex align-items-center align-content-center justify-content-center"
                    style={{
                        width: "130px",
                        aspectRatio: "1/1",
                        backgroundImage: `url(${product?.image})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        // maxHeight: 10,
                    }}
                ></Link>
            </div>
            <div className="order-3 order-md-2  col align-self-start row">
                <div className="col">
                    <Link
                        href={`/seller/listing/edit/${product?.id}`}
                        className="fw-medium fs-15 underline-on-hover truncate-overflow-2"
                    >
                        {product?.name}
                    </Link>
                    <div className="text-muted fs-13">
                        {t("Listings.itemId")}: {product.id}
                    </div>
                    <div className="fs-13 text-muted">
                        {product?.limited_stock ? (
                            <span>
                                <strong>{product.in_stock}</strong>{" "}
                                {t("Listings.remainInStock")}
                            </span>
                        ) : (
                            <span className="badge text-bg-main rounded-5 mt-1">
                                {t("ProductDetail.unlimited")}
                            </span>
                        )}
                    </div>
                    <div className="fs-13 text-muted">
                        {product?.quantity_sold ? (
                            <span>
                                <strong>{product.quantity_sold}</strong>{" "}
                                {t("ProductDetail.sold")}
                            </span>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="fs-13 text-muted">
                        {product?.bulk ? (
                            <>
                                <div className="text-black fw-medium my-2">
                                    {t("Listings.bulkItem")}
                                </div>
                                <div>
                                    {t("Listings.minOrderQuantity")}:{" "}
                                    {product.min_order_quantity}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-black fw-medium mt-2">
                                    {t("Listings.retailItem")}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="col-auto text-end text-md-start">
                    <div className=" fw-bold mt-1 ">
                        {product?.min_price !== product?.max_price
                            ? `$${product.min_price} - $${product.max_price}`
                            : `$${product.min_price}`}
                    </div>
                    <div className="text-muted  fs-13">
                        {new Date(product.created).toLocaleDateString(
                            convertToLocale(getWindowLocale()),
                            options
                        )}
                    </div>
                </div>
            </div>
            <div className="order-2 order-md-3 col-4 text-end">
                <div className="fs-14 text-muted">
                    {translatedCategoryHierarchy
                        .map((hierachy) => hierachy.name)
                        .join(" / ")}
                </div>
                {/* <button className="btn fs-15 btn-main fw-bold rounded-small px-5">
                    End listing
                </button> */}
                {/* <div className="fw-medium fs-15 mb-1">$1024.23</div>

                <div className="text-muted  fs-13">Variation: Color</div>
                <div className="text-muted  fs-13">Free delivery</div>
                <div className="text-muted  fs-13">Posted on Jan 12, 2024</div> */}
            </div>
        </div>
    );
}

export default ListingItem;
