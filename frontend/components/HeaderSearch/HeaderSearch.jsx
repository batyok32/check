"use client";

import { fetchCategories } from "@/redux/actions/shopActions";
import { gotCategories } from "@/redux/features/shopSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function HeaderSearch() {
    const { push } = useRouter();
    const { categories } = useAppSelector((state) => state.shop);
    const [searchCategory, setSearchCategory] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const t = useTranslations("HeaderSearch");

    const dispatch = useAppDispatch();
    // useEffect(() => {
    //     dispatch(fetchCategories()).then((res) => {
    //         const translatedCategories = res.data.map((category) => ({
    //             ...category,
    //             name: t(`CategoriesList.${category.name}`),
    //             childrens: category?.childrens?.map((child) => ({
    //                 ...child,
    //                 name: t(`CategoriesList.${child.name}`),
    //             })),
    //         }));
    //         dispatch(gotCategories(translatedCategories));
    //     });
    // }, []);
    const handleSubmit = () => {
        if (searchValue.trim().length >= 1) {
            if (searchCategory) {
                push(
                    `/products?search=${searchValue.trim()}&category=${
                        searchCategory.id
                    }`
                );
            } else {
                push(`/products?search=${searchValue.trim()}`);
            }
        } else {
            toast.warning(t("writeSomething"), { className: "fs-14" });
        }
    };
    return (
        <div className="input-group flex-grow-1 align-items-center  border border-main rounded-1 py-0">
            <div
                className="btn btn-gray border-0 rounded-1 fs-13 me-0 mb-0 pt-2  align-self-stretch text-center"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {searchCategory ? searchCategory?.name : t("all")}
            </div>
            <ul className="dropdown-menu fs-13 main-drop rounded-small">
                {Array.isArray(categories) &&
                    categories.length > 0 &&
                    categories.map((category) => (
                        <li
                            role="button"
                            key={category.id}
                            onClick={() => setSearchCategory(category)}
                            className="dropdown-item"
                        >
                            {category.name}
                        </li>
                    ))}
            </ul>
            <input
                type="text"
                className="form-control border-0 shadow-none ps-2 py-2 fs-14 user-select-none"
                aria-label="Text input with dropdown button "
                placeholder={t("searchPlaceholder")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                }}
            />
            <div
                role="button"
                onClick={() => handleSubmit()}
                className="btn-main  text-white align-self-stretch d-flex align-items-center px-2 rounded-end-1"
            >
                <div className="btn-custom">
                    <IconSearch />
                </div>
            </div>
        </div>
    );
}

export default HeaderSearch;
