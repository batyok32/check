import { convertToLocale, getWindowLocale } from "./shop";

export const parseAndFormatDecimal = (str) => {
    const number = parseFloat(str);
    if (isNaN(number)) {
        return "Invalid input"; // or handle the error as you see fit
    }
    return number.toFixed(2);
};

export function convertToMeters(value, unit) {
    console.log("VALUE TO METERS AND UNIT", value, unit);
    switch (unit) {
        case "cm":
            return value / 100;
        case "m":
            return value;
        case "in":
            return value * 0.0254;
        default:
            return "Unknown unit";
    }
}

export function convertToKilograms(value, unit) {
    console.log("VALUE TO KILOGRAMS AND UNIT", value, unit);
    switch (unit) {
        case "g":
            return value / 1000;
        case "kg":
            return value;
        case "lb":
            return value * 0.453592;
        case "oz":
            return value * 0.0283495;
        default:
            return "Unknown unit";
    }
}

export const convertUppercaseToNormal = (text) => {
    // Split the text by underscores
    let words = text.split("_");

    // Capitalize the first letter of each word and make the rest lowercase
    words = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    // Join the words back together with spaces
    return words.join(" ");
};
export const formatDate = (dateString, t = null) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date; // No need for Math.abs here
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 && now.getDate() === date.getDate()) {
        if (t) {
            return t("Today");
        }
        return "Today";
    } else if (
        diffDays === 0 ||
        (diffDays === 1 && now.getDate() - date.getDate() === 1)
    ) {
        if (t) {
            return t("Yesterday");
        }
        return "Yesterday";
    } else if (diffDays < 7) {
        if (t) {
            return t("daysago", { days: diffDays });
        }
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString(
            convertToLocale(getWindowLocale()),
            options
        );
    }
};

export const shuffleArray = (array) => {
    for (let i = array?.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
