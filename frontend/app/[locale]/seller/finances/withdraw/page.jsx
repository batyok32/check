"use client";
import { loadUserCards } from "@/redux/actions/authActions";
import { requestWithdraw } from "@/redux/actions/sellerActions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Page() {
    const { seller_profile } = useAppSelector((state) => state.auth);
    // Get available balance
    // Get cards
    // Transfer fee
    // Ending balance
    const [chosenCard, setChosenCard] = useState(null);
    const [cards, setCards] = useState([]);

    const t = useTranslations();

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadUserCards()).then((res) => {
            if (res.status > 205) {
                setCards([]);
            } else {
                setCards(res.data);
                setChosenCard(res.data[0]);
                console.log("CARDS", res.data);
            }
        });
    }, []);

    const router = useRouter();
    const handleSubmit = () => {
        if (!chosenCard) {
            return toast.error(t("Listings.Choose_card"), {
                className: "fs-14",
            });
        }
        if (seller_profile.available_balance <= 1) {
            toast.error(t("Listings.tooLowAmount"), {
                className: "fs-14",
            });
            router.push("/seller");
            return;
        }

        const data = {
            amount:
                parseFloat(seller_profile.available_balance) -
                (parseFloat(seller_profile.available_balance) * 2) / 100,
            fee_amount:
                (parseFloat(seller_profile.available_balance) * 2) / 100,
            reference_id: chosenCard?.reference_id,
            bin_number: chosenCard?.bin_number,
            card_brand: chosenCard?.card_brand,
            card_type: chosenCard?.card_type,
            cardholder_name: chosenCard?.cardholder_name,
            last_4: chosenCard?.last_4,
        };
        dispatch(requestWithdraw(data)).then((res) => {
            if (res.status > 205) {
                toast.error(t("Listings.failedTomakeWithdraw"), {
                    className: "fs-14",
                });
            } else {
                toast.success(t("Listings.withdrawRequested"), {
                    className: "fs-14",
                });
                router.push("/seller");
            }
        });
        // withdraw
    };
    return (
        <div>
            <div className="container-xxl">
                <div className="row mx-0 py-5 ">
                    <div className="col-md-6 mx-auto bg-white shadow p-3 px-5">
                        <div className="h6 text-center">
                            {t("Listings.available")}
                        </div>
                        <div className="h3 text-center fw-bold">
                            ${seller_profile.available_balance}
                        </div>
                        <div
                            className="fs-14  main-link text-center mt-3"
                            role="button"
                        >
                            {t("Listings.recieveAmount")} -{" "}
                            <span className="fw-medium">
                                $
                                {parseFloat(seller_profile.available_balance) -
                                    (parseFloat(
                                        seller_profile.available_balance
                                    ) *
                                        2) /
                                        100}
                            </span>
                        </div>
                        <p className="fs-13  mx-auto text-muted text-center mt-3">
                            {t("Listings.recieveAmountDescription")}
                        </p>
                        <div className="d-flex justify-content-between border-top pt-2 pb-2 align-items-center fs-14">
                            <div>{t("Listings.arrives")}:</div>
                            <div>{t("Listings.businessDaysRange")}</div>
                        </div>
                        <div className="d-flex justify-content-between border-top py-2  align-items-center fs-14">
                            <div>{t("Listings.sendingTo")}:</div>
                            {/* Select needed */}
                            <div>
                                <select
                                    class="form-select fs-14 border-0 shadow-none py-0"
                                    aria-label="Default select example"
                                    value={chosenCard}
                                >
                                    {cards.map((card) => (
                                        <option
                                            key={card.id}
                                            onClick={() =>
                                                setChosenCard(card.id)
                                            }
                                            value={card.id}
                                        >
                                            {/* <span
                                                className={`VISA x-small`}
                                            ></span>{" "} */}
                                            <span>xxxx-{card.last_4}</span>
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between border-top py-2  align-items-center fs-14">
                            <div>{t("Listings.availableBalance")}:</div>
                            <div>${seller_profile.available_balance}</div>
                        </div>
                        <div className="d-flex justify-content-between border-top py-2  align-items-center fs-14">
                            <div>{t("Listings.transferAmount")}:</div>
                            <div className="text-main">
                                -$
                                {parseFloat(seller_profile.available_balance) -
                                    (parseFloat(
                                        seller_profile.available_balance
                                    ) *
                                        2) /
                                        100}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between border-top py-2  align-items-center fs-14">
                            <div>{t("Listings.transferFee")}:</div>
                            <div>
                                $
                                {(parseFloat(seller_profile.available_balance) *
                                    2) /
                                    100}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between border-top py-2  align-items-center fs-14">
                            <div>{t("Listings.endingBalance")}:</div>
                            <div>$0.00</div>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <button
                                className="btn btn-main rounded-small fs-14 fw-medium px-4"
                                onClick={() => handleSubmit()}
                            >
                                {t("Listings.Withdraw")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
