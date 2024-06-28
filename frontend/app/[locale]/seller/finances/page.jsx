"use client";
import { IconReceipt2, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import "./styles.css";
import { useEffect, useState } from "react";
import { fetchSellerFinances } from "@/redux/actions/sellerActions";
import { useAppDispatch } from "@/redux/hooks";
import { capitalize } from "@/components/utils/jsutils";
import { useTranslations } from "next-intl";
import { deleteUserCard } from "@/redux/actions/authActions";
import { toast } from "react-toastify";

export default function Finances() {
    const dispatch = useAppDispatch();

    const [totalSelling, setTotalSelling] = useState(0);
    const [availableFunds, setAvailableFunds] = useState(0);
    const [onHoldFunds, setOnHoldFunds] = useState(0);
    const [creditCards, setCreditCards] = useState([{}]);

    const [refetchSignal, setRefetchSignal] = useState(null);

    const totalFunds = onHoldFunds + availableFunds;

    useEffect(() => {
        dispatch(fetchSellerFinances()).then((res) => {
            setTotalSelling(res.data.total_selling);
            setAvailableFunds(res.data.available_balance);
            setOnHoldFunds(res.data.on_hold_balance);
            setCreditCards(res.data.cards);
        });
    }, [refetchSignal]);

    const t = useTranslations();

    return (
        <div className="mb-5">
            <div className="border-start py-2 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                <h5 className="m-0 fw-bold">
                    {t("SellerMobileBottom.Finances")}
                </h5>
                <Link className="" href="/seller/finances/withdraw">
                    <button className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                        <IconReceipt2 className="me-1" />{" "}
                        {t("Listings.Withdraw")}
                    </button>
                </Link>
            </div>

            <div class="row row-cols-md-3 mt-3 fs-15 px-4 mx-0">
                <div className="mb-2 text-center">
                    <div className="h-100 bg-white shadow-sm p-3">
                        <div className=" fs-4 fw-bold text-balck mb-3">
                            ${totalSelling}
                        </div>
                        <div className="fw-bold mb-1">
                            {t("Listings.totalSelling")}
                        </div>
                        <p>{t("Listings.90days")}</p>
                    </div>
                </div>
                <div className="mb-2 text-center">
                    <div className="h-100 bg-white shadow-sm p-3">
                        <div className="text-center fs-4 fw-bold text-center bg-main text-white rounded-small mb-3">
                            ${totalFunds}
                        </div>
                        <div className="fw-bold mb-1">
                            {t("Listings.totalFunds")}
                        </div>
                        <p>{t("Listings.totalFundsDescription")}</p>
                    </div>
                </div>
                <div className="mb-2 text-center">
                    <div className="h-100 bg-white shadow-sm p-3">
                        <div className="text-center fs-4 fw-bold text-black mb-3">
                            ${availableFunds}
                        </div>
                        <div className="fw-bold mb-1">
                            {t("Listings.availableFunds")}
                        </div>
                        <p>{t("Listings.availableFundsDescription")}</p>
                    </div>
                </div>
                <div className="mb-2 text-center">
                    <div className="h-100 bg-white shadow-sm p-3">
                        <div className="text-center fs-4 fw-bold text-black mb-3">
                            ${onHoldFunds}
                        </div>
                        <div className="fw-bold mb-1">
                            {t("Listings.on_hold")}
                        </div>
                        <p>{t("Listings.on_hold_description")}</p>
                    </div>
                </div>
                <div className="mb-2 text-center">
                    <div className="h-100 bg-white shadow-sm p-3">
                        <div className="fw-bold mb-1">
                            {t("Listings.watchAllMovings")}
                        </div>
                        <p>{t("Listings.watchAllMovingsDescription")}</p>
                        <Link href="/seller/finances/transactions">
                            <button className="btn btn-main rounded-small fs-14 fw-bold px-3">
                                {t("Listings.seeAllActivity")}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="px-4">
                <h6 className="mt-4">{t("Listings.paymentOptions")}</h6>
                <div className="row row-cols-md-3 fs-15 mt-3">
                    {creditCards?.map((card) => (
                        <div key={card.id} className="mb-2  ">
                            <div className="bg-white  p-3 shadow-sm">
                                <div className="d-flex justify-content-between border-bottom pb-2">
                                    <div>
                                        <div className="fw-bold">
                                            {card.card_brand}{" "}
                                            {capitalize(card.card_type)}{" "}
                                            {t("Listings.endingIn")}{" "}
                                            {card.last_4}
                                        </div>
                                        <div className="text-muted">
                                            {card.cardholder_name}
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className={`${card.card_brand} medium`}
                                        ></span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end align-items-center  pt-2">
                                    {/* <div
                                        role="button"
                                        className="border bg-white fs-14 px-3 text-main py-1 rounded-small"
                                    >
                                        Manage
                                    </div>
                                    <div
                                        role="button"
                                        className="border bg-white fs-14 px-3 text-main py-1 rounded-small"
                                    >
                                        Edit
                                    </div> */}
                                    <div
                                        role="button"
                                        onClick={() => {
                                            dispatch(
                                                deleteUserCard(card.id)
                                            ).then((res) => {
                                                if (res.status > 205) {
                                                    toast.error(
                                                        "Card is not deleted",
                                                        { className: "fs-14" }
                                                    );
                                                } else {
                                                    toast.success(
                                                        "Card is deleted",
                                                        { className: "fs-14" }
                                                    );
                                                    setRefetchSignal(
                                                        Math.random()
                                                    );
                                                }
                                            });
                                        }}
                                        className="border bg-white fs-14 px-3 text-main py-1 rounded-small"
                                    >
                                        {t("Listings.delete")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
