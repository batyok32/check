import { fetchCategories } from "@/redux/actions/shopActions";
import { retievedCategories } from "@/redux/features/sellerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IconChevronRight, IconStatusChange } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

function CategoryAddPart({ formData, setFormData, selected, setSelected }) {
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const { categories } = useAppSelector((state) => state.seller);
    const [lastInSelected, setLastInSelected] = useState(null);

    useEffect(() => {
        if (selected.length >= 1) {
            setLastInSelected(selected[selected.length - 1]);
        } else {
            setLastInSelected(null);
        }
    }, [selected]);

    useEffect(() => {
        if (lastInSelected && lastInSelected?.total_childrens > 0) {
            let conf = `parent_id=${lastInSelected?.id}`;
            dispatch(fetchCategories(conf)).then((res) => {
                if (res.data) {
                    const translatedCategories = res.data.map((category) => ({
                        ...category,
                        name: t(`CategoriesList.${category.name}`),
                        childrens: category?.childrens?.map((child) => ({
                            ...child,
                            name: t(`CategoriesList.${child.name}`),
                        })),
                    }));
                    dispatch(retievedCategories(translatedCategories));
                }
            });
        } else if (!lastInSelected) {
            dispatch(fetchCategories()).then((res) => {
                if (res.data) {
                    const translatedCategories = res.data.map((category) => ({
                        ...category,
                        name: t(`CategoriesList.${category.name}`),
                        childrens: category?.childrens?.map((child) => ({
                            ...child,
                            name: t(`CategoriesList.${child.name}`),
                        })),
                    }));
                    dispatch(retievedCategories(translatedCategories));
                }
            });
        } else {
            const bigString = selected.map((sel) => sel.name).join(" / ");

            setFormData({
                ...formData,
                category: {
                    selectList: bigString,
                    selected: lastInSelected,
                },
            });
        }
    }, [lastInSelected]);

    const removeAfter = (id) => {
        const index = selected.findIndex((s) => s.id === id);
        setSelected(selected.slice(0, index + 1));
    };

    return (
        <>
            <h4 className="mt-4 fw-bold">{t("Listings.category")}</h4>
            <div className="text-muted fs-14 mb-3">
                {t("Listings.categoryLabel")}
            </div>
            {formData?.category ? (
                <div className="d-flex gap-2 gap-md-5 flex-wrap">
                    <div className="text-muted fs-14  d-inline-flex align-items-center gap-1">
                        {formData.category?.selectList}
                    </div>
                    <div
                        role="button"
                        className="text-muted rounded-small bg-white px-2 py-1 fs-14 border"
                        onClick={() => {
                            setFormData({ ...formData, category: null });
                            setSelected([]);
                            setLastInSelected(null);
                        }}
                    >
                        <IconStatusChange size={20} className="me-1" />
                        {t("Listings.changeCategory")}
                    </div>
                </div>
            ) : (
                <div className="d-flex ">
                    <div className="d-flex flex-column  mx-0  fs-14 row-gap-1 border p-2 rounded-small">
                        {selected.length > 0 && (
                            <div className="fw-medium border-bottom mb-2 pb-2">
                                {selected.map((sel) => (
                                    <span
                                        key={sel.id}
                                        onClick={() => removeAfter(sel.id)}
                                        className="ms-1 underline-on-hover fs-15"
                                        role="button"
                                    >
                                        {sel?.name}{" "}
                                        <IconChevronRight size={16} />
                                    </span>
                                ))}
                            </div>
                        )}
                        {Array.isArray(categories) &&
                            categories.length >= 1 &&
                            categories.map((category) => (
                                // <div>
                                <div
                                    key={category.id}
                                    role="button"
                                    onClick={() => {
                                        setSelected([...selected, category]);
                                    }}
                                    className="underline-on-hover"
                                >
                                    {category.name}
                                </div>
                                // </div>
                            ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default CategoryAddPart;
