// PasswordValidator.js
import React, { useEffect } from "react";
import validator from "validator";
import zxcvbn from "zxcvbn";
import { useTranslations } from "next-intl";

const commonPasswords = [
    // Add a list of common passwords
    "123456",
    "password",
    "123456789",
    "12345678",
    "12345",
    "1234567",
    "1234567890",
    "qwerty",
    "abc123",
];

const PasswordValidator = ({
    password,
    rePassword,
    firstName,
    lastName,
    email,
    setErrors,
}) => {
    const t = useTranslations("PasswordValidator");

    useEffect(() => {
        const validatePassword = (password) => {
            const errors = [];
            const minLength = 8;
            const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W])/;

            if (password.length < minLength) {
                errors.push(t("minLength", { minLength }));
            }

            if (commonPasswords.includes(password)) {
                errors.push(t("commonPassword"));
            }

            if (validator.isNumeric(password)) {
                errors.push(t("numericPassword"));
            }

            // if (!regex.test(password)) {
            //     errors.push(t("regexPassword"));
            // }

            if (
                firstName &&
                password.toLowerCase().includes(firstName.toLowerCase())
            ) {
                errors.push(t("similarFirstName"));
            }

            if (
                lastName &&
                password.toLowerCase().includes(lastName.toLowerCase())
            ) {
                errors.push(t("similarLastName"));
            }

            if (email) {
                const emailParts = email.split("@");
                if (
                    emailParts.length > 0 &&
                    password.toLowerCase().includes(emailParts[0].toLowerCase())
                ) {
                    errors.push(t("similarEmail"));
                }
            }

            const passwordStrength = zxcvbn(password);
            if (passwordStrength.score < 3) {
                errors.push(t("weakPassword"));
            }

            if (password !== rePassword) {
                errors.push(t("passwordsDoNotMatch"));
            }

            return errors;
        };

        const validationErrors = validatePassword(password);
        setErrors(validationErrors);
    }, [password, firstName, lastName, email, setErrors, t, rePassword]);

    return null;
};

export default PasswordValidator;
