"use client";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setRefetchAddress } from "@/redux/features/addressBookSlice";
import { toast } from "react-toastify";
import isEmpty from "../utils/isEmpty";
import countries from "../utils/countries";
import { validateAddressBookForm2 } from "../utils/validateForm";
import { updateAddressInBook } from "@/redux/actions/authPostActions";
import { validateSingleAddress } from "@/redux/actions/shopActions";
import { useTranslations } from "next-intl";
import { usStates } from "../utils/usStates";

export default function AddressEditModal({ children, addressToEdit }) {
    const t = useTranslations("AddressEditModal");
    const allcounts = useTranslations("Countries");
    const closeBtnRef = useRef(null);
    const [formData, setFormData] = useState(addressToEdit);
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
        setIsValidated(false);
    };

    const [isValidated, setIsValidated] = useState(false);

    const verifyAnAddress = () => {
        const formattedData = {
            line_1: formData.address_line1,
            line_2: formData.address_line2,
            state: formData.state,
            city: formData.city,
            postal_code: formData.zip_code,
            country_alpha2: countries.find(
                (country) => country.name === formData.country
            ).code,
            replace_with_validation_result: true,
        };
        dispatch(validateSingleAddress(formattedData)).then((res) => {
            if (res.status > 205) {
                setIsValidated(false);
                toast.error(t("addressValidationFailed"), {
                    className: "fs-14",
                });
            } else {
                setIsValidated(true);
                setFormData({
                    ...formData,
                    address_line1: res.data.address.line_1,
                    address_line2: res.data.address.line_2,
                    state: res.data.address.state,
                    city: res.data.address.city,
                    zip_code: res.data.address.postal_code,
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
        if (isValidated) {
            if (isEmpty(formErrors)) {
                const sentData = {
                    address_line1: formData.address_line1,
                    address_line2: formData.address_line2,
                    city: formData.city,
                    state: formData.state,
                    zip_code: formData.zip_code,
                    country: formData.country,
                };
                dispatch(updateAddressInBook({ id: formData.id, ...sentData }))
                    .then((res) => {
                        toast.success(t("addressUpdated"), {
                            className: "fs-14",
                        });
                        closeBtnRef.current.click();

                        setTimeout(() => {
                            dispatch(setRefetchAddress(Math.random()));
                        }, 500);
                    })
                    .catch((error) => {
                        console.log("ERROR", error);
                        toast.error(t("errorOccurred"), {
                            className: "fs-14",
                        });
                    });
            } else {
                toast.warning(t("formErrors"), { className: "fs-14" });
            }
        }
    };

    useEffect(() => {
        setFormErrors(validateAddressBookForm2(formData));
    }, [formData]);

    useEffect(() => {
        setFormData(addressToEdit);
    }, [addressToEdit]);

    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target={`#addressEditModal`}
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id={`addressEditModal`}
                aria-labelledby={`addressEditModal`}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-small border-0 shadow-sm">
                        <div className="modal-header">
                            <div
                                className="modal-title fs-5 py-0 fw-bold"
                                id="exampleModalLabel"
                            >
                                {t("editAddress")}
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
                                        className="form-control fs-14 rounded-small border shadow-none"
                                        id="address_line1"
                                        name="address_line1"
                                        value={formData?.address_line1}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("addressLine1")}
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14 rounded-small border shadow-none"
                                        id="address_line2"
                                        name="address_line2"
                                        value={formData?.address_line2}
                                        onChange={handleChange}
                                        placeholder={t("addressLine2")}
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14 rounded-small border shadow-none"
                                        id="city"
                                        name="city"
                                        value={formData?.city}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("city")}
                                    />
                                </div>
                                {formData?.countryCode === "US" ? (
                                    <div className="mb-2">
                                        <select
                                            className="form-select fs-14  rounded-0 border shadow-none"
                                            id="state"
                                            name="state"
                                            value={formData?.state}
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
                                            value={formData?.state}
                                            onChange={handleChange}
                                            placeholder={t("state")}
                                        />
                                    </div>
                                )}
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14 rounded-small border shadow-none"
                                        id="zip_code"
                                        name="zip_code"
                                        value={formData?.zip_code}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("zipCode")}
                                    />
                                </div>
                                <div className="mb-2">
                                    <select
                                        className="form-select fs-14 rounded-0 border shadow-none"
                                        id="country"
                                        name="country"
                                        value={formData?.country}
                                        onChange={handleCountryChange}
                                        aria-label="Default select example"
                                        required
                                    >
                                        <option value="" disabled>
                                            {t("selectCountry")}
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
                                </div>
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
                                {isValidated ? t("update") : t("validate")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
