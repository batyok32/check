"use client";
import DropSelect from "@/components/SellerComps/DropSelect/DropSelect";
import BoxDimension from "@/components/SellerComps/ListingParts/BoxDimensionListingPart";
import BulkPurchasePolicy from "@/components/SellerComps/ListingParts/BulkPurchasePolicy";
import CategoryAddPart from "@/components/SellerComps/ListingParts/CategoryAddPart";
import ImageAdd from "@/components/SellerComps/ListingParts/ImageAdd/ImageAdd";
import LoadingSpin from "@/components/SellerComps/ListingParts/ImageAdd/LoadingSpin";
import MainImageAdd from "@/components/SellerComps/ListingParts/ImageAdd/MainImageAdd";
import VideoAdd from "@/components/SellerComps/ListingParts/ImageAdd/VideoAdd";
import ItemDimensionListingPart from "@/components/SellerComps/ListingParts/ItemDimensionListingPart";
import ProductOptionsPart from "@/components/SellerComps/ListingParts/ProductOptionsPart";
import ShipAddress from "@/components/SellerComps/ListingParts/ShipAddress/ShipAddress";
import VariationQuantityTablePart from "@/components/SellerComps/ListingParts/VariationQuantityTablePart";
import VariationsSection from "@/components/SellerComps/ListingParts/VariationsSection";
import VariationCategory from "@/components/SellerComps/VariationCategory/VariationCategory";
import { parseCreateProductData } from "@/components/VenderRegister/venderDataParse";
import countries from "@/components/utils/countries";
import {
    lengthMeasuringUnits,
    standardBoxSizes,
    weightMeasuringUnits,
} from "@/components/utils/dbs";
import isEmpty from "@/components/utils/isEmpty";
import { capitalize } from "@/components/utils/jsutils";
import {
    isEmptyTrimmed,
    validateListingProduct,
} from "@/components/utils/validateForm";
import { refreshToken } from "@/redux/actions/authPostActions";
import {
    createProductInDB,
    fetchCategoryOptions,
    fetchProductOptions,
} from "@/redux/actions/sellerActions";
import { fetchCategories } from "@/redux/actions/shopActions";

import { retievedCategories } from "@/redux/features/sellerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IconLock } from "@tabler/icons-react";
import {
    IconBoxSeam,
    IconChevronRight,
    IconPlus,
    IconStatusChange,
    IconTablePlus,
    IconTrash,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
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
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    // Section3
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selected, setSelected] = useState([]);

    const [formErrors, setFormErrors] = useState(null);
    useEffect(() => {
        setFormErrors(validateListingProduct(formData, categoryOptions, t));
        console.log("FORM ERRORS", formErrors);
    }, [formData]);

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const createProduct = () => {
        if (isEmpty(formErrors) && !isLoading) {
            const data = parseCreateProductData(formData);
            for (var pair of data.entries()) {
                console.log(pair[0] + " - " + pair[1]);
            }
            setIsLoading(true);
            dispatch(createProductInDB(data)).then((res) => {
                setIsLoading(false);
                if (res?.status === 201) {
                    toast.success(t("Listings.submittedAllData"), {
                        className: "fs-14",
                    });
                    router.push("/seller/listing");
                } else if (res?.status === 401) {
                    dispatch(refreshToken())
                        .unwrap()
                        .then((res) => {
                            console.log("REFRESHED AND GOOD NOW");
                        });
                } else {
                    toast.error(t("AddressEditModal.errorOccurred"), {
                        className: "fs-14",
                    });
                    console.log("RES", res);
                }
            });
        }
    };

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
                    {isLoading ? (
                        <button className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
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
                        </button>
                    ) : (
                        <button
                            disabled={!isEmpty(formErrors)}
                            onClick={() => createProduct()}
                            className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center"
                        >
                            <IconLock className="me-1" size={22} />{" "}
                            {t("Listings.listItem")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
