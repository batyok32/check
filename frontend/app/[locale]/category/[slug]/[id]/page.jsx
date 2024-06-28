"use client";
import CategoryItem from "@/components/Categories/CategoryItem/CategoryItem";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import ProductsList from "@/parts/Home/ProductsList";
import { fetchNestedCategories } from "@/redux/actions/shopActions";
import { useAppDispatch } from "@/redux/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const { slug, id } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [listOfCategoriesId, setListOfCategoriesId] = useState(null);
    const [categoryChildrens, setCategoryChildrens] = useState(null);
    const [startShowing, setStartShowing] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const t = useTranslations();

    useEffect(() => {
        if (slug && id) {
            dispatch(fetchNestedCategories(id)).then((res) => {
                if (res.data) {
                    setCategoryData(res.data.category);
                    if (res.data.category.childrens.length < 1) {
                        router.push(
                            `/products?category=${res.data.category.id}`
                        );
                    } else {
                        setStartShowing(true);
                    }
                }
            });
        }
    }, [slug, id]);

    function extractIds(category) {
        let ids = [];

        // Add the ID of the current category
        ids.push(category?.id);

        console.log("CATEGORY", category);
        console.log("CATEGORY Childrens", category.childrens);
        // Recursively traverse the childrens array
        category.childrens?.forEach((child) => {
            // Add the ID of the child category
            ids.push(child.id);

            // Recursively traverse the childrens of the child category
            if (child.childrens.length > 0) {
                ids = ids.concat(extractIds(child));
            }
        });

        return ids;
    }

    useEffect(() => {
        if (categoryData) {
            const categoryIds = extractIds(categoryData);
            setListOfCategoriesId(categoryIds);
            setCategoryChildrens(categoryData.childrens);
        }
    }, [categoryData]);

    if (!startShowing) {
        return <LoadingScreen></LoadingScreen>;
    }
    return (
        <div>
            {Array.isArray(categoryChildrens) &&
                categoryChildrens.length >= 1 && (
                    <div className="container-xxl mb-3 pb-1">
                        <div className="bg-white rounded-1  mt-4 py-3 px-3 ">
                            {categoryData ? (
                                <div className="fw-bold text-center fs-4 border-bottom">
                                    {categoryData.name}
                                </div>
                            ) : (
                                <div className="fw-bold">{t("categories")}</div>
                            )}
                            <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 row-gap-2 align-items-stretch mt-3">
                                {categoryChildrens.map((category) => (
                                    <CategoryItem
                                        img={category.image}
                                        title={category?.name}
                                        clickHandler={
                                            () =>
                                                router.push(
                                                    `/category/${category.slug}/${category.id}`
                                                )
                                            // setSelected([...selected, category])
                                        }
                                        key={category?.id}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            <ProductsList
                title={categoryData ? categoryData?.name : t("products")}
                categories={listOfCategoriesId}
            />
        </div>
    );
}
