"use client";
import DropSelect from "@/components/SellerComps/DropSelect/DropSelect";
import BoxDimension from "@/components/SellerComps/ListingParts/BoxDimensionListingPart";
import BulkPurchasePolicy from "@/components/SellerComps/ListingParts/BulkPurchasePolicy";
import CategoryAddPart from "@/components/SellerComps/ListingParts/CategoryAddPart";
import ImageAdd from "@/components/SellerComps/ListingParts/ImageAdd/ImageAdd";
import MainImageAdd from "@/components/SellerComps/ListingParts/ImageAdd/MainImageAdd";
import VideoAdd from "@/components/SellerComps/ListingParts/ImageAdd/VideoAdd";
import ItemDimensionListingPart from "@/components/SellerComps/ListingParts/ItemDimensionListingPart";
import ProductOptionsPart from "@/components/SellerComps/ListingParts/ProductOptionsPart";
import ShipAddress from "@/components/SellerComps/ListingParts/ShipAddress/ShipAddress";
import VariationsSection from "@/components/SellerComps/ListingParts/VariationsSection";
import VariationCategory from "@/components/SellerComps/VariationCategory/VariationCategory";
import { parseUpdateProductData } from "@/components/VenderRegister/venderDataParse";
import countries from "@/components/utils/countries";
import {
    lengthMeasuringUnits,
    weightMeasuringUnits,
} from "@/components/utils/dbs";
import isEmpty from "@/components/utils/isEmpty";
import { capitalize } from "@/components/utils/jsutils";
import { validateListingProduct } from "@/components/utils/validateForm";
import {
    fetchCategoryOptions,
    fetchProductOptions,
    updateProduct,
} from "@/redux/actions/sellerActions";
import { fetchCategories, fetchProduct } from "@/redux/actions/shopActions";
import { retievedCategories } from "@/redux/features/sellerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IconBoxSeam, IconLock } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Page({ params: { id } }) {
    const [formData, setFormData] = useState({
        itemType: "bulk",
        category: null,
        limited: false,
        quantity: 1,
        title: "",
        description: "",
        price: 1,
        country: "",
        variationCategories: [],
        ownFeatureOptions: [],
        productOptions: null,
        combinationQuantities: null,
        weightMeasuringUnit: "",
        video: null,
        lengthMeasuringUnit: "",
        itemDimension: {
            height: "",
            length: "",
            width: "",
            weight: "",
        },
        boxDimension: {
            height: "",
            length: "",
            width: "",
            weight: "",
        },
        shippingAddressId: null,
        images: [],
        bulkPurchasePolicies: [],
        mainImage: null,
        sellingInContainers: false,
    });

    const t = useTranslations();
    const dispatch = useAppDispatch();

    const onChange = (event) => {
        if (["quantity", "price"].includes(event.target.name)) {
            if (
                parseFloat(event.target.value) < 1 ||
                isNaN(parseFloat(event.target.value))
            ) {
                return; // Do not update state if value is less than 1
            }
        }
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    const [selected, setSelected] = useState([]);
    const [product, setProduct] = useState(null);
    useEffect(() => {
        if (id) {
            dispatch(fetchProduct(id)).then((res) => {
                if (res.status > 205) {
                    setProduct(null);
                } else {
                    setProduct(res.data);
                    let item = res.data;
                    console.log("ITEM", item);

                    setFormData({
                        ...formData,
                        id: item.id,
                        itemType: item.bulk ? "bulk" : "retail",
                        limited: item.limited_stock,
                        quantity: item.in_stock,
                        title: item.name,
                        description: item.description,
                        price: item?.min_price,
                        country: item?.country_of_origin,

                        ownFeatureOptions: item.options
                            .filter((option) => option.category_option === null)
                            .map((option) => ({
                                id: option.id,
                                name: option.name,
                                value: option.value,
                            })),
                        productOptions: item.options.reduce((acc, ite) => {
                            if (ite.category_option) {
                                acc[ite.name] = {
                                    id: ite.id,
                                    name: ite.name,
                                    value: ite.value,
                                    category: ite?.category_option?.id,
                                };
                            }
                            return acc;
                        }, {}),
                        variationCategories: item.variation_categories.map(
                            (var_cat) => ({
                                name: var_cat.name,
                                id: var_cat.id,
                                variations: var_cat.variations,
                            })
                        ),

                        combinationQuantities: item.variation_quantities.map(
                            (it) => {
                                const variationsWithDash = it.variations
                                    .replace(/,/g, "-")
                                    .replace(/\s+/g, "");

                                return {
                                    name: variationsWithDash,
                                    quantity: it.in_stock,
                                };
                            }
                        ),

                        bulkPurchasePolicies: item.bulks.map((bulk) => ({
                            id: bulk.id,
                            minimumQuantity: bulk.minimum_quantity,
                            price: bulk.price,
                            min_lead_time: bulk.min_lead_time,
                            max_lead_time: bulk.max_lead_time,
                            containerName: bulk.container_name,
                            containerLength: bulk.container_length,
                            containerHeight: bulk.container_height,
                            containerWidth: bulk.container_width,
                            old_one: true,
                        })),
                        images: item.files
                            .filter((fil) => fil.file_type === "IMAGE")
                            .map((fil) => ({
                                id: fil.id,
                                file: fil.file,
                            })),
                        weightMeasuringUnit: item?.weight_unit,
                        lengthMeasuringUnit: item?.dimensions_unit,
                        itemDimension: {
                            height: item.item_height,
                            length: item.item_length,
                            width: item.item_width,
                            weight: item.item_weight,
                        },
                        boxDimension: {
                            height: item.box_height,
                            length: item.box_length,
                            width: item.box_width,
                            weight: item.box_weight,
                        },
                        shippingAddressId: item.shipping_address.id,
                        mainImage: {
                            file: item?.image,
                        },
                        video: item?.files.find(
                            (fil) => fil.file_type === "VIDEO"
                        ),
                        sellingInContainers: item?.sell_in_containers,
                    });
                    const translatedCategoryHierarchy =
                        res.data.category_hierarchy.map((category) => ({
                            ...category,
                            name: t(`CategoriesList.${category.name}`),
                            childrens: category?.childrens?.map((child) => ({
                                ...child,
                                name: t(`CategoriesList.${child.name}`),
                            })),
                        }));
                    setSelected(translatedCategoryHierarchy);
                }
            });
        }
    }, [id]);

    const [categoryOptions, setCategoryOptions] = useState([]);

    const [formErrors, setFormErrors] = useState(null);
    useEffect(() => {
        setFormErrors(validateListingProduct(formData, null, t));
        console.log("FORM ERRORS", formErrors);
    }, [formData]);

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const updateProductFunction = () => {
        if (isEmpty(formErrors) && !isLoading) {
            const data = parseUpdateProductData(formData);
            for (var pair of data.entries()) {
                console.log(pair[0] + " - " + pair[1]);
            }
            setIsLoading(true);
            dispatch(updateProduct(data, id)).then((res) => {
                setIsLoading(false);
                if (res?.status > 205) {
                    toast.error(t("AddressEditModal.errorOccurred"), {
                        className: "fs-14",
                    });
                    console.log("RES", res);
                } else {
                    toast.success(t("Listings.submittedAllData"), {
                        className: "fs-14",
                    });
                    router.push("/seller/listing");
                }
            });
        } else {
            toast.error(`Error ${formErrors[0]}`, { className: "fs-14" });
        }
    };

    console.log("FORM DATA", formData);
    return (
        <div className="row mx-0 ">
            <div className="px-4 py-1 col-11 my-3 shadow-sm mx-auto bg-white pb-4">
                {/* ----------------------------CATEGORY-------------------------------------------------------------------------- */}
                <CategoryAddPart
                    formData={formData}
                    setFormData={setFormData}
                    selected={selected}
                    setSelected={setSelected}
                />
                <hr />

                {/* ----------------------------ITEM TYPE-------------------------------------------------------------------------- */}

                <h4 className="mt-4 fw-bold">{t("Listings.itemType")}</h4>
                <div className="text-muted fs-14 mb-3">
                    {t("Listings.itemTypeDescription")}
                </div>

                <div className="d-none d-md-flex row mx-0 px-md-5 row-gap-2 mb-5 mt-4">
                    <div className="col-md-6 ">
                        <div
                            role="button"
                            onClick={() =>
                                setFormData({ ...formData, itemType: "bulk" })
                            }
                            className={`d-flex justify-content-center text-white  border border-2  flex-column rounded-small ${
                                formData?.itemType === "bulk"
                                    ? "border-main"
                                    : ""
                            }`}
                        >
                            <div
                                className={`w-100 h-100  p-2 border-bottom  border-2  ${
                                    formData?.itemType === "bulk"
                                        ? "bg-main border-main"
                                        : "text-main "
                                }`}
                            >
                                <div className="fw-bold fs-15">
                                    {t("Listings.bulkItem")}
                                </div>
                            </div>
                            <div className="p-2 fs-14 d-flex flex-column row-gap-2 py-3">
                                <div className="text-dark">
                                    <span className="text-main fw-medium">
                                        {t("Listings.targetMarket")}:
                                    </span>{" "}
                                    {t("Listings.targetMarketDescription1")}
                                </div>
                                <div className="text-dark">
                                    <span className="text-main fw-medium">
                                        {t("Listings.priceFlex")}:
                                    </span>{" "}
                                    {t("Listings.priceFlexDescription1")}
                                </div>
                                <div className="text-dark">
                                    <span className="text-main fw-medium">
                                        {t("Listings.quantity")}:
                                    </span>{" "}
                                    {t("Listings.quantityDescription1")}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 ">
                        <div
                            role="button"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    itemType: "retail",
                                    sellingInContainers: false,
                                })
                            }
                            className={`d-flex justify-content-center text-white  border border-2  flex-column rounded-small ${
                                formData?.itemType === "retail"
                                    ? "border-main"
                                    : ""
                            }`}
                        >
                            <div
                                className={`w-100 h-100  p-2 border-bottom  border-2 ${
                                    formData?.itemType === "retail"
                                        ? "bg-main border-main"
                                        : " text-main"
                                }`}
                            >
                                <div className="fw-bold fs-15">
                                    {t("Listings.retailItem")}
                                </div>
                            </div>
                            <div className="p-2 fs-14 d-flex flex-column row-gap-2 py-3">
                                <div className="text-dark">
                                    <span className="text-main fw-medium">
                                        {t("Listings.targetMarket")}:
                                    </span>{" "}
                                    {t("Listings.targetMarketDescription2")}
                                </div>
                                <div className="text-dark">
                                    <span className="text-main fw-medium">
                                        {t("Listings.priceFlex")}:
                                    </span>{" "}
                                    {t("Listings.priceFlexDescription2")}
                                </div>
                                <div className="text-dark">
                                    <span className="text-main fw-medium">
                                        {t("Listings.quantity")}:
                                    </span>{" "}
                                    {t("Listings.quantityDescription2")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-md-none form-check form-switch align-items-center d-flex gap-2 ps-0">
                    <label
                        class="form-check-label fw-medium fs-15"
                        for="itemTypeswitch"
                    >
                        {t("Retail")}
                    </label>
                    <input
                        class="form-check-input main-form-check shadow-none mx-1"
                        type="checkbox"
                        role="button"
                        checked={formData.itemType === "bulk"}
                        onClick={() =>
                            setFormData({
                                ...formData,
                                itemType:
                                    formData.itemType === "bulk"
                                        ? "retail"
                                        : "bulk",
                            })
                        }
                        id="itemTypeswitch"
                    />
                    <label
                        class="form-check-label fw-medium fs-15"
                        for="itemTypeswitch"
                    >
                        {t("Bulk")}
                    </label>
                </div>

                <hr />

                {/* ----------------------------LIMITED UNLIMITED QUANTITY-------------------------------------------------------------------------- */}

                <h4 className="mt-4 fw-bold">{t("Listings.quantity")}</h4>
                <div className="text-muted fs-14 mb-3">
                    {t("Listings.limitedDescription")}.
                </div>
                <div class="form-check form-switch align-items-center d-flex gap-2 ps-0">
                    <label
                        class="form-check-label fw-medium fs-15"
                        for="flexSwitchCheckDefault"
                    >
                        {t("ProductDetail.unlimited")}
                    </label>
                    <input
                        class="form-check-input main-form-check shadow-none mx-1"
                        type="checkbox"
                        role="button"
                        checked={formData.limited}
                        onClick={() =>
                            setFormData({
                                ...formData,
                                limited: !formData.limited,
                            })
                        }
                        id="flexSwitchCheckDefault"
                    />
                    <label
                        class="form-check-label fw-medium fs-15"
                        for="flexSwitchCheckDefault"
                    >
                        {t("Listings.limited")}
                    </label>
                </div>
                {formData?.limited && (
                    <>
                        <div className="border-bottom my-4"></div>
                        <h4 className="mt-3 fw-bold">
                            {t("Listings.totalQuantity")}
                        </h4>
                        <div className="text-muted fs-14 mb-3">
                            {t("Listings.totalQuantityDescription")}
                        </div>
                        <input
                            type="number"
                            placeholder="100"
                            min={1}
                            name="quantity"
                            value={formData.quantity}
                            onChange={onChange}
                            className="form-control fs-15 rounded-small border shadow-none"
                        />
                    </>
                )}
                <hr />

                {/* ----------------------------TITLE-------------------------------------------------------------------------- */}

                <h4 className="mt-4 fw-bold">{t("Listings.title")}</h4>
                <div className="text-muted fs-14 mb-3">
                    {t("Listings.titleDescription")}
                </div>
                <input
                    type="text"
                    className="form-control rounded-small shadow-none border fs-15"
                    placeholder={t("Listings.typeForName")}
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                />
                <div className="border-bottom my-4"></div>
                {/* ---------------RETAIL Price------------------ */}
                {formData.itemType === "retail" && (
                    <>
                        <h4 className="mt-4 fw-bold">
                            {t("Listings.price")} ($)
                        </h4>
                        <div className="text-muted fs-14 mb-3">
                            {t("Listings.priceDescription")}.
                        </div>
                        <div className="d-flex">
                            <input
                                type="number"
                                placeholder="150"
                                name="price"
                                value={formData.price}
                                onChange={onChange}
                                min={1}
                                className="form-control fs-15 rounded-small w-auto border shadow-none"
                            />
                        </div>
                    </>
                )}
                <div className="border-bottom my-4"></div>

                {/* ----------------------------DESCRIPTION-------------------------------------------------------------------------- */}
                <div className="border-bottom my-4"></div>
                <h4 className="mt-3 fw-bold ">{t("Listings.description")}</h4>
                <textarea
                    class="form-control mt-3 shadow-none border rounded-small fs-15"
                    id="exampleFormControlTextarea1"
                    rows="10"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                    placeholder={t("Listings.descriptionLong")}
                ></textarea>
                {/* ----------------------------PRODUCT OPTIONS-------------------------------------------------------------------------- */}
                <hr />
                {formData.category && (
                    <ProductOptionsPart
                        formData={formData}
                        setFormData={setFormData}
                        categoryOptions={categoryOptions}
                        setCategoryOptions={setCategoryOptions}
                    />
                )}

                {/* ----------------------------VARIATIONS-------------------------------------------------------------------------- */}
                <VariationsSection
                    formData={formData}
                    setFormData={setFormData}
                />
                {/* ----------------------------ITEM DIMENSIONS-------------------------------------------------------------------------- */}
                <ItemDimensionListingPart
                    formData={formData}
                    setFormData={setFormData}
                />

                {/* ----------------------------SHIPPING ADDRESS-------------------------------------------------------------------------- */}
                <hr />
                <ShipAddress formData={formData} setFormData={setFormData} />
                {/* MAIN IMAGE */}
                <MainImageAdd formData={formData} setFormData={setFormData} />
                {/* ----------------------------IMAGES-------------------------------------------------------------------------- */}
                <ImageAdd formData={formData} setFormData={setFormData} />

                <VideoAdd formData={formData} setFormData={setFormData} />

                {formData?.itemType === "bulk" && (
                    <div>
                        <hr />
                        <h4 className="mt-4 fw-bold ">
                            {t("sellingincontainers")}
                        </h4>
                        <div className="text-muted fs-14 mb-3">
                            {t("sellingincontainersdescription")}
                        </div>
                        <div class="form-check form-switch align-items-center d-flex gap-2 ps-0">
                            <label
                                class="form-check-label fw-medium fs-15"
                                for="sellingInContainers"
                            >
                                {t("no")}
                            </label>
                            <input
                                class="form-check-input main-form-check shadow-none mx-1"
                                type="checkbox"
                                role="button"
                                checked={formData.sellingInContainers}
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        sellingInContainers:
                                            !formData.sellingInContainers,
                                    })
                                }
                                id="sellingInContainers"
                            />
                            <label
                                class="form-check-label fw-medium fs-15"
                                for="sellingInContainers"
                            >
                                {t("yes")}
                            </label>
                        </div>
                    </div>
                )}
                {/* ---------------BULK PURCHASE POLICIES------------------ */}
                {formData?.itemType === "bulk" && (
                    <>
                        <BulkPurchasePolicy
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </>
                )}

                {/* ---------------BOX DIMENSIONS------------------ */}
                {!formData.sellingInContainers && (
                    <BoxDimension
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}

                {!isEmpty(formErrors) && (
                    <div
                        className="fs-14  mt-3 border-2 p-3 border-top border-danger"
                        style={{ backgroundColor: "#FCF4F1" }}
                    >
                        <div className="mb-1 fw-bold">
                            {t("saveProductNeeds", {
                                count: Object.keys(formErrors).length,
                            })}
                        </div>
                        <ul>
                            {Object.keys(formErrors).map((err) => (
                                <li key={err}>{formErrors[err]}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* ---------------BUTTONS------------------ */}
                <div className="d-flex mt-5 justify-content-end gap-3 ">
                    <button
                        disabled={!isEmpty(formErrors)}
                        onClick={() => updateProductFunction()}
                        className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center"
                    >
                        {!isLoading ? (
                            <>
                                {" "}
                                <IconLock className="me-1" size={22} />{" "}
                                {t("Listings.updateItem")}
                            </>
                        ) : (
                            <>
                                <div className="d-flex justify-content-center">
                                    <div
                                        className="spinner-border text-white"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
