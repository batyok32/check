"use client";

import { venderDataParse } from "@/components/VenderRegister/venderDataParse";
import isEmpty from "@/components/utils/isEmpty";
import { validateBusinessRegisterSection5 } from "@/components/utils/validateForm";
import { getMe, submitSellerData } from "@/redux/actions/authActions";
import {
    flushBusinessRegistrationData,
    goBackSection,
} from "@/redux/features/sellerRegisterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IconFile } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const sectionNumber = 3;

export default function Section2() {
    const dispatch = useAppDispatch();
    const goBackFn = () => {
        dispatch(goBackSection());
    };

    const router = useRouter();
    const t = useTranslations("Section5");
    const [isLoading, setIsLoading] = useState(false);

    const sectionData = useAppSelector(
        (state) => state.sellerReg.sections[sectionNumber]
    );
    const sellerData = useAppSelector((state) => state.sellerReg.seller_data);
    const [businessInfo, setBusinessInfo] = useState({
        taxIdFile: null,
        nationalIdFile: null,
        proofOfAddressFile: null,
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        setFormErrors(validateBusinessRegisterSection5(businessInfo));
    }, [businessInfo]);

    useEffect(() => {
        if (sectionData.isCompleted) {
            setBusinessInfo(sectionData.data);
        }
    }, [sectionData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEmpty(formErrors)) {
            const data = venderDataParse(sellerData, businessInfo);
            for (var pair of data.entries()) {
                console.log(pair[0] + " - " + pair[1]);
            }
            // console.log("DATA", JSON.parse(data.get("json_data")));
            setIsLoading(true);
            dispatch(submitSellerData(data)).then((res) => {
                setIsLoading(false);
                if (res?.status === 201 || res?.status === 200) {
                    toast.success(t("submit_success"), {
                        className: "fs-14",
                    });
                    router.push("/business/success");
                } else {
                    // toast.error("Something went wrong", {
                    //     className: "fs-14",
                    // });
                    if (res.data.errors.seller_profile) {
                        const firstKey = Object.keys(
                            res.data.errors.seller_profile
                        )[0]; // Get the first key
                        const firstMessage =
                            res.data.errors.seller_profile[firstKey]; // Get the first message from the array under that key

                        toast.error(`${firstMessage}`, { className: "fs-14" });
                        // console.log(
                        //     "Error in submitting",
                        //     res.data.errors.seller_profile
                        // );
                    } else if (res.data.errors.documents) {
                        // console.log("RESDATAERRORS", res.data.errors.documents);
                        const firstKey = Object.keys(
                            res.data.errors.documents
                        )[0]; // Get the first key
                        const firstMessage =
                            res.data.errors.documents[firstKey]; // Get the first message from the array under that key

                        toast.error(`${firstMessage}`, { className: "fs-14" });
                    }
                }
            });
        }
    };

    const handleFileChange = (event, documentType) => {
        const { id, files } = event.target;
        // console.log("File input changed", event.target);

        if (files.length > 0) {
            const file = files[0];
            setBusinessInfo({
                ...businessInfo,
                [id]: { file: file, document_type: documentType },
            });
        }
        // console.log("BUSINESS INFO", businessInfo);
    };

    if (isLoading) {
        return (
            <div
                className="d-flex bg-gray-50 flex-column justify-content-center align-items-center min-vh-100 min-vw-100 position-absolute top-0 "
                style={{ zIndex: 1000 }}
            >
                <div className="mb-4 text-center">
                    <div className="h3 fw-bold ">
                        {t("uploading_information")}
                    </div>
                    <p className="fs-14 ">{t("thank_you")}</p>
                </div>
                <div
                    class="spinner-border text-main bg-white"
                    style={{ padding: 110 }}
                    role="status"
                ></div>
                <div
                    className="d-flex position-absolute align-items-center"
                    style={{ top: "51%" }}
                >
                    <img
                        src="/logo2.jpg"
                        alt=""
                        style={{ height: 40 }}
                        // fill={true}
                        // className="w-auto"
                    />{" "}
                    <img
                        src="/logo3.jpg"
                        alt=""
                        style={{ marginLeft: "-8px", height: 30 }}
                    />{" "}
                </div>
                <div className="text-muted fs-14 mt-4 text-decoration-underline">
                    {t("something_wrong")}
                </div>
            </div>
        );
    }

    return (
        <div className="row pt-5 mx-0 mb-5 mb-md-0">
            <form onSubmit={handleSubmit} className="col-md-8 mx-auto fs-14 ">
                <div className="bg-lightorange  shadow-sm p-4 rounded-small">
                    <label
                        htmlFor="businessName"
                        className="form-label fw-medium"
                    >
                        {t("meeting_verify_identity")}
                    </label>
                    <p className="text-muted mt-1">{t("team_reaching_out")}</p>
                </div>

                <div className="bg-white shadow-sm p-4 rounded-small mt-3">
                    <div className="mb-4">
                        <label
                            // htmlFor="taxIdFile"
                            className="form-label fw-medium"
                        >
                            {t("upload_tax_id")}
                        </label>
                        <div>
                            <label
                                className="input-group-text fs-14 border rounded-small shadow-none"
                                htmlFor="taxIdFile"
                            >
                                {businessInfo.taxIdFile?.file ? (
                                    businessInfo.taxIdFile?.file?.name
                                ) : (
                                    <>
                                        {t("choose_file")}{" "}
                                        <IconFile
                                            className="text-main ms-1"
                                            size={18}
                                        />
                                    </>
                                )}
                            </label>

                            <input
                                type="file"
                                className="form-control fs-14 rounded-0 border shadow-none d-none"
                                onChange={(e) => handleFileChange(e, "Tax ID")}
                                id="taxIdFile"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            // htmlFor="nationalIdFile"
                            className="form-label fw-medium"
                        >
                            {t("upload_national_id")}
                        </label>
                        <div>
                            <label
                                className="input-group-text fs-14 border rounded-small shadow-none"
                                htmlFor="nationalIdFile"
                            >
                                {businessInfo.nationalIdFile?.file ? (
                                    businessInfo.nationalIdFile?.file?.name
                                ) : (
                                    <>
                                        {t("choose_file")}{" "}
                                        <IconFile
                                            className="text-main ms-1"
                                            size={18}
                                        />
                                    </>
                                )}
                            </label>

                            <input
                                type="file"
                                className="form-control fs-14 rounded-0 border shadow-none d-none"
                                onChange={(e) =>
                                    handleFileChange(e, "National ID")
                                }
                                id="nationalIdFile"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            // htmlFor="proofOfAddressFile"
                            className="form-label fw-medium"
                        >
                            {t("proof_of_address")}
                        </label>
                        <div>
                            <label
                                className="input-group-text fs-14 border rounded-small shadow-none"
                                htmlFor="proofOfAddressFile"
                            >
                                {businessInfo.proofOfAddressFile?.file ? (
                                    businessInfo.proofOfAddressFile?.file?.name
                                ) : (
                                    <>
                                        {t("choose_file")}{" "}
                                        <IconFile
                                            className="text-main ms-1"
                                            size={18}
                                        />
                                    </>
                                )}
                            </label>

                            <input
                                type="file"
                                className="form-control fs-14 rounded-0 border shadow-none d-none"
                                onChange={(e) =>
                                    handleFileChange(
                                        e,
                                        "Proof of business address"
                                    )
                                }
                                id="proofOfAddressFile"
                            />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end  pt-3">
                    <div
                        onClick={goBackFn}
                        className="btn btn-light fs-15 fw-medium rounded-small border me-2 "
                    >
                        {t("previous")}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-main rounded-small fs-15 fw-bold"
                        // disabled={!isFormValid}
                        disabled={!isEmpty(formErrors)}
                    >
                        {t("next")}
                    </button>
                </div>
            </form>
        </div>
    );
}
