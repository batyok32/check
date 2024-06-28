"use client";
import CategoryItem from "@/components/Categories/CategoryItem/CategoryItem";
import ProductsList from "@/parts/Home/ProductsList";
import { fetchCategories } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function CategoryPage() {
    // const searchParams = useSearchParams()
    // const categoryId = searchParams.get("id")
    const [selected, setSelected] = useState([]);
    const [categories, setCategories] = useState([]);
    const [lastInSelected, setLastInSelected] = useState(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const t = useTranslations();
    const catlist = useTranslations("CategoriesList");

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
                        name: catlist(category.name),
                        childrens: category?.childrens?.map((child) => ({
                            ...child,
                            name: catlist(child.name),
                        })),
                    }));
                    setCategories(translatedCategories);
                }
            });
        } else if (!lastInSelected) {
            dispatch(fetchCategories()).then((res) => {
                if (res.data) {
                    const translatedCategories = res.data.map((category) => ({
                        ...category,
                        name: catlist(category.name),
                        childrens: category?.childrens?.map((child) => ({
                            ...child,
                            name: catlist(child.name),
                        })),
                    }));
                    setCategories(translatedCategories);
                }
            });
        } else {
            const bigString = selected.map((sel) => sel.name).join(" / ");
            console.log("Thats end", bigString);
            router.push("/products");
            // dispatch(
            //     setChosenCategory({
            //         selectList: bigString,
            //         selected: lastInSelected,
            //     })
            // );
        }
    }, [lastInSelected]);

    const removeAfter = (id) => {
        const index = selected.findIndex((s) => s.id === id);
        setSelected(selected.slice(0, index + 1));
    };

    const removeLast = () => {
        setSelected(selected.slice(0, -1));
    };
    return (
        <div>
            <div className="container-xxl mb-3 pb-1">
                <div className="bg-white rounded-1  mt-4 py-3 px-3 ">
                    <div className="fw-bold">{t("categories")}</div>
                    {selected.map((sel) => (
                        <span
                            key={sel.id}
                            onClick={() => removeAfter(sel.id)}
                            className="ms-1 underline-on-hover"
                            role="button"
                            style={{ fontSize: "16px" }}
                        >
                            {sel?.name} <IconChevronRight size={16} />
                        </span>
                    ))}
                    <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 row-gap-2 align-items-stretch mt-3">
                        {Array.isArray(categories) &&
                            categories.length >= 1 &&
                            categories.map((category) => (
                                <CategoryItem
                                    img={category.image}
                                    title={category?.name}
                                    clickHandler={() =>
                                        router.push(
                                            `/products?category=${category.id}`
                                        )
                                    }
                                    key={category?.id}
                                />
                            ))}
                    </div>
                </div>
            </div>
            {/* <ProductsList /> */}
        </div>
    );
}

export default CategoryPage;
