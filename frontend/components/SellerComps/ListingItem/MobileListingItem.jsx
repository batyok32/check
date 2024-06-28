import { convertToLocale, getWindowLocale } from "@/redux/utils/shop";
import { useTranslations } from "next-intl";
import Link from "next/link";

function MobileListingItem({ product, selected, onSelect }) {
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
        <div className="row mx-0 d-flex d-md-none bg-white border mb-1 rounded-0 py-3 py-md-3 align-items-center">
            <div className="col-auto">
                <input
                    className="form-check-input customcheckbox fs-15"
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                    id="flexCheckDefault"
                />
            </div>
            <div className="mb-2 mb-md-0 col-auto">
                <Link
                    href={`/seller/listing/edit/${product?.id}`}
                    className=" d-flex align-items-center align-content-center justify-content-center m-0"
                    style={{
                        width: "100px",
                        aspectRatio: "1/1",
                        backgroundImage: `url(${product?.image})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        // maxHeight: 10,
                    }}
                ></Link>
            </div>
            <div className="col align-self-start ">
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
                    {product?.quantity_sold && (
                        <span>
                            <strong>{product.quantity_sold}</strong>{" "}
                            {t("ProductDetail.sold")}
                        </span>
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
                <div className="d-flex gap-3 mt-3">
                    <div className="">
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
                    <div className="fs-13 text-muted text-end">
                        {translatedCategoryHierarchy
                            .map((hierachy) => hierachy.name)
                            .join(" / ")}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileListingItem;
