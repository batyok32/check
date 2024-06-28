import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
    fetchCategoryOptions,
    fetchProductOptions,
} from "@/redux/actions/sellerActions";
import { useAppDispatch } from "@/redux/hooks";
import DropSelect from "../DropSelect/DropSelect";
import { capitalize } from "@/components/utils/jsutils";
import { IconPlus, IconTrash } from "@tabler/icons-react";
function ProductOptionsPart({
    formData,
    setFormData,
    categoryOptions,
    setCategoryOptions,
}) {
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [featureAddValues, setFeatureAddValues] = useState({
        name: "",
        value: "",
    });
    const featureValueExists = () => {
        const nameTrimmed = featureAddValues.name?.trim();
        const valueTrimmed = featureAddValues.value?.trim();

        const isNameAndValueProvided =
            nameTrimmed.length > 0 && valueTrimmed.length > 0;

        // Check if a similarly named feature already exists, ignoring case
        const doesNameExist = categoryOptions.some(
            (item) => item.name?.toLowerCase() === nameTrimmed.toLowerCase()
        );

        // Return true if name and value are provided and no matching name exists in categoryOptions
        return isNameAndValueProvided && !doesNameExist;
    };

    const addNewFeature = () => {
        if (featureValueExists()) {
            setFormData({
                ...formData,
                ownFeatureOptions: [
                    ...formData.ownFeatureOptions,
                    featureAddValues,
                ],
            });
            setFeatureAddValues({ name: "", value: "" });
        }
    };

    const deleteFeature = (index) => {
        const updatedFeatures = [...formData.ownFeatureOptions];
        updatedFeatures.splice(index, 1);
        setFormData({ ...formData, ownFeatureOptions: updatedFeatures });
    };

    useEffect(() => {
        if (formData.category) {
            setIsLoadingOptions(true);
            dispatch(
                fetchCategoryOptions(formData.category?.selected?.id)
            ).then((res) => {
                console.log("RES", res);
                if (res?.status === 200) {
                    setCategoryOptions(res.data);
                } else {
                    toast.error(t("AddressEditModal.errorOccurred"), {
                        className: "fs-14",
                    });
                    setCategoryOptions([]);
                }
                setIsLoadingOptions(false);
            });
        }
        console.log("RUN ONLY WHEN CATEGORY CHANGES");
    }, [formData.category]);
    return (
        <>
            <h4 className="mt-3 fw-bold">{t("Listings.itemspecifics")}</h4>
            <h6 className="mt-4">{t("Listings.required")}</h6>
            <div className="text-muted fs-14 mb-3">
                {t("Listings.optiondescription")}
            </div>
            <div className="mx-3 mt-4 border p-4 bg-white shadow-sm rounded-small">
                <div className="row row-gap-3">
                    {!isLoadingOptions ? (
                        Array.isArray(categoryOptions) &&
                        categoryOptions.length > 0 ? (
                            categoryOptions.map((item) => (
                                <div className="col-md-6" key={item.id}>
                                    {" "}
                                    {/* Ensure each child in a list has a unique "key" prop */}
                                    <div className="fs-15 mb-1 text-muted">
                                        {item.name}
                                    </div>
                                    <DropSelect
                                        label="-"
                                        onSelect={(value) =>
                                            setFormData({
                                                ...formData,
                                                productOptions: {
                                                    ...formData.productOptions,
                                                    [item.name]: {
                                                        value: value,
                                                        category: item.id,
                                                    },
                                                },
                                            })
                                        }
                                        fetchOptions={(
                                            value,
                                            setOptions,
                                            setIsLoading
                                        ) => {
                                            dispatch(
                                                fetchProductOptions(
                                                    value,
                                                    item.id
                                                )
                                            ).then((res) => {
                                                let response =
                                                    res?.data?.map((opt) => ({
                                                        name: opt.value,
                                                        value: opt.value,
                                                    })) || [];

                                                if (item?.default_values) {
                                                    let defaultValues =
                                                        item.default_values.split(
                                                            ", "
                                                        );
                                                    if (value) {
                                                        defaultValues =
                                                            defaultValues.filter(
                                                                (val) =>
                                                                    val.startsWith(
                                                                        value
                                                                    )
                                                            );
                                                    }
                                                    response = [
                                                        ...response,
                                                        ...defaultValues.map(
                                                            (val) => ({
                                                                name: val,
                                                                value: val,
                                                            })
                                                        ),
                                                    ];
                                                }

                                                // Removes duplicates
                                                response = response.reduce(
                                                    (acc, current) => {
                                                        const x = acc.find(
                                                            (item) =>
                                                                item.name ===
                                                                    current.name &&
                                                                item.value ===
                                                                    current.value
                                                        );
                                                        if (!x) {
                                                            return acc.concat([
                                                                current,
                                                            ]);
                                                        } else {
                                                            return acc;
                                                        }
                                                    },
                                                    []
                                                );
                                                setOptions(response);
                                                setIsLoading(false);
                                            });
                                        }}
                                        // defaultOption={(setSelectedItem) => {
                                        //     setSelectedItem({
                                        //         name: formData.productOptions[
                                        //             Object.keys(
                                        //                 formData?.productOptions
                                        //             ).find(
                                        //                 (opt) =>
                                        //                     opt === item.name
                                        //             )
                                        //         ]?.value,
                                        //     });
                                        // }}

                                        defaultOption={(setSelectedItem) => {
                                            const optionsKeys =
                                                formData?.productOptions
                                                    ? Object.keys(
                                                          formData.productOptions
                                                      )
                                                    : [];
                                            const selectedOptionKey =
                                                optionsKeys.find(
                                                    (opt) => opt === item.name
                                                );

                                            if (selectedOptionKey) {
                                                const selectedOption =
                                                    formData.productOptions[
                                                        selectedOptionKey
                                                    ];
                                                setSelectedItem({
                                                    name: selectedOption?.value,
                                                });
                                            } else {
                                                // Handle the case where there is no matching key
                                                setSelectedItem(null);
                                            }
                                        }}
                                        reset={() => {
                                            // This seems redundant, consider optimizing
                                            setFormData({
                                                ...formData,
                                                productOptions: {
                                                    ...formData.productOptions,
                                                },
                                            });
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center fw-bold">
                                {t("Listings.chooseCategoryFirst")}
                            </div>
                        )
                    ) : (
                        <div className="text-center fw-bold text-main">
                            Loading...
                        </div>
                    )}
                </div>
            </div>

            <h6 className="mt-4">{t("Listings.addBetterPerformance")}</h6>
            <div className="text-muted fs-14 mb-3">
                {t("Listings.buyerFreqSearch")}
            </div>
            <div className="mx-3 mt-4 border p-4 bg-white shadow-sm rounded-small">
                <div className="row row-gap-1 row-gap-md-3 pb-3 align-items-center">
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control border shadow-none rounded-small fs-14  sm-placeholder"
                            placeholder={t("Listings.featureName")}
                            value={featureAddValues.name}
                            onChange={(e) =>
                                setFeatureAddValues({
                                    ...featureAddValues,
                                    name: capitalize(e.target.value),
                                })
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control border shadow-none rounded-small fs-14  sm-placeholder"
                            placeholder={t("Listings.featureValue")}
                            value={featureAddValues.value}
                            onChange={(e) =>
                                setFeatureAddValues({
                                    ...featureAddValues,
                                    value: capitalize(e.target.value),
                                })
                            }
                        />
                    </div>
                    <div className="col-12 col-md-1 ">
                        <button
                            onClick={() => addNewFeature()}
                            disabled={!featureValueExists()}
                            className="btn btn-main fs-14 rounded-small w-100"
                            style={{
                                padding: "5px 0px",
                            }}
                        >
                            <IconPlus />
                        </button>
                    </div>
                </div>

                <div className="row mx-0">
                    <div className="col-md-6 mx-auto">
                        {Array.isArray(formData.ownFeatureOptions) &&
                            formData.ownFeatureOptions.length > 0 &&
                            formData.ownFeatureOptions.map((feature, index) => (
                                <div
                                    key={index}
                                    className="row  row-gap-3 pt-3  align-items-center fs-14"
                                >
                                    <div className="col-md border-bottom text-black-50">
                                        {feature.name}
                                    </div>

                                    <div className="col-md">
                                        {feature.value}
                                    </div>

                                    <div className="col-md-auto">
                                        <button
                                            onClick={() => deleteFeature(index)}
                                            className="btn btn-danger fs-14 rounded-small w-100"
                                        >
                                            <IconTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <hr />
        </>
    );
}

export default ProductOptionsPart;
