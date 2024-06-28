export const capitalize = (str) => {
    if (!str) return ""; // Return an empty string if str is not provided
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const shortenFilename = (filename, maxLength = 10) => {
    if (filename.length <= maxLength) {
        return filename.replace(/[^a-zA-Z0-9.]/g, "_");
    }

    const extension = filename.split(".").pop();
    const baseLength = maxLength - extension.length - 1; // Subtract 1 for the dot separator
    const shortenedBase = filename
        .substring(0, baseLength)
        .replace(/[^a-zA-Z0-9]/g, "_");
    return `${shortenedBase}.${extension}`;
};

export const dateGlobalOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
};
export const formatSeconds = (seconds) => {
    // const wholeSeconds = Math.floor(seconds);
    // const minutes = Math.floor(wholeSeconds / 60);
    // const remainingSeconds = wholeSeconds % 60;
    // return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

    const secNum = parseInt(seconds, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let remainingSeconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    let time;
    // only mm:ss
    if (hours === "00") {
        time = minutes + ":" + remainingSeconds;
    } else {
        time = hours + ":" + minutes + ":" + remainingSeconds;
    }
    return time;
};

export const readFileAsBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
