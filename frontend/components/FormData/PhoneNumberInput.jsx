import React, { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function PhoneNumberInput({
    phoneNumber,
    setPhoneNumber,
    isPhoneValid,
    setIsPhoneValid,
}) {
    const [isCheckingPhoneNumber, setCheckingPhoneNumber] = useState(false);

    const handlePhoneNumberChange = (value) => {
        console.log("PHONE NUMBR CHANGED", value);
        console.log("PHONE NUMBR FN", phoneNumber);
        setPhoneNumber(value);
        setIsPhoneValid(false);
    };

    const checkIsValidPhoneNumber = (number) => {
        try {
            const isValid = isValidPhoneNumber(number);
            setIsPhoneValid(isValid);
        } catch {
            setIsPhoneValid(false);
        }
    };

    useEffect(() => {
        setIsPhoneValid(checkIsValidPhoneNumber(phoneNumber));
    }, [phoneNumber]);

    return (
        <div className="d-flex flex-wrap mx-0 align-items-start">
            <div className="px-0">
                <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="US"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className={`form-control fs-14 rounded-small customphoneinput shadow-none d-flex ${
                        !isPhoneValid ? "is-invalid" : ""
                    }`}
                    style={{ width: "280px" }}
                    id="phoneNumber"
                    name="phoneNumber"
                />
                {!isPhoneValid && (
                    <div className="invalid-feedback">
                        Please enter a valid phone number.
                    </div>
                )}{" "}
                {isCheckingPhoneNumber && (
                    <div className="invalid-feedback">
                        Checking uniqueness...
                    </div>
                )}
            </div>
        </div>
    );
}
