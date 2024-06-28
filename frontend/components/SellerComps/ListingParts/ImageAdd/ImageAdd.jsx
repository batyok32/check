"use client";
import { shortenFilename } from "@/components/utils/jsutils";
import { IconPhotoScan, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { toast } from "react-toastify";

export default function ImageAdd({ formData, setFormData }) {
    const defaultImagePhotoSize = 10;
    const t = useTranslations();
    const handleFileChange = (event) => {
        const { id, files } = event.target;

        if (formData.images.length < 10 && files.length > 0) {
            const file = files[0];
            const shortenedFilename = shortenFilename(file.name);

            const newFile = new File([file], shortenedFilename, {
                type: file.type,
            });

            const newImage = {
                file: newFile,
                url: URL.createObjectURL(file),
                isFile: true,
            };

            setFormData({
                ...formData,
                images: [...formData.images, newImage],
            });
        } else {
            toast.warning(t("Listings.noimageallowed"), {
                className: "fs-14",
            });
        }
    };

    const imageAddLabelRef = useRef();

    const deleteImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            images: updatedImages,
        });
    };

    console.log("IMAGES", formData.images);
    // const mainImageUrl = formData.mainImage ? (formData.mainImage.isFile ? formData.mainImage.url : formData.mainImage.file) : null;

    return (
        <>
            {" "}
            <div className="border-bottom my-4"></div>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mt-3 fw-bold">{t("Listings.addaphoto")}</h4>
                    <div className="text-muted fs-14 mb-3">
                        {t("Listings.addphotodescription")}
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
            <div className="mx-md-3 mt-4 border p-3 fs-15 bg-white shadow-sm rounded-small">
                <div>
                    <label
                        className="d-none"
                        htmlFor="images"
                        ref={imageAddLabelRef}
                    ></label>

                    <input
                        type="file"
                        id="images"
                        className="d-none"
                        onChange={(e) => handleFileChange(e)}
                        name="images"
                        accept="image/*"
                        multiple
                    />
                </div>
                <div className="row row-cols-2 row-cols-md-6 row-gap-3 flex-wrap">
                    {Array.from({
                        length: defaultImagePhotoSize - formData.images.length,
                    }).map((_, index) => (
                        <div className="px-1" key={index}>
                            <div
                                key={index}
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
                    ))}

                    {formData.images.map((image, index) => (
                        <div
                            className="px-1 text-center rounded-small position-relative"
                            key={index}
                        >
                            <div
                                className={`rounded-small `}
                                role="button"
                                style={{
                                    backgroundImage: `url(${
                                        image.isFile ? image.url : image.file
                                    })`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    height: "130px",
                                }}
                            ></div>
                            <div
                                role="button"
                                className="position-absolute rounded-small"
                                style={{ top: "10px", right: "20px" }}
                                onClick={() => deleteImage(index)}
                            >
                                <IconTrash className="text-main" />
                            </div>
                            <div className="pt-2">
                                <>
                                    {t("Listings.image")} - {index + 1}
                                </>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
