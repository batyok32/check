import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import countries from "../utils/countries";
import { useAppDispatch } from "@/redux/hooks";
import { validateSingleAddress } from "@/redux/actions/shopActions";
import { usStates } from "../utils/usStates";
import { validateAddressBookForm } from "../utils/validateForm";
import isEmpty from "../utils/isEmpty";
import { saveCardRequest } from "@/redux/actions/authActions";
import { useTranslations } from "next-intl";
var globalCard = null;
var globalPayment = null;

export default function SaveCardModal({
    children,
    loadedPage,
    setRefetchCardsTrigger,
}) {
    const closeBtnRef = useRef(null);
    const submitBtnRef = useRef(null);
    const t = useTranslations();
    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        countryCode: "",
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

    const [isValidated, setIsValidated] = useState(false);

    const verifyAnAddress = () => {
        if (isEmpty(formErrors)) {
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
                    toast.error("Something wrong with address validation", {
                        className: "fs-14",
                    });
                } else {
                    setIsValidated(true);
                    setFormData({
                        ...formData,
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
        } else {
            toast.error("Fill all fields", { className: "fs-14" });
        }
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

    useEffect(() => {
        setFormErrors(validateAddressBookForm(formData));
    }, [formData]);

    const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_TOKEN;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

    async function initializeCard(payments) {
        const cardStyle = {
            // '.input-container': {
            //   borderColor: '#FF6A00',
            //   borderRadius: '6px',
            // },
            ".input-container.is-focus": {
                borderColor: "#FF6A00",
            },
            // '.input-container.is-error': {
            //   borderColor: '#ff1600',
            // },
            // '.message-text': {
            //   color: '#999999',
            // },
            // '.message-icon': {
            //   color: '#999999',
            // },
            // '.message-text.is-error': {
            //   color: '#ff1600',
            // },
            // '.message-icon.is-error': {
            //   color: '#ff1600',
            // },
            // input: {
            //   backgroundColor: '#2D2D2D',
            //   color: '#FFFFFF',
            //   fontFamily: 'helvetica neue, sans-serif',
            // },
            // 'input::placeholder': {
            //   color: '#999999',
            // },
            // 'input.is-error': {
            //   color: '#ff1600',
            // },
            // '@media screen and (max-width: 600px)': {
            //    'input': {
            //       'fontSize': '12px',
            //    }
            // }
        };
        const card = await payments.card({
            style: cardStyle,
        });
        await card.attach("#card-container");
        console.log("CARD", card);
        return card;
    }

    async function tokenize(paymentMethod) {
        const tokenResult = await paymentMethod.tokenize();
        if (tokenResult.status === "OK") {
            console.log("OK", tokenResult);
            return tokenResult.token;
        } else {
            let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
            if (tokenResult.errors) {
                errorMessage += ` and errors: ${JSON.stringify(
                    tokenResult.errors
                )}`;
            }
            console.log("ERROR brat", errorMessage);

            throw new Error(errorMessage);
        }
    }

    async function verifyBuyer(payments, token) {
        const verificationDetails = {
            amount: "1.00",
            billingContact: {
                givenName: formData.firstName,
                familyName: formData.lastName,
                email: formData.email,
                phone: "3214563987",
                addressLines: [formData.addressLine1],
                city: formData.city,
                state: formData.state,
                countryCode: formData.countryCode,
            },
            currencyCode: "USD",
            intent: "CHARGE",
        };
        console.log("DETAILS", verificationDetails);
        const verificationResults = await payments.verifyBuyer(
            token,
            verificationDetails
        );
        console.log("VERIFICATIOON RESULTS", verificationResults);
        return verificationResults.token;
    }

    const getSendData = (token) => {
        return {
            card_data: {
                source_id: token,
                cardholder_name: formData.firstName + " " + formData.lastName,
                address_line_1: formData.addressLine1,
                address_line_2: formData.addressLine2,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postalCode,
                country: formData.countryCode,
            },
        };
    };

    async function handleSubmitCardAdd(e, card, payments) {
        if (!card) {
            toast.error(t("nocard"), { className: "fs-14" });
            return;
        }
        if (!isEmpty(formErrors)) {
            toast.error(t("nobillingdetails"), { className: "fs-14" });
            return;
        }
        // console.log("SQUARE CARD", squareCard);
        try {
            console.log("CAME TO TOKENIZE", card);
            const token = await tokenize(card);
            console.log("TOKEN IS CREATED", token);

            console.log("IF EVERYTHING EXIST", payments, token);
            // const verificationToken = await verifyBuyer(payments, token);
            // console.log("Verification token is created", verificationToken);
            // const paymentResults = await createPayment(
            //     token,
            //     verificationToken
            // );
            const sendData = getSendData(token);
            dispatch(saveCardRequest(sendData)).then((res) => {
                if (res.status > 205) {
                    console.log("RES ERROR", res.data.details);
                    toast.error(
                        res?.data?.details?.[0].detail
                            ? res.data.details[0].detail
                            : t("savecarderror"),
                        {
                            className: "fs-14",
                        }
                    );
                    return;
                } else {
                    toast.success(t("cardisadded"), {
                        className: "fs-14",
                    });
                    setRefetchCardsTrigger(Math.random());
                    closeBtnRef.current.click();
                    return;
                }
            });

            console.log("PAYMENT IS CREATED", paymentResults);
            // displayPaymentResults("SUCCESS");
            console.log("RESULTS ARE DISPLAYED");
            console.debug("Payment Success", paymentResults);
            return;
        } catch (e) {
            // toast.error("Card wont be added", { className: "fs-14" });
            return;
        }
    }
    const [squareCard, setSquareCard] = useState(null);
    const [squarePayment, setSquarePayment] = useState(null);

    const initializeSquare = async () => {
        if (!window.Square) {
            console.log("NO SOME WINDOW SQUARE");
            throw new Error("Square.js failed to load properly");
        }

        console.log("EXIST WINDOW SQUARE");
        let payments;
        try {
            payments = window.Square.payments(appId, locationId);
            console.log("PAYMENTS DIYYAAR", payments);
        } catch {
            console.log("AAPPP IDD", appId, locationId);
            toast.error(t("paymentinitializationfailed"), {
                className: "fs-14",
            });
            // console.log("STATUS CONTAINER", statusContainer);
            return;
        }

        let card;

        try {
            card = await initializeCard(payments);
        } catch (e) {
            console.error("Initializing Card failed", e);
            return;
        }

        globalCard = card;
        globalPayment = payments;
        // setSquareCard(card);
        // setSquarePayment(payments);
        console.log("SETTED SWUARE");
        // const cardButton = document.getElementById("card-button");
        // console.log("CARD BUTTON", cardButton);
        // cardButton.addEventListener("click", async function (event) {
        //     handleSubmitCardAdd(event, card, payments);
        // });

        // const wrappers = document.getElementsByClassName("sq-card-wrapper");
        // if (wrappers.length > 1) {
        //     wrappers[wrappers.length - 1].innerHTML = "";
        //     return;
        // }
        const wrappers = document.getElementsByClassName("sq-card-wrapper");
        if (wrappers.length > 1) {
            for (let i = 0; i < wrappers.length - 1; i++) {
                wrappers[i].remove();
            }
        }
    };

    useEffect(() => {
        if (loadedPage) {
            initializeSquare();
        }
    }, [loadedPage]);

    return (
        <>
            <div
                data-bs-toggle="modal"
                data-bs-target={`#cardAddModal`}
                role="button"
            >
                {children}
            </div>
            <div
                className="modal fade fs-14 text-black"
                id={`cardAddModal`}
                aria-labelledby={`cardAddModal`}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-small border-0 shadow-sm">
                        <div className="modal-header ">
                            <div
                                className="modal-title fs-5 py-0 fw-bold"
                                id="exampleModalLabel"
                            >
                                {t("addcard")}
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="fs-6 fw-bold mb-3">
                                {t("carddetails")}
                            </div>

                            <form id="payment-form">
                                <div id="card-container"></div>
                                <button
                                    className="d-none"
                                    ref={submitBtnRef}
                                    id="card-button"
                                    type="button"
                                    onClick={(event) =>
                                        // handleSubmitCardAdd(
                                        //     event,
                                        //     squareCard,
                                        //     squarePayment
                                        // )
                                        handleSubmitCardAdd(
                                            event,
                                            globalCard,
                                            globalPayment
                                        )
                                    }
                                ></button>
                            </form>
                            <div id="payment-status-container"></div>

                            <div className="fs-6 fw-bold mb-3 mt-3">
                                {t("billingdetails")}
                            </div>
                            <div>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14  rounded-small border shadow-none"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("ProfilePage.firstName")}
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14  rounded-small border shadow-none"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("ProfilePage.lastName")}
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="email"
                                        className="form-control fs-14  rounded-small border shadow-none"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("ProfilePage.email")}
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control fs-14  rounded-small border shadow-none"
                                        id="addressLine1"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        required
                                        placeholder={t(
                                            "AddressEditModal.AddressLine1"
                                        )}
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
                                        placeholder={t(
                                            "AddressEditModal.AddressLine2"
                                        )}
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
                                        placeholder={t("AddressEditModal.city")}
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
                                                {t(
                                                    "AddressEditModal.stateSelect"
                                                )}
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
                                            placeholder={t(
                                                "AddressEditModal.statePlaceholder"
                                            )}
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
                                        placeholder={t(
                                            "AddressEditModal.postalCode"
                                        )}
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
                                            {t(
                                                "AddressEditModal.selectCountry"
                                            )}
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
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-gray fs-14 rounded-small"
                                data-bs-dismiss="modal"
                                ref={closeBtnRef}
                            >
                                {t("AddressEditModal.cancel")}
                            </button>

                            <button
                                type="submit"
                                onClick={() => {
                                    submitBtnRef.current.click();
                                    // if (!isValidated) {
                                    //     verifyAnAddress();
                                    // } else {
                                    //     submitBtnRef.current.click();
                                    // }
                                }}
                                className="btn btn-main fw-medium fs-14 rounded-small"
                            >
                                {t("AddressEditModal.Add")}
                                {/* {isValidated ? "Add" : "Validate"} */}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
// {
//     "card": {
//       "id": "ccof:uIbfJXhXETSP197M3GB",
//       "billing_address": {
//         "address_line_1": "500 Electric Ave",
//         "address_line_2": "Suite 600",
//         "locality": "New York",
//         "administrative_district_level_1": "NY",
//         "postal_code": "10003",
//         "country": "US"
//       },
//       "bin": "411111",
//       "card_brand": "VISA",
//       "card_type": "CREDIT",
//       "cardholder_name": "Amelia Earhart",
//       "customer_id": "Q6VKKKGW8GWQNEYMDRMV01QMK8",
//       "enabled": true,
//       "exp_month": 11,
//       "exp_year": 2024,
//       "last_4": "1111",
//       "prepaid_type": "NOT_PREPAID",
//       "reference_id": "user-id-1",
//       "version": 1
//     }
//   }
