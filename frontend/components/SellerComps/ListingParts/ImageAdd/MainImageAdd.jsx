"use client";
import { shortenFilename } from "@/components/utils/jsutils";
import { IconPhotoScan, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { toast } from "react-toastify";

export default function MainImageAdd({ formData, setFormData }) {
    const t = useTranslations();
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file

        // Check if the file is an image
        if (file && file.type.startsWith("image/")) {
            const shortenedFilename = shortenFilename(file.name);

            const newFile = new File([file], shortenedFilename, {
                type: file.type,
            });

            const newImage = {
                file: newFile,
                url: URL.createObjectURL(file),
                isFile: true,
            };
            // console.log("CHANGED IMAGE", newImage);
            // console.log("CHANGED IMAGE isFILE", newImage.file.isFile);
            // console.log("CHANGED IMAGE NAME", newImage.file.name);
            // console.log("CHANGED IMAGE TYPE", newImage.file.type);
            setFormData({
                ...formData,
                mainImage: newImage,
            });
        } else {
            // If the file is not an image, show an error message
            toast.error(t("Listings.selectanimage"), { className: "fs-14" });
        }
    };

    const imageAddLabelRef = useRef();

    const deleteImage = () => {
        setFormData({
            ...formData,
            mainImage: null,
        });
    };
    // const mainImageUrl = formData.mainImage ? (formData.mainImage.isFile ? formData.mainImage.url : formData.mainImage.file) : null;

    return (
        <>
            {" "}
            <div className="border-bottom my-4"></div>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mt-3 fw-bold">
                        {t("Listings.addmainimage")}
                    </h4>
                    <div className="text-muted fs-14 mb-3">
                        {t("Listings.addmainimagedescription")}
                    </div>
                </div>
                <div>
                    <div
                        role="button"
                        className="border bg-white fs-15 px-3 py-2 rounded-small"
                        onClick={() => imageAddLabelRef.current.click()}
                    >
                        <span className="d-none d-md-inline">
                            <IconPhotoScan size={20} className="me-1" />{" "}
                            {t("Listings.addaphoto")}
                        </span>
                        <span className="d-inline d-md-none">
                            {t("AddressEditModal.Add")}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mx-3 mt-4 border p-3 fs-15 bg-white shadow-sm rounded-small">
                <div>
                    <label
                        className="d-none"
                        htmlFor="mainImage"
                        ref={imageAddLabelRef}
                    ></label>

                    <input
                        type="file"
                        id="mainImage"
                        className="d-none"
                        onChange={(e) => handleFileChange(e)}
                        name="mainImage"
                        accept="image/*"
                    />
                </div>
                <div className="row row-cols-md-5 flex-wrap">
                    {!formData.mainImage && (
                        <div className="px-1 mx-auto">
                            <div
                                role="button"
                                onClick={() => imageAddLabelRef.current.click()}
                                className=" rounded-small p-2 text-center"
                            >
                                <img
                                    src="/products/default-image.jpeg"
                                    alt=""
                                    className="img-fluid"
                                />
                                <div className="pt-2">
                                    {t("Listings.mainphoto")}
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.mainImage && (
                        <div className="px-1 text-center rounded-small position-relative">
                            <div
                                className={`rounded-small 
                                       border border-2 border-main
                                `}
                                // onClick={() =>
                                //     setFormData({
                                //         ...formData,
                                //         mainImage: image,
                                //     })
                                // }
                                role="button"
                                style={{
                                    backgroundImage: `url(${
                                        formData.mainImage.isFile
                                            ? formData.mainImage.url
                                            : formData.mainImage.file
                                    })`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    height: "180px",
                                    // width: "100%",
                                    // height: "100%",
                                }}
                            ></div>
                            <div
                                role="button"
                                className="position-absolute rounded-small"
                                style={{ top: "10px", right: "20px" }}
                                onClick={() => deleteImage()}
                            >
                                <IconTrash className="text-main" />
                            </div>
                            <div className="pt-2">
                                {formData?.mainImage?.file?.name}
                                {/* {t("Listings.mainphoto")} */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
