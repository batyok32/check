import axios from "axios";

const ApiManager = axios.create({
    baseURL: process.env.NEXT_PUBLIC_HOST,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": "en",
    },
    // withCredentials: true,
});

export const authConfig = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("TOKEN_KEY")}`,
        Accept: "application/json",
        "Accept-Language": "en",
    },
    // withCredentials: true,
};

export default ApiManager;
