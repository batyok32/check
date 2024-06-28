import { useAppDispatch } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

function VariationQuantityTablePart({ formData, setFormData }) {
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const [combinationQuantities, setCombinationQuantities] = useState({});
    const [allCombinations, setAllCombinations] = useState([]);

    // function getAllCombinations(variationCategories) {
    //     const combine = (variations, index) => {
    //         if (index === variationCategories.length) {
    //             return [variations];
    //         }
    //         const results = [];
    //         variationCategories[index].variations.forEach((variation) => {
    //             results.push(
    //                 ...combine([...variations, variation.name], index + 1)
    //             );
    //         });
    //         return results;
    //     };
    //     return combine([], 0);
    // }

    // function updateCombinationQuantity(combinationKey, quantity) {
    //     if (parseFloat(quantity) < 0 || isNaN(parseFloat(quantity))) {
    //         return; // Do not update state if value is less than 1
    //     }
    //     const newQuantities = {
    //         ...combinationQuantities,
    //         [combinationKey]: quantity,
    //     };
    //     setCombinationQuantities(newQuantities);

    //     const totalQuantity = Object.values(newQuantities).reduce(
    //         (acc, quantity) => parseInt(acc) + parseInt(quantity),
    //         0
    //     );

    //     setFormData({
    //         ...formData,
    //         combinationQuantities: newQuantities,
    //         quantity: parseInt(totalQuantity),
    //     });
    //     console.log("UPDATED COMBINATION QUANTITIES", newQuantities);
    // }

    // function updateCombinationQuantity(combinationKey, quantity) {
    //     if (parseFloat(quantity) < 0 || isNaN(parseFloat(quantity))) {
    //         return;
    //     }
    //     console.log("UPDATING COMB QUANTITIES");
    //     const existingCombinationIndex =
    //         formData.combinationQuantities.findIndex(
    //             (combination) => combination.name === combinationKey
    //         );
    //     console.log("EXISTING INDEX", existingCombinationIndex);
    //     let newQuantities;
    //     if (existingCombinationIndex !== -1) {
    //         // If the combination exists, update its quantity
    //         newQuantities = formData.combinationQuantities.map(
    //             (combination, index) =>
    //                 index === existingCombinationIndex
    //                     ? { ...combination, quantity: quantity }
    //                     : combination
    //         );
    //     } else {
    //         newQuantities = [
    //             ...formData.combinationQuantities,
    //             {
    //                 name: combinationKey,
    //                 quantity: quantity,
    //             },
    //         ];
    //     }
    //     console.log("NEW QUANTITIES", newQuantities);

    //     setCombinationQuantities(newQuantities);

    //     const totalQuantity = newQuantities.reduce(
    //         (acc, combination) => acc + parseInt(combination.quantity),
    //         0
    //     );

    //     setFormData({
    //         ...formData,
    //         combinationQuantities: newQuantities,
    //         quantity: parseInt(totalQuantity),
    //     });
    // }

    function updateCombinationQuantity(combinationKey, quantity) {
        if (parseFloat(quantity) < 0 || isNaN(parseFloat(quantity))) {
            return;
        }
        const newQuantities = formData.combinationQuantities
            ? [...formData.combinationQuantities]
            : [];
        const existingIndex = newQuantities.findIndex(
            (q) => q.name === combinationKey
        );

        if (existingIndex !== -1) {
            newQuantities[existingIndex].quantity = quantity;
        } else {
            newQuantities.push({ name: combinationKey, quantity });
        }

        // Assuming setFormData is a function to update formData at the parent component level
        setFormData({
            ...formData,
            combinationQuantities: newQuantities,
            quantity: newQuantities.reduce(
                (acc, { quantity }) => acc + Number(quantity),
                0
            ),
        });
    }

    useEffect(() => {
        function getAllCombinations(variationCategories) {
            const combine = (variations, index) => {
                if (index === variationCategories.length) {
                    return [variations];
                }
                const results = [];
                variationCategories[index].variations.forEach((variation) => {
                    results.push(
                        ...combine([...variations, variation.name], index + 1)
                    );
                });
                return results;
            };
            return combine([], 0);
        }

        const combinations = getAllCombinations(
            formData.variationCategories || []
        );
        setAllCombinations(combinations);

        // Initialize quantities for combinations not yet in formData
        combinations.forEach((combination) => {
            const combinationKey = combination.join("-");
            // Using optional chaining to avoid errors if combinationQuantities is null or undefined
            const foundQuantity = formData.combinationQuantities?.find(
                (q) => q.name === combinationKey
            );
            if (!foundQuantity) {
                updateCombinationQuantity(combinationKey, 1);
            }
        });
    }, [formData.variationCategories, formData.combinationQuantities]); // Ensure formData.combinationQuantities is a dependency if it can change

    // useEffect(() => {
    //     setAllCombinations(getAllCombinations(formData.variationCategories));
    // }, [formData.variationCategories]);

    return (
        <>
            <div className="border-bottom my-4"></div>
            <h4 className="mt-4 fw-bold">{t("Listings.quantityTable")}</h4>
            <div className="text-muted fs-14 mb-3">
                {t("Listings.quantityTableDescription")}
            </div>
            <div>
                {allCombinations &&
                    allCombinations.length > 0 &&
                    allCombinations.map((combination, index) => {
                        console.log("COMBINATION", combination);
                        const combinationKey = combination.join("-"); // Create a unique key for the combination
                        console.log("COMBINATION KEY", combinationKey);
                        const foundQuantity =
                            formData.combinationQuantities.find(
                                (q) => q.name === combinationKey
                            );
                        console.log("FOUND QUANTITY", foundQuantity);

                        if (!foundQuantity) {
                            console.log("NOT FOUND QUANTITY", foundQuantity);
                            updateCombinationQuantity(combinationKey, 1);
                        }
                        return (
                            <div
                                key={combinationKey}
                                className="row row-cols-2 border p-2 mb-2 align-items-center rounded-small fs-15"
                            >
                                <div className="col-auto">
                                    {combination.join(" + ")}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        className="form-control border rounded-small shadow-none w-100 fs-15"
                                        value={
                                            (foundQuantity &&
                                                foundQuantity.quantity) ||
                                            1
                                        }
                                        min={0}
                                        onChange={(e) =>
                                            updateCombinationQuantity(
                                                combinationKey,
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}

export default VariationQuantityTablePart;
