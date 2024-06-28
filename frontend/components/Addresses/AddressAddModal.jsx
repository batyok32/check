"use client";
import { useEffect, useRef, useState } from "react";
import countries from "../utils/countries";
import { validateAddressBookForm } from "../utils/validateForm";
import isEmpty from "../utils/isEmpty";
import { useAppDispatch } from "@/redux/hooks";
import {
    addAddress,
    setChosenAddress,
    setRefetchAddress,
} from "@/redux/features/addressBookSlice";
import { toast } from "react-toastify";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { createAddressInBook } from "@/redux/actions/authPostActions";
import { validateSingleAddress } from "@/redux/actions/shopActions";
import { usStates } from "../utils/usStates";
import { useTranslations } from "next-intl";

export default function AddressAddModal({ children }) {
    const closeBtnRef = useRef(null);
    const initialState = {
        id: crypto.randomUUID(),
        // firstName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        countryCode: "",
        // phoneNumber: "",
        // isVerified: false,
        // isValidPhoneNumber: false,
    };
    const [formData, setFormData] = useState(initialState);
    const [formErrors, setFormErrors] = useState(null);
    const dispatch = useAppDispatch();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setIsValidated(false);
    };

    const handleCountryChange = (e) => {
        setFormData({
            ...formData,
            country: e.target.value,
            countryCode: countries.find(
                (count) => count.name === e.target.value
            ).code,
        });
    };

    const [isValidated, setIsValidated] = useState(false);

    const verifyAnAddress = () => {
        const formattedData = {
            line_1: formData.addressLine1,
            line_2: formData.addressLine2,
            state: formData.state,
            city: formData.city,
            postal_code: formData.postalCode,
            country_alpha2: formData.countryCode,
            replace_with_validation_result: true,
        };
        dispatch(validateSingleAddress(formattedData)).then((res) => {
            // console.log("RES FROM ADDRESS VALIDATION", res);
            if (res.status > 205) {
                setIsValidated(false);
                toast.error(t("went_wrong"), {
                    className: "fs-14",
                });
            } else {
                setIsValidated(true);
                setFormData({
                    addressLine1: res.data.address.line_1,
                    addressLine2: res.data.address.line_2,
                    state: res.data.address.state,
                    city: res.data.address.city,
                    postalCode: res.data.address.postal_code,
                    countryCode: res.data.address.country_alpha2,
                    country: countries.find(
                        (country) =>
                            country.code === res.data.address.country_alpha2
                    ).name,
                });
            }
        });
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (!isValidated) {
            verifyAnAddress();
        }
        // Handle form submission here (e.g., send data to backend or dispatch action)
        if (isValidated) {
            if (isEmpty(formErrors)) {
                const sentData = {
                    address_line1: formData.addressLine1,
                    address_line2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    zip_code: formData.postalCode,
                    country: formData.country,
                };
                dispatch(createAddressInBook(sentData))
                    .then((res) => {
                        console.log("RES", res);
                        // dispatch(addAddress(res));
                        // dispatch(setChosenAddress(res));
                        // dispatch(setRefetchAddress(false));

                        toast.success(t("addSuccess"), { className: "fs-14" });
                        setFormData(initialState);
                        closeBtnRef.current.click();

                        setTimeout(() => {
                            dispatch(setRefetchAddress(Math.random()));
                        }, 500);
                    })
                    .catch((error) => {
                        console.log("ERROR", error);
                        toast.error(t("went_wrong"), {
                            className: "fs-14",
                        });
                    });
            } else {
                toast.warning(`${formErrors}`, { className: "fs-14" });
            }
        }
    };

    // const verifyAnAddress = () => {
    //     console.log("Verify an address:", formData);
    // };
    useEffect(() => {
        setFormErrors(validateAddressBookForm(formData));
    }, [formData]);

    const t = useTranslations("AddressEditModal");
    const allcounts = useTranslations("Countries");

    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target={`#addressAddModal`}
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id={`addressAddModal`}
                // tabIndex="-1"
                aria-labelledby={`addressAddModal`}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-small border-0 shadow-sm">
                        <div className="modal-header ">
                            <div
                                className="modal-title fs-5 py-0 fw-bold"
                                id="exampleModalLabel"
                            >
                                {t("addAddress")}
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14  rounded-small border shadow-none"
                                        id="addressLine1"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("addressLine1")}
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14  rounded-small border shadow-none"
                                        id="addressLine2"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleChange}
                                        placeholder={t("addressLine2")}
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14  rounded-small border shadow-none"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("city")}
                                    />
                                </div>
                                {formData.countryCode === "US" ? (
                                    <div className="mb-2">
                                        <select
                                            className="form-select fs-14  rounded-0 border shadow-none"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    state: e.target.value,
                                                });
                                            }}
                                            aria-label="Default select example"
                                            required
                                        >
                                            <option value="" disabled>
                                                {t("stateSelect")}
                                            </option>

                                            {usStates.map((state) => (
                                                <option
                                                    key={state.code}
                                                    value={state.code}
                                                >
                                                    {state.name} ({state.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="mb-2">
                                        <input
                                            type="text"
                                            className="form-control fs-14  rounded-small border shadow-none"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder={t("statePlaceholder")}
                                        />
                                    </div>
                                )}
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14  rounded-small border shadow-none"
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("postalCode")}
                                    />
                                </div>
                                <div className="mb-2">
                                    <select
                                        className="form-select fs-14  rounded-0 border shadow-none"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleCountryChange}
                                        aria-label="Default select example"
                                        required
                                    >
                                        <option value="" disabled>
                                            {t("countrySelect")}
                                        </option>

                                        {countries.map((country) => (
                                            <option
                                                key={country.code}
                                                value={country.name}
                                            >
                                                {allcounts(country.name)}
                                            </option>
                                        ))}
                                    </select>
                                    {/* <input
                                        type="text"
                                        className="form-control fs-14  rounded-small border shadow-none"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        requiredx
                                        placeholder="Country"
                                    /> */}
                                </div>
                                {/* <div className="d-flex flex-wrap mx-0 align-items-start">
                                    <div className="px-0">
                                        <PhoneInput
                                            international
                                            countryCallingCodeEditable={false}
                                            defaultCountry="US"
                                            value={formData.phoneNumber}
                                            onChange={handlePhoneNumberChange}
                                            className={`form-control fs-14 rounded-small customphoneinput shadow-none d-flex ${
                                                !formData.isValidPhoneNumber
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            style={{ width: "280px" }}
                                            id="phoneNumber"
                                            name="phoneNumber"
                                        />
                                        {!formData.isValidPhoneNumber && (
                                            <div className="invalid-feedback">
                                                Please enter a valid phone
                                                number.
                                            </div>
                                        )}{" "}
                                       
                                    </div>
                                </div> */}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-gray fs-14 rounded-small"
                                data-bs-dismiss="modal"
                                ref={closeBtnRef}
                            >
                                {t("cancel")}
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!isEmpty(formErrors)}
                                className="btn btn-main fw-medium fs-14 rounded-small"
                            >
                                {isValidated ? t("Add") : t("Validate")}
                            </button>
                            {/* {formData?.isVerified ? (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn btn-main fw-medium fs-14"
                                >
                                    Add
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={verifyAnAddress}
                                    className="btn btn-main fw-medium fs-14"
                                >
                                    Verify address
                                </button>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
