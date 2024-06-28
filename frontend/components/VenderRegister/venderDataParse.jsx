import { shortenFilename } from "../utils/jsutils";

export const venderDataParse = (sellerData, businessFiles) => {
    const formData = new FormData();

    // Extract and format data from sections
    const sellerProfileData = {
        seller_profile: {},
        addresses: {},
        // payment_info: {},
        contact_people: {},
    };
    console.log("SELLER DATA", sellerData);

    Object.keys(sellerData).forEach((sellerDataKey) => {
        if (sellerData[sellerDataKey]) {
            Object?.keys(sellerData[sellerDataKey])?.forEach((fieldKey) => {
                const fieldValue = sellerData[sellerDataKey][fieldKey];

                // Add data to the corresponding part of the sellerProfileData object
                if (sellerDataKey === "seller_profile") {
                    // Assuming section 1 is for seller_profile
                    sellerProfileData.seller_profile[fieldKey] = fieldValue;
                } else if (sellerDataKey === "addresses") {
                    // Assuming section 2 is for addresses
                    sellerProfileData.addresses[fieldKey] = fieldValue;
                } else if (sellerDataKey === "contact_people") {
                    // Assuming section 3 is for documents
                    sellerProfileData.contact_people[fieldKey] = fieldValue;
                }
                // } else if (sellerDataKey === "payment_info") {
                //     // Assuming section 4 is for payment_info
                //     sellerProfileData.payment_info[fieldKey] = fieldValue;
                // }
                // Add similar conditionals for other sections if needed
            });
        }
    });
    console.log("BUSINESS FILES", businessFiles);

    const fileTypes = [];
    Object.keys(businessFiles).forEach((businessFilesKey) => {
        Object.keys(businessFiles[businessFilesKey]);
        let fieldValue = businessFiles[businessFilesKey];
        let file = fieldValue.file;

        console.log("FILE", file);
        let newName = shortenFilename(file.name);
        let newFile = new File([file], newName, { type: file.type });

        // fieldValue.file["name"] = shortenFilename(fieldValue.file["name"]);
        formData.append("documents", newFile);
        fileTypes.push(fieldValue.document_type);
        console.log("NEW FILE", newFile);
        // formData.append(fieldValue.file.name, fieldValue.document_type); // 'documents' is the key for each file
    });

    formData.append("file_types", JSON.stringify(fileTypes));
    // const businessFilesArray = Array.from(businessFiles);
    // businessFiles.map((uploadFile) => {
    //     formData.append("documents", uploadFile.file); // 'documents' is the key for each file
    //     formData.append(uploadFile.file.name, documentType); // 'documents' is the key for each file
    // });

    // Convert sellerProfileData keys to snake_case and append to formData
    formData.append("json_data", JSON.stringify(sellerProfileData));

    return formData;
};

export const parseCreateProductData = (stateData) => {
    const formData = new FormData();
    console.log("STATE DATA", stateData);

    // Add product data
    formData.append("name", stateData.title);
    formData.append("description", stateData.description);
    formData.append("unit_of_measuring", "Count");
    formData.append("country_of_origin", stateData.country);

    if (stateData.itemType === "bulk") {
        let policies = stateData.bulkPurchasePolicies;
        let min_price = policies[0].price;
        let max_price = policies[0].price;

        for (const policy of policies) {
            if (policy.price < min_price) {
                min_price = policy.price;
            }
            if (policy.price > max_price) {
                max_price = policy.price;
            }
        }
        formData.append("min_price", min_price);
        formData.append("max_price", max_price);
    } else {
        formData.append("min_price", stateData.price);
        formData.append("max_price", stateData.price);
    }

    // if (stateData.limited) {
    //     let totalQuantity = parseInt(stateData.quantity);

    //     if (stateData.combinationQuantities) {
    //         totalQuantity = Object.values(
    //             stateData.combinationQuantities
    //         ).reduce((acc, quantity) => acc + parseInt(quantity), 0);
    //     }
    //     formData.append("in_stock", totalQuantity);
    // }

    if (stateData.limited) {
        let totalQuantity = parseInt(stateData.quantity);

        if (
            stateData.combinationQuantities &&
            Array.isArray(stateData.combinationQuantities) &&
            stateData.combinationQuantities.length > 0
        ) {
            totalQuantity = stateData.combinationQuantities.reduce(
                (acc, combination) => acc + parseInt(combination.quantity),
                0
            );
        }
        formData.append("in_stock", totalQuantity);
    }

    formData.append("limited_stock", stateData.limited);
    formData.append("sell_in_containers", stateData.sellingInContainers);
    formData.append("category", stateData.category.selected.id);

    if (stateData.itemType === "bulk") {
        const smallestMinimumQuantity = Math.min(
            ...stateData.bulkPurchasePolicies.map((policy) =>
                parseInt(policy.minimumQuantity)
            )
        );
        formData.append("min_order_quantity", smallestMinimumQuantity);
        formData.append("bulk", true);
    } else {
        formData.append("bulk", false);
    }

    // Add main image
    const shortenedMainImageFilename = shortenFilename(
        stateData.mainImage.file.name
    );
    const type = stateData.mainImage.file.type || "image/jpeg";

    const mainImageFile = new File(
        [stateData.mainImage.file],
        shortenedMainImageFilename,
        { type: type }
    );

    // console.log("Main image name", shortenedMainImageFilename);
    // console.log("Main image type", type);
    // console.log("Main image file", stateData.mainImage.file);

    formData.append("image", mainImageFile);

    // formData.append("image", stateData.mainImage.file);

    // Add shipping address
    formData.append("shipping_address", stateData.shippingAddressId);

    console.log("SELLING IN CONTAINERS", stateData?.sellingInContainers);
    console.log("SELLING BULKS", stateData?.bulk);
    // Add box dimensions
    if (stateData?.itemType === "bulk" && stateData?.sellingInContainers) {
        const {
            containerHeight,
            containerLength,
            containerWidth,
            containerWeight,
        } = stateData.bulkPurchasePolicies[0] || {};
        console.log(
            "FIRST BULK PURCHASE POLICY",
            stateData.bulkPurchasePolicies[0]
        );
        formData.append("box_height", containerHeight ?? "");
        formData.append("box_length", containerLength ?? "");
        formData.append("box_width", containerWidth ?? "");
        formData.append("box_weight", containerWeight ?? "");
    } else {
        const { height, length, width, weight } = stateData.boxDimension || {};
        formData.append("box_height", height ?? "");
        formData.append("box_length", length ?? "");
        formData.append("box_width", width ?? "");
        formData.append("box_weight", weight ?? "");
    }

    // Add item dimensions
    formData.append("item_height", stateData.itemDimension.height);
    formData.append("item_length", stateData.itemDimension.length);
    formData.append("item_width", stateData.itemDimension.width);
    formData.append("item_weight", stateData.itemDimension.weight);

    // Add measuring units
    formData.append("dimensions_unit", stateData.lengthMeasuringUnit);
    formData.append("weight_unit", stateData.weightMeasuringUnit);

    let totalIndex = 0;
    // Add product options
    Object.entries(stateData.productOptions).forEach(([key, value], index) => {
        formData.append(
            `productOptions[${index}].category_option`,
            value.category
        );
        formData.append(`productOptions[${index}].name`, key);
        formData.append(`productOptions[${index}].value`, value.value);
        totalIndex = index;
    });

    // Add own feature options
    stateData.ownFeatureOptions.forEach((option, index) => {
        totalIndex += 1;
        formData.append(`productOptions[${totalIndex}].category_option`, null);
        formData.append(`productOptions[${totalIndex}].name`, option.name);
        formData.append(`productOptions[${totalIndex}].value`, option.value);
    });

    // Add additional images
    let lastIndex = 0;
    stateData.images.forEach((image, index) => {
        const shortenedFilename = shortenFilename(image.file.name);
        const file = new File([image.file], shortenedFilename, {
            type: image.file.type,
        });

        formData.append(`files[${index}]`, file);
        formData.append(`file_types[${index}]`, "IMAGE");
        lastIndex = index + 1;
        // formData.append(`file_ids[${index}]`, image);
    });

    if (stateData.video) {
        // <VideoAdd formData={formData} setFormData={setFormData} />
        // const shortenedFilename = shortenFilename(stateData.video.file.name);
        // const file = new File([stateData.video.file], shortenedFilename, {
        //     type: stateData.video.file.type,
        // });
        formData.append(`files[${lastIndex}]`, stateData.video.file);
        formData.append(`file_types[${lastIndex}]`, "VIDEO");
    }

    // Add variation categories and variations
    if (
        stateData.variationCategories &&
        stateData.variationCategories.length > 0
    ) {
        stateData.variationCategories.forEach((category, catIndex) => {
            formData.append(
                `variationCategories[${catIndex}].name`,
                category.name
            );
            category.variations.forEach((variation, varIndex) => {
                formData.append(
                    `variationCategories[${catIndex}].variations[${varIndex}].name`,
                    variation.name
                );
            });
        });
        // Add combination quantities
        if (stateData.limited) {
            stateData.combinationQuantities.map((it, index) => {
                formData.append(
                    `combinationQuantities[${index}].combination`,
                    it.name
                );
                formData.append(
                    `combinationQuantities[${index}].in_stock`,
                    it.quantity
                );
            });
        }
    }

    if (stateData.itemType === "bulk") {
        // Add bulk purchase policies
        stateData.bulkPurchasePolicies.forEach((policy, index) => {
            formData.append(
                `bulkPurchasePolicies[${index}].minimumQuantity`,
                policy.minimumQuantity
            );
            formData.append(
                `bulkPurchasePolicies[${index}].price`,
                policy.price
            );
            formData.append(
                `bulkPurchasePolicies[${index}].min_lead_time`,
                policy.min_lead_time
            );
            formData.append(
                `bulkPurchasePolicies[${index}].max_lead_time`,
                policy.max_lead_time
            );
            if (stateData.sellingInContainers) {
                formData.append(
                    `bulkPurchasePolicies[${index}].container_name`,
                    policy.containerName
                );
                formData.append(
                    `bulkPurchasePolicies[${index}].container_length`,
                    policy.containerLength
                );
                formData.append(
                    `bulkPurchasePolicies[${index}].container_height`,
                    policy.containerHeight
                );
                formData.append(
                    `bulkPurchasePolicies[${index}].container_width`,
                    policy.containerWidth
                );
                formData.append(
                    `bulkPurchasePolicies[${index}].container_weight`,
                    policy.containerWeight
                );
            }
        });
    }

    console.log("RETURN DATA", formData);
    return formData;
};

export const parseUpdateProductData = (stateData) => {
    const formData = new FormData();
    // console.log("STATE DATA", stateData);

    // Add product data
    formData.append("name", stateData.title);
    formData.append("description", stateData.description);
    formData.append("unit_of_measuring", "Count");
    formData.append("country_of_origin", stateData.country);

    if (stateData.itemType === "bulk") {
        let policies = stateData.bulkPurchasePolicies;
        let min_price = policies[0].price;
        let max_price = policies[0].price;

        for (const policy of policies) {
            if (policy.price < min_price) {
                min_price = policy.price;
            }
            if (policy.price > max_price) {
                max_price = policy.price;
            }
        }
        formData.append("min_price", min_price);
        formData.append("max_price", max_price);
    } else {
        formData.append("min_price", stateData.price);
        formData.append("max_price", stateData.price);
    }

    // if (stateData.limited) {
    //     console.log("LIMITED", stateData.quantity);
    //     let totalQuantity = parseInt(stateData.quantity);
    //     console.log("TOTAL QUANTITY BEFORE", totalQuantity);

    //     if (
    //         stateData.combinationQuantities &&
    //         Array.isArray(stateData.combinationQuantities) &&
    //         stateData.combinationQuantities.length > 0
    //     ) {
    //         totalQuantity = stateData.combinationQuantities.reduce(
    //             (acc, combination) => acc + parseInt(combination.quantity),
    //             0
    //         );

    //         // totalQuantity = Object.values(
    //         //     stateData.combinationQuantities
    //         // ).reduce((acc, quantity) => acc + parseInt(quantity), 0);
    //         console.log("COMBINATION EXIST", stateData.combinationQuantities);
    //     }
    //     console.log("TOTAL QUANTITY AFTER", totalQuantity);
    //     formData.append("in_stock", totalQuantity);
    // }
    formData.append("limited_stock", stateData.limited);
    formData.append("sell_in_containers", stateData.sellingInContainers);
    formData.append("category", stateData.category.selected.id);

    if (stateData.itemType === "bulk") {
        const smallestMinimumQuantity = Math.min(
            ...stateData.bulkPurchasePolicies.map((policy) =>
                parseInt(policy.minimumQuantity)
            )
        );
        formData.append("min_order_quantity", smallestMinimumQuantity);
        formData.append("bulk", true);
    } else {
        formData.append("bulk", false);
    }

    // Add main image

    if (stateData?.mainImage?.isFile) {
        const shortenedMainImageFilename = shortenFilename(
            stateData.mainImage.file.name
        );
        const type = stateData.mainImage.file.type || "image/jpeg";

        const mainImageFile = new File(
            [stateData.mainImage.file],
            shortenedMainImageFilename,
            { type: type }
        );

        // console.log("Main image name", shortenedMainImageFilename);
        // console.log("Main image type", type);
        // console.log("Main image file", stateData.mainImage.file);

        formData.append("image", mainImageFile);
    } else {
        formData.append("image", stateData.mainImage.file);
    }

    // Add shipping address
    formData.append("shipping_address", stateData.shippingAddressId);

    // Add box dimensions

    if (stateData?.itemType === "bulk" && stateData?.sellingInContainers) {
        const {
            containerHeight,
            containerLength,
            containerWidth,
            containerWeight,
        } = stateData.bulkPurchasePolicies[0] || {};
        console.log(
            "FIRST BULK PURCHASE POLICY",
            stateData.bulkPurchasePolicies[0]
        );
        formData.append("box_height", containerHeight ?? "");
        formData.append("box_length", containerLength ?? "");
        formData.append("box_width", containerWidth ?? "");
        formData.append("box_weight", containerWeight ?? "");
    } else {
        const { height, length, width, weight } = stateData.boxDimension || {};
        formData.append("box_height", height ?? "");
        formData.append("box_length", length ?? "");
        formData.append("box_width", width ?? "");
        formData.append("box_weight", weight ?? "");
    }

    // formData.append("box_height", stateData.boxDimension.height);
    // formData.append("box_length", stateData.boxDimension.length);
    // formData.append("box_width", stateData.boxDimension.width);
    // formData.append("box_weight", stateData.boxDimension.weight);

    // Add item dimensions
    formData.append("item_height", stateData.itemDimension.height);
    formData.append("item_length", stateData.itemDimension.length);
    formData.append("item_width", stateData.itemDimension.width);
    formData.append("item_weight", stateData.itemDimension.weight);

    // Add measuring units
    formData.append("dimensions_unit", stateData.lengthMeasuringUnit);
    formData.append("weight_unit", stateData.weightMeasuringUnit);

    let totalIndex = 0;
    // Add product options
    Object.entries(stateData.productOptions).forEach(([key, value], index) => {
        formData.append(
            `productOptions[${index}].category_option`,
            value.category
        );
        formData.append(`productOptions[${index}].name`, key);
        formData.append(`productOptions[${index}].value`, value.value);
        formData.append(`productOptions[${index}].id`, value?.id);
        totalIndex = index;
    });

    // Add own feature options
    stateData.ownFeatureOptions.forEach((option, index) => {
        totalIndex += 1;
        formData.append(`productOptions[${totalIndex}].category_option`, null);
        formData.append(`productOptions[${totalIndex}].name`, option.name);
        formData.append(`productOptions[${totalIndex}].value`, option.value);
        formData.append(
            `productOptions[${totalIndex}].id`,
            option?.id ? option.id : null
        );
    });

    // Add additional images
    // stateData.images.forEach((image, index) => {
    //     formData.append(`files[${index}]`, image.file);
    //     formData.append(`file_ids[${index}]`, image?.id);
    // });

    let lastIndex = 0;
    stateData.images.forEach((image, index) => {
        let file = image.file;
        if (image?.isFile) {
            const shortenedFilename = shortenFilename(image.file.name);
            file = new File([image.file], shortenedFilename, {
                type: image.file.type,
            });
        }

        formData.append(`files[${index}]`, file);
        formData.append(`file_ids[${index}]`, image?.id);
        formData.append(`file_types[${index}]`, "IMAGE");
        lastIndex = index + 1;
    });

    if (stateData.video) {
        formData.append(`files[${lastIndex}]`, stateData.video.file);
        formData.append(`file_ids[${lastIndex}]`, stateData.video?.id);
        formData.append(`file_types[${lastIndex}]`, "VIDEO");
    }

    // Add variation categories and variations
    if (
        stateData.variationCategories &&
        stateData.variationCategories.length > 0
    ) {
        stateData.variationCategories.forEach((category, catIndex) => {
            if (category.id) {
                formData.append(
                    `variationCategories[${catIndex}].id`,
                    category?.id
                );
            }
            formData.append(
                `variationCategories[${catIndex}].name`,
                category.name
            );
            category.variations.forEach((variation, varIndex) => {
                formData.append(
                    `variationCategories[${catIndex}].variations[${varIndex}].id`,
                    variation?.id
                );
                formData.append(
                    `variationCategories[${catIndex}].variations[${varIndex}].name`,
                    variation.name
                );
            });

            if (stateData.limited) {
                stateData.combinationQuantities.map((it, index) => {
                    formData.append(
                        `combinationQuantities[${index}].combination`,
                        it.name
                    );
                    formData.append(
                        `combinationQuantities[${index}].in_stock`,
                        it.quantity
                    );
                });
            }
        });
    }

    if (stateData.limited) {
        let totalQuantity = parseInt(stateData.quantity);

        if (
            stateData.combinationQuantities &&
            Array.isArray(stateData.combinationQuantities) &&
            stateData.combinationQuantities.length > 0
        ) {
            totalQuantity = stateData.combinationQuantities.reduce(
                (acc, combination) => acc + parseInt(combination.quantity),
                0
            );
        }
        formData.append("in_stock", totalQuantity);
    }

    if (stateData.itemType === "bulk") {
        // Add bulk purchase policies
        stateData.bulkPurchasePolicies.forEach((policy, index) => {
            formData.append(
                `bulkPurchasePolicies[${index}].minimumQuantity`,
                policy.minimumQuantity
            );
            if (policy?.old_one) {
                formData.append(
                    `bulkPurchasePolicies[${index}].id`,
                    policy?.id
                );
            } else {
                formData.append(`bulkPurchasePolicies[${index}].id`, null);
            }
            formData.append(
                `bulkPurchasePolicies[${index}].price`,
                policy.price
            );
            formData.append(
                `bulkPurchasePolicies[${index}].min_lead_time`,
                policy.min_lead_time
            );
            formData.append(
                `bulkPurchasePolicies[${index}].max_lead_time`,
                policy.max_lead_time
            );

            if (stateData.sellingInContainers) {
                formData.append(
                    `bulkPurchasePolicies[${index}].container_name`,
                    policy.containerName
                );
                formData.append(
                    `bulkPurchasePolicies[${index}].container_length`,
                    policy.containerLength
                );
                formData.append(
                    `bulkPurchasePolicies[${index}].container_height`,
                    policy.containerHeight
                );
                formData.append(
                    `bulkPurchasePolicies[${index}].container_width`,
                    policy.containerWidth
                );
                formData.append(
                    `bulkPurchasePolicies[${index}].container_weight`,
                    policy.containerWeight
                );
            }
        });
    }

    // console.log("RETURN DATA", formData);
    return formData;
};

// boxDimension:
// height: "10"
// length: "10"
// weight: "1.5"
// width: "10"
// [[Prototype]]: Object
// bulkPurchasePolicies: Array(2)
// 0: {id: 'b0d26b43-49f4-414c-a636-e0f37d3fff51', minimumQuantity: 1, price: 1, min_lead_time: 1, max_lead_time: 2}
// 1: {id: '86ced622-3081-4830-838b-6644404c43b9', minimumQuantity: 2, price: '0.8', min_lead_time: 1, max_lead_time: 2}
// length: 2
// [[Prototype]]: Array(0)
// category:
// selectList: "Electronics / Laptops / Gaming laptops"
// selected: {id: 12, name: 'Gaming laptops', slug: 'gaming-laptops', parent: 11, image: 'http://localhost:8000/media/categories/2024/02/01/414f074c-7145-41e1-89b2-fabe1d11aae7.jpg', …}
// [[Prototype]]: Object
// combinationQuantities:
// Black-M: 1
// Black-S: 1
// Red-M: 1
// Red-S: "0"
// [[Prototype]]: Object
// country: "Bangladesh"
// description: "asfpj"
// images: Array(2)
// 0: File {name: '61J8HL+O4tL._AC_UL600_SR600,400_.jpg', lastModified: 1706896918893, lastModifiedDate: Fri Feb 02 2024 10:01:58 GMT-0800 (Тихоокеанское стандартное время), webkitRelativePath: '', size: 8235, …}
// 1: File {name: 'krasota.png', lastModified: 1706666041850, lastModifiedDate: Tue Jan 30 2024 17:54:01 GMT-0800 (Тихоокеанское стандартное время), webkitRelativePath: '', size: 4440, …}
// length: 2
// [[Prototype]]: Array(0)
// itemDimension:
// height: "5"
// length: "5"
// weight: "1"
// width: "5"
// [[Prototype]]: Object
// itemType: "bulk"
// lengthMeasuringUnit: "cm"
// limited: true
// mainImage: File
// lastModified: 1706896918893
// lastModifiedDate: Fri Feb 02 2024 10:01:58 GMT-0800 (Тихоокеанское стандартное время) {}
// name: "61J8HL+O4tL._AC_UL600_SR600,400_.jpg"
// size: 8235
// type: "image/jpeg"
// webkitRelativePath: ""
// [[Prototype]]: File
// ownFeatureOptions: Array(1)
// 0: {name: 'Hi', value: 'Hh'}
// length: 1
// [[Prototype]]: Array(0)
// price: 1
// productOptions:
// Brand: "asd"
// Display: "15.6-inch Full HD (1920 x 1080) IPS display with 144Hz refresh rate"
// Graphics Card: "NVIDIA GeForce RTX 3060"
// Operating system: "Windows 10 Home"
// Processor: "Intel Core I7"
// RAM: "16GB DDR4 RAM"
// Storage: "512GB NVMe SSD"
// [[Prototype]]: Object
// quantity: "1"
// shippingAddressId: 10
// title: "asf"
// variationCategories: Array(2)
// 0: {id: 'c839365e-f08e-4f98-8ff7-a88435fe649e', name: 'Color', variations: Array(2)}
// 1: {id: '09674de7-6caa-4ea4-b466-a9418901bd8a', name: 'Size', variations: Array(2)}
// length: 2
// [[Prototype]]: Array(0)
// weightMeasuringUnit: "kg"
