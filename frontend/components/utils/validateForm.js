import { isValidPhoneNumber } from "react-phone-number-input";

export const isEmptyTrimmed = (value) => !value?.trim();
const isInvalidEmail = (email) => !/\S+@\S+\.\S+/.test(email.trim());
const passwordsDoNotMatch = (password, rePassword) =>
    password.trim() !== rePassword.trim();
const isValidExpirationDate = (month, year) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth is zero-based
    console.log(`Validating: month=${month}, year=${year}`); // Debugging line
    console.log(`Current: month=${currentMonth}, year=${currentYear}`); // Debugging line

    // Check if the year is in the future,
    // OR it's the current year and the month is the current month or a future month
    if (Number(year) > Number(currentYear)) return true;
    else if (Number(year) === Number(currentYear)) {
        // console.log("CURRENT YEAR IS GOOD");
        if (Number(month) > Number(currentMonth)) {
            // console.log("CURRENT MONTH IS GOOD");
            return true;
        }
    }
    return false;
};

// Check if the card number length is within the typical range
function isCorrectLength(number) {
    return number.length >= 13 && number.length <= 19;
}

// Luhn Algorithm to validate the card number
function isValidLuhn(number) {
    let sum = 0;
    let shouldDouble = false;
    // Loop through the digits, starting from the right
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    // If the total sum modulo 10 is 0, the number is valid
    return sum % 10 === 0;
}

export function validateRegister(values) {
    let errors = {};

    if (isEmptyTrimmed(values?.first_name))
        errors.first_name = "Please enter your first name";
    if (isEmptyTrimmed(values?.last_name))
        errors.last_name = "Please enter your last name";
    if (isEmptyTrimmed(values?.email)) errors.email = "Please enter your email";
    else if (isInvalidEmail(values.email))
        errors.email = "Email address is invalid";
    if (isEmptyTrimmed(values?.password))
        errors.password = "Please enter a password";
    if (isEmptyTrimmed(values?.re_password))
        errors.re_password = "Please re-enter your password";
    else if (passwordsDoNotMatch(values.password, values.re_password))
        errors.re_password = "Passwords do not match";

    return errors;
}

export function validateLogin(values) {
    let errors = {};

    if (isEmptyTrimmed(values?.email)) errors.email = "Please enter your email";
    else if (isInvalidEmail(values.email))
        errors.email = "Email address is invalid";
    if (isEmptyTrimmed(values?.password))
        errors.password = "Please enter a password";

    return errors;
}

export function validateResetPassword(values) {
    let errors = {};

    if (isEmptyTrimmed(values?.new_password))
        errors.new_password = "Please enter a password";
    if (isEmptyTrimmed(values?.re_new_password))
        errors.re_new_password = "Please re-enter your password";
    else if (passwordsDoNotMatch(values.new_password, values.re_new_password))
        errors.re_new_password = "Passwords do not match";

    return errors;
}

export function validateBusinessRegisterSection1(values) {
    let errors = {};

    if (isEmptyTrimmed(values?.businessName))
        errors.businessName = "Please enter your business name";
    if (!values?.businessType)
        errors.businessType = "Please select your business type";
    else if (
        values?.businessType === "Other" &&
        isEmptyTrimmed(values?.customBusinessType)
    )
        errors.customBusinessType = "Please specify your business type";
    if (isEmptyTrimmed(values?.addressLine1))
        errors.addressLine1 = "Please enter address line 1";
    if (isEmptyTrimmed(values?.city)) errors.city = "Please enter your city";
    if (!values?.country) errors.country = "Please enter your country";
    if (isEmptyTrimmed(values?.state))
        errors.state = "Please enter your state or region";
    if (isEmptyTrimmed(values?.zip))
        errors.zip = "Please enter your ZIP/postal code";
    if (isEmptyTrimmed(values?.phoneNumber))
        errors.phoneNumber = "Please enter your phone number";
    else if (!isValidPhoneNumber(values.phoneNumber.trim()))
        errors.phoneNumber = "Phone number is invalid";
    if (!values.isPhoneVerified)
        errors.phoneNumberVerification = "Please verify your phone number";
    if (!values?.isAgreementAccepted)
        errors.isAgreementAccepted =
            "You must agree to the terms and conditions";

    return errors;
}

export function validateBusinessRegisterSection2(values) {
    let errors = {};

    if (isEmptyTrimmed(values?.firstName))
        errors.firstName = "Please enter your first name";
    if (isEmptyTrimmed(values?.lastName))
        errors.lastName = "Please enter your last name";
    if (!values?.citizenshipCountry)
        errors.citizenshipCountry = "Please select your country of citizenship";
    if (!values?.birthCountry)
        errors.birthCountry = "Please select your country of birth";
    if (!values?.birthDay || !values?.birthMonth || !values?.birthYear)
        errors.birthDate = "Please enter your complete date of birth";
    if (isEmptyTrimmed(values?.addressLine1))
        errors.addressLine1 = "Please enter address line 1";
    if (isEmptyTrimmed(values?.city)) errors.city = "Please enter your city";
    if (!values?.residentialCountry)
        errors.residentialCountry = "Please select your residential country";
    if (isEmptyTrimmed(values?.zip))
        errors.zip = "Please enter your ZIP/postal code";
    if (isEmptyTrimmed(values?.state))
        errors.state = "Please enter your state or region";
    if (!values?.contactPersonRole)
        errors.contactPersonRole =
            "Please confirm if the primary contact person is an owner or a legal representative of the business";

    return errors;
}

export function validateBusinessRegisterSection3(values) {
    let errors = {};

    const digitsOnly = (values?.creditCardNumber || "").replace(/\D+/g, "");

    if (!digitsOnly)
        errors.creditCardNumber = "Please enter your credit card number";
    else if (!isCorrectLength(values.creditCardNumber))
        errors.creditCardNumber = "Credit card number is of invalid length";
    // else if (!isValidLuhn(values.creditCardNumber))
    //     errors.creditCardNumber = "Credit card number is invalid";

    if (!values?.expirationMonth || !values?.expirationYear)
        errors.expirationDate = "Please select the expiration date";
    else if (
        !isValidExpirationDate(values.expirationMonth, values.expirationYear)
    )
        errors.expirationDate = "The expiration date is invalid";

    if (isEmptyTrimmed(values?.cardHolderName))
        errors.cardHolderName = "Please enter the card holder's name";

    return errors;
}

export const validateBusinessRegisterSection5 = (values) => {
    let errors = {};

    if (!values.taxIdFile?.file) {
        errors.taxIdFile = "Please upload your Tax ID.";
    }

    if (!values.nationalIdFile?.file) {
        errors.nationalIdFile = "Please upload your National ID document.";
    }

    if (!values.proofOfAddressFile?.file) {
        errors.proofOfAddressFile = "Please upload your Proof of Address.";
    }

    return errors;
};

export const validateAddressBookForm = (values) => {
    let errors = {};

    // if (isEmptyTrimmed(values?.firstName))
    //     errors.firstName = "Please enter first name ";
    if (isEmptyTrimmed(values?.addressLine1))
        errors.addressLine1 = "Please enter address line 1";
    if (isEmptyTrimmed(values?.city)) errors.city = "Please enter your city";
    if (!values?.country) errors.country = "Please enter your country";
    if (isEmptyTrimmed(values?.state))
        errors.state = "Please enter your state or region";
    if (isEmptyTrimmed(values?.postalCode))
        errors.postalCode = "Please enter your ZIP/postal code";
    // if (isEmptyTrimmed(values?.phoneNumber))
    //     errors.phoneNumber = "Please enter your phone number";
    // else if (!isValidPhoneNumber(values.phoneNumber.trim()))
    //     errors.phoneNumber = "Phone number is invalid";
    // if (!values.isValidPhoneNumber)
    //     errors.phoneNumberVerification = "Please verify your phone number";

    return errors;
};

export const validateSimpleAddressBookForm = (values) => {
    let errors = {};

    if (isEmptyTrimmed(values?.addressLine1))
        errors.addressLine1 = "Please enter address line 1";
    if (isEmptyTrimmed(values?.city)) errors.city = "Please enter your city";
    if (!values?.country) errors.country = "Please enter your country";
    if (isEmptyTrimmed(values?.state))
        errors.state = "Please enter your state or region";
    if (isEmptyTrimmed(values?.zip))
        errors.zip = "Please enter your ZIP/postal code";

    return errors;
};

export const validateListingProduct = (formData, categoryOptions, t) => {
    let errors = {};

    // Basic information checks
    if (isEmptyTrimmed(formData?.title)) errors.title = t("Errors.enterTitle");
    if (isEmptyTrimmed(formData?.description))
        errors.description = t("Errors.enterDescription");
    if (isEmptyTrimmed(formData?.country))
        errors.country = t("Errors.enterCountry");
    if (!formData?.category) errors.category = t("Errors.enterCategory");
    if (isEmptyTrimmed(formData?.itemType))
        errors.itemType = t("Errors.selectItemType");

    // Quantity check, only if limited is true
    if (formData?.limited && (!formData?.quantity || formData?.quantity <= 0)) {
        errors.quantity = t("Errors.enterQuantity");
    }

    // Box dimensions, item dimensions, product options length

    // Dimension and Weight checks
    if (formData?.itemType === "bulk" && formData?.sellingInContainers) {
        console.log(
            'formData?.itemType === "bulk" && formData?.sellingInContainers',
            formData?.itemType,
            formData?.sellingInContainers
        );
        ["itemDimension"].forEach((dim) => {
            const { height, length, width, weight } = formData[dim] || {};
            if (
                height === null ||
                height === undefined ||
                height <= 0 ||
                length === null ||
                length === undefined ||
                length <= 0 ||
                width === null ||
                width === undefined ||
                width <= 0 ||
                weight === null ||
                weight === undefined ||
                weight <= 0
            ) {
                console.log("ERRRORS");
                errors[`${dim}`] = t(`Errors.enter${dim}`);
            }
            console.log("NO errors");
            console.log("DIM", formData[dim]);
        });
    } else {
        console.log("BOXES ARE REWQUIRED");
        console.log(
            'formData?.itemType === "bulk" && formData?.sellingInContainers',
            formData?.itemType,
            formData?.sellingInContainers
        );

        ["itemDimension", "boxDimension"].forEach((dim) => {
            const { height, length, width, weight } = formData[dim] || {};
            if (
                height === null ||
                height === undefined ||
                height <= 0 ||
                length === null ||
                length === undefined ||
                length <= 0 ||
                width === null ||
                width === undefined ||
                width <= 0 ||
                weight === null ||
                weight === undefined ||
                weight <= 0
            ) {
                console.log("ERRRORS");
                errors[`${dim}`] = t(`Errors.enter${dim}`);
            }
            console.log("NO errors");
            console.log("DIM", formData[dim]);
        });
    }

    if (isEmptyTrimmed(formData?.weightMeasuringUnit))
        errors.weightMeasuringUnit = t("Errors.enterWeightMeasuringUnit");
    if (isEmptyTrimmed(formData?.lengthMeasuringUnit))
        errors.lengthMeasuringUnit = t("Errors.enterLengthMeasuringUnit");

    // Array checks
    if (
        typeof formData?.productOptions !== "object" ||
        formData?.productOptions === null ||
        Array.isArray(formData?.productOptions)
    ) {
        errors.productOptions = t("Errors.enterProductOptions");
    }
    // Check if productOptions has entries and matches the length of categoryOptions
    else if (Object.keys(formData.productOptions).length === 0) {
        errors.productOptions = t("Errors.productOptionsError");
    } else if (
        categoryOptions &&
        Object.keys(formData.productOptions).length !== categoryOptions.length
    ) {
        errors.productOptions = t("Errors.productOptionsError2");
    }

    console.log("categoryOptions", categoryOptions);
    // Images and mainImage checks
    if (!Array.isArray(formData?.images) || formData?.images.length === 0) {
        errors.images = t("Errors.enterImage");
    }
    if (!formData?.mainImage) errors.mainImage = t("Errors.selectMainImage");

    // Shipping address check
    if (!formData?.shippingAddressId)
        errors.shippingAddressId = t("Errors.shippingError");

    // Bulk purchase policy checks
    if (formData?.itemType === "bulk") {
        if (
            !Array.isArray(formData?.bulkPurchasePolicies) ||
            formData?.bulkPurchasePolicies.length === 0
        ) {
            errors.bulkPurchasePolicies = t("Errors.bulkPurchaseError");
        }
    } else if (!formData?.price) {
        errors.price = t("Errors.enterPrice");
    }

    // Combination quantities check if variationCategories is provided
    if (
        Array.isArray(formData?.variationCategories) &&
        formData?.variationCategories.length > 0
    ) {
        if (formData.limited && !formData?.combinationQuantities) {
            errors.combinationQuantities = t("Errors.combinationQuantities");
        }
    }

    return errors;
};

export const validateAddressBookForm2 = (values) => {
    let errors = {};

    // if (isEmptyTrimmed(values?.firstName))
    //     errors.firstName = "Please enter first name ";
    if (isEmptyTrimmed(values?.address_line1))
        errors.address_line1 = "Please enter address line 1";
    if (isEmptyTrimmed(values?.city)) errors.city = "Please enter your city";
    if (!values?.country) errors.country = "Please enter your country";
    if (isEmptyTrimmed(values?.state))
        errors.state = "Please enter your state or region";
    if (isEmptyTrimmed(values?.zip_code))
        errors.zip_code = "Please enter your ZIP/postal code";
    // if (isEmptyTrimmed(values?.phoneNumber))
    //     errors.phoneNumber = "Please enter your phone number";
    // else if (!isValidPhoneNumber(values.phoneNumber.trim()))
    //     errors.phoneNumber = "Phone number is invalid";
    // if (!values.isValidPhoneNumber)
    //     errors.phoneNumberVerification = "Please verify your phone number";

    return errors;
};

export const validateBulkPolicyFormData = (
    values,
    sellingInContainers,
    lastPolicy,
    t
) => {
    let errors = {};
    console.log("SELLING IN ÇONTAINERS", sellingInContainers);
    if (!sellingInContainers) {
        if (parseInt(values.min_lead_time) > parseInt(values.max_lead_time)) {
            errors.lead_time = t("Errors.minLeadTime");
        }
        if (
            lastPolicy &&
            parseInt(values.minimumQuantity) <=
                parseInt(lastPolicy.minimumQuantity)
        ) {
            errors.minimumQuantity = t("Errors.minQuantity");
        }
    } else {
        if (isEmptyTrimmed(values.containerName)) {
            errors.containerName = t("Errors.containerName");
        }
        if (!parseFloat(values.containerHeight) > 0) {
            errors.containerHeight = t("Errors.containerHeight");
        }
        if (!parseFloat(values.containerLength) > 0) {
            errors.containerLength = t("Errors.containerLength");
        }
        if (!parseFloat(values.containerWeight) > 0) {
            errors.containerWeight = t("Errors.containerWeight");
        }
        if (!parseFloat(values.containerWidth) > 0) {
            errors.containerWidth = t("Errors.containerWidth");
        }
    }

    return errors;
};
