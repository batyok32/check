"use client";
import countries from "@/components/utils/countries";
import isEmpty from "@/components/utils/isEmpty";
import { usStates } from "@/components/utils/usStates";
import { validateSimpleAddressBookForm } from "@/components/utils/validateForm";
import { createAddressInBook } from "@/redux/actions/authPostActions";
import {
    fetchAddressBook,
    validateSingleAddress,
} from "@/redux/actions/shopActions";
import { setRefetchAddress } from "@/redux/features/addressBookSlice";
// import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { IconMap2, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ShipAddress({ formData, setFormData }) {
    const dispatch = useAppDispatch();
    const [shippingAddressBook, setShippingAddressBook] = useState([]);
    const [showAddressAddForm, setShowAddressAddForm] = useState(false);
    const initialStateOfAddress = {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    };
    const [addressAddFormData, setAddressAddFormData] = useState(
        initialStateOfAddress
    );
    const [refetchAddressBookSignal, setRefetchAddressBookSignal] =
        useState(null);

    const fetchData = () => {
        dispatch(fetchAddressBook()).then((res) => {
            if (res?.status === 200) {
                setShippingAddressBook(res.data);
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, [refetchAddressBookSignal]);
    const handleAddressChangeInput = (event) => {
        const { name, value, type, checked } = event.target;
        setAddressAddFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    // const [createAddressInBook] = useCreateAddressInBookMutation();
    const [addressFormErrors, setAddressFormErrors] = useState(null);

    useEffect(() => {
        setAddressFormErrors(validateSimpleAddressBookForm(addressAddFormData));
    }, [addressAddFormData]);

    const [isValidated, setIsValidated] = useState(false);

    const t = useTranslations();
    const verifyAnAddress = () => {
        const formattedData = {
            line_1: addressAddFormData.addressLine1,
            line_2: addressAddFormData.addressLine2,
            state: addressAddFormData.state,
            city: addressAddFormData.city,
            postal_code: addressAddFormData.zip,
            country_alpha2: countries.find(
                (country) => country.name === addressAddFormData.country
            ).code,
            replace_with_validation_result: true,
        };
        dispatch(validateSingleAddress(formattedData)).then((res) => {
            // console.log("RES FROM ADDRESS VALIDATION", res);
            if (res.status > 205) {
                setIsValidated(false);
                toast.error(t("AddressEditModal.errorOccurred"), {
                    className: "fs-14",
                });
            } else {
                setIsValidated(true);
                setAddressAddFormData({
                    ...formData,
                    addressLine1: res.data.address.line_1,
                    addressLine2: res.data.address.line_2,
                    state: res.data.address.state,
                    city: res.data.address.city,
                    zip: res.data.address.postal_code,
                    country: countries.find(
                        (country) =>
                            country.code === res.data.address.country_alpha2
                    ).name,
                });
            }
        });
    };

    const submitAddressFn = (e) => {
        e?.preventDefault();
        if (!isValidated) {
            verifyAnAddress();
        }
        // Handle form submission here (e.g., send data to backend or dispatch action)
        if (isValidated) {
            if (isEmpty(addressFormErrors)) {
                const {
                    addressLine1: address_line1,
                    addressLine2: address_line2,
                    city,
                    state,
                    zip: zip_code,
                    country,
                } = addressAddFormData;
                dispatch(
                    createAddressInBook({
                        address_line1,
                        address_line2,
                        city,
                        state,
                        zip_code,
                        country,
                    })
                )
                    .then((res) => {
                        console.log("RES", res);
                        setFormData({
                            ...formData,
                            shippingAddressId: res.id,
                            country: country,
                        });
                        setAddressAddFormData(initialStateOfAddress);

                        setTimeout(() => {
                            setRefetchAddressBookSignal(Math.random());
                            setRefetchAddress(Math.random());
                        }, 500);
                    })
                    .catch((error) => {
                        console.log("ERROR", error);
                    });
            }
        }
    };

    const checkAddressBookExistence = () => {
        if (!formData.shippingAddressId && shippingAddressBook.length > 0) {
            setFormData({
                ...formData,
                shippingAddressId: shippingAddressBook[0].id,
                country: shippingAddressBook[0].country,
            });
        }
    };

    useEffect(() => {
        checkAddressBookExistence();
    }, [shippingAddressBook, formData.shippingAddressId]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mt-3 fw-bold">
                        {t("OrderDetailPage.Shippingaddress")}
                    </h4>
                    <div className="text-muted fs-14 mb-3">
                        {t("Listings.shipaddressdescription")}
                    </div>
                </div>
                <div>
                    <div
                        role="button"
                        className="border bg-white fs-15 px-3 py-2 rounded-small"
                        onClick={() =>
                            setShowAddressAddForm(!showAddressAddForm)
                        }
                    >
                        <span className="d-none d-md-inline">
                            <IconMap2 size={20} className="me-1" />
                            {t("AddressEditModal.addAddress")}
                        </span>
                        <span className="d-inline d-md-none">
                            {t("AddressEditModal.Add")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="d-flex fs-14 mt-3 gap-2 flex-wrap">
                {shippingAddressBook &&
                    shippingAddressBook.length > 0 &&
                    shippingAddressBook.map((address) => (
                        <div
                            className={`border border-2 p-3 rounded-small ${
                                formData?.shippingAddressId === address.id
                                    ? "border-main"
                                    : ""
                            }`}
                            key={address.id}
                            role="button"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    shippingAddressId: address.id,
                                })
                            }
                        >
                            <div>{address.address_line1}</div>
                            <div>{address.address_line2}</div>
                            <div>
                                {address.city}, {address.state}
                            </div>
                            <div>
                                {t(`Countries.${address.country}`)},{" "}
                                {address.zip_code}
                            </div>
                        </div>
                    ))}
            </div>
            {showAddressAddForm && (
                <div>
                    <hr />
                    <div className="mb-3 p-md-3">
                        <label
                            htmlFor="addressLine1"
                            className="form-label fw-medium mb-3"
                        >
                            {t("Listings.newaddress")}
                        </label>
                        <div className="row row-cols-md-2 ">
                            {/* Country Select */}
                            <select
                                className="form-select fs-14  rounded-0 border shadow-none"
                                id="country"
                                name="country"
                                value={addressAddFormData.country}
                                onChange={handleAddressChangeInput}
                                aria-label="Default select example"
                                required
                            >
                                <option value="" disabled>
                                    {t("AddressEditModal.selectCountry")}
                                </option>

                                {countries.map((country) => (
                                    <option
                                        key={country.code}
                                        value={country.name}
                                    >
                                        {t(`Countries.${country.name}`)}
                                    </option>
                                ))}
                            </select>
                            {/* Address Line 1 */}
                            <input
                                type="text"
                                className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                                id="addressLine1"
                                name="addressLine1"
                                value={addressAddFormData.addressLine1}
                                onChange={handleAddressChangeInput}
                                placeholder={t("Section1.addressLine1")}
                            />
                            {/* Address Line 2 */}
                            <input
                                type="text"
                                className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                                id="addressLine2"
                                name="addressLine2"
                                value={addressAddFormData.addressLine2}
                                onChange={handleAddressChangeInput}
                                placeholder={t("Section1.addressLine2")}
                            />
                            {/* City */}
                            <input
                                type="text"
                                className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                                id="city"
                                name="city"
                                value={addressAddFormData.city}
                                onChange={handleAddressChangeInput}
                                placeholder={t("Section1.cityTown")}
                            />

                            {/* ZIP Code */}
                            <input
                                type="text"
                                className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                                id="zip"
                                name="zip"
                                value={addressAddFormData.zip}
                                onChange={handleAddressChangeInput}
                                placeholder={t("Section1.zipPostalCode")}
                            />

                            {addressAddFormData.country ===
                            countries.find((country) => country.code === "US")
                                .name ? (
                                <select
                                    className="form-select fs-14 mt-2 rounded-0 border shadow-none "
                                    id="state"
                                    name="state"
                                    value={addressAddFormData.state}
                                    onChange={(e) => {
                                        setAddressAddFormData({
                                            ...addressAddFormData,
                                            state: e.target.value,
                                        });
                                    }}
                                    aria-label="Default select example"
                                    required
                                >
                                    <option value="" disabled>
                                        {t("AddressEditModal.stateSelect")}
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
                            ) : (
                                <input
                                    type="text"
                                    className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                                    id="state"
                                    name="state"
                                    value={addressAddFormData.state}
                                    onChange={handleAddressChangeInput}
                                    placeholder={t("AddressEditModal.state")}
                                />
                            )}

                            {/* State/Region */}
                            {/* <input
                                type="text"
                                className="form-control fs-14 mt-2 rounded-0 border shadow-none"
                                id="state"
                                name="state"
                                value={addressAddFormData.state}
                                onChange={handleAddressChangeInput}
                                placeholder="State / Region"
                            /> */}
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            className="btn btn-lightgray fs-14 fw-medium rounded-small"
                            onClick={() => setShowAddressAddForm(false)}
                        >
                            {t("AddressEditModal.cancel")}
                        </button>
                        <button
                            className="btn btn-main fs-14 fw-medium rounded-small"
                            onClick={(e) => submitAddressFn(e)}
                            disabled={!isEmpty(addressFormErrors)}
                        >
                            {isValidated
                                ? t("Listings.create")
                                : t("Listings.validate")}
                        </button>
                    </div>
                    <hr />
                </div>
            )}
        </>
    );
}
