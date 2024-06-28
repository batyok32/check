"use client";

import { retrieveHelpItem } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page({ params }) {
    const { id } = params;
    const dispatch = useAppDispatch();
    const [item, setItem] = useState(null);
    useEffect(() => {
        dispatch(retrieveHelpItem(id)).then((res) => {
            if (res.status > 205) {
                setItem(null);
            } else {
                setItem(res.data);
            }
        });
    }, [id]);
    const processContent = (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        // Get all image elements
        const images = doc.querySelectorAll("img");
        const baseUrl = process.env.NEXT_PUBLIC_HOST; // Your backend URL

        // Update the src attribute of each image
        images.forEach((img) => {
            const src = img.getAttribute("src");
            if (src && !src.startsWith("http")) {
                img.setAttribute("src", `${baseUrl}${src}`);
            }
        });

        // Serialize the document back to HTML
        return doc.body.innerHTML;
    };
    return (
        <div>
            <div className="container-xxl">
                <div className="row mx-0">
                    <div className="col-lg-10 mx-auto">
                        <div className="bg-white shadow-sm rounded-small p-3 mt-3">
                            <Link
                                href={`/help/category/${item?.category?.id}`}
                                className="text-muted fs-14"
                            >
                                {item?.category?.name}
                            </Link>
                            <div className="fs-5 fw-bold">{item?.subject}</div>

                            <div
                                className="content-display"
                                dangerouslySetInnerHTML={{
                                    __html: processContent(item?.content),
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
