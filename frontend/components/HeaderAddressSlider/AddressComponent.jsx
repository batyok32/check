"use client";

import { IconMapPin, IconPlus, IconTrashX } from "@tabler/icons-react";
import HeaderAddressSlider from "./HeaderAddressSlider";
// import AddressAddModal from "../Addresses/AddressAddModal";
import { SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef } from "react";
import {
    removeAddress,
    setChosenAddress,
    setRefetchAddress,
} from "@/redux/features/addressBookSlice";
import { useRouter } from "next/navigation";
import { deleteAddressFromBook } from "@/redux/actions/authPostActions";
import { useTranslations } from "next-intl";

const mapState = (state) => ({
    addressList: state.addressBook.addressList,
    chosenAddress: state.addressBook.chosenAddress,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
});

export default function AddressComponent({ color = "main" }) {
    const { addressList, chosenAddress, isAuthenticated } =
        useAppSelector(mapState);
    const openModalRef = useRef();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const t = useTranslations("AddressComponent");
    const countrtrans = useTranslations("Countries");

    const deleteAddress = (addressId) => {
        dispatch(deleteAddressFromBook(addressId)).then((res) => {
            dispatch(setRefetchAddress(Math.random()));
            // checkAddressBookExistence();
        });
    };

    useEffect(() => {
        if (addressList.length === 0) {
            dispatch(setChosenAddress(null));
            console.log("Chosen adress", chosenAddress);
        }
    }, [addressList]);

    return (
        <>
            <div className="dropdown ms-auto ms-sm-0 user-select-none">
                <div
                    data-bs-toggle="dropdown"
                    role="button"
                    aria-expanded="false"
                    data-bs-auto-close="false"
                    className="truncate-overflow-1"
                >
                    <IconMapPin height={20} />{" "}
                    {chosenAddress ? (
                        <>
                            <span className="fw-medium">
                                {t("deliverTo")} •
                                {/*  {chosenAddress.firstName} • */}
                            </span>{" "}
                            <span className={`fw-bold text-${color}`}>
                                {countrtrans(chosenAddress.country)},{" "}
                                {chosenAddress.city} {chosenAddress.zip_code}
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="fw-medium">{t("address")} •</span>{" "}
                            <span className={`fw-bold text-${color}`}>
                                {t("enterYourDeliveryAddress")}
                            </span>
                        </>
                    )}
                </div>
                <div>
                    <ul
                        className="main-drop dropdown-menu fs-13 rounded-1"
                        style={{ width: 350 }}
                    >
                        <li>
                            <h6 className="dropdown-header fs-13  text-start pt-0 pb-1 border-bottom">
                                {t("deliveryAddress")}
                            </h6>
                        </li>
                        <li className="px-3 pt-3">
                            {/* <div className="d-flex gap-2"> */}
                            <HeaderAddressSlider>
                                {addressList &&
                                    addressList.length > 0 &&
                                    addressList.map((adress) => (
                                        <SwiperSlide
                                            key={
                                                adress?.id
                                                    ? adress.id
                                                    : adress.address_line1
                                            }
                                        >
                                            <div
                                                className={`border p-1 rounded-small  ${
                                                    chosenAddress &&
                                                    chosenAddress?.id ===
                                                        adress?.id
                                                        ? "border-main"
                                                        : ""
                                                } `}
                                                style={{
                                                    width: "140px",
                                                    minHeight: "115px",
                                                }}
                                            >
                                                <div
                                                    role="button"
                                                    onClick={() =>
                                                        dispatch(
                                                            setChosenAddress(
                                                                adress
                                                            )
                                                        )
                                                    }
                                                >
                                                    {/* <div className="truncate-overflow-1 fw-bold fs-">
                                                        {adress.firstName}
                                                    </div> */}
                                                    <div className="">
                                                        <div className="truncate-overflow-1">
                                                            {
                                                                adress.address_line1
                                                            }{" "}
                                                        </div>
                                                        <div className="truncate-overflow-1">
                                                            {
                                                                adress?.address_line2
                                                            }
                                                        </div>
                                                        <div className="truncate-overflow-1">
                                                            {adress.city}{" "}
                                                            {adress.zip_code}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center mt-1  gap-2">
                                                    {chosenAddress &&
                                                        chosenAddress.id ===
                                                            adress.id && (
                                                            <div className="text-muted fw-medium">
                                                                {t("chosen")}
                                                            </div>
                                                        )}
                                                    {/* <div
                                                        className="fw-medium text-danger"
                                                        role="button"
                                                        onClick={() => {
                                                            deleteAddress(
                                                                adress?.id
                                                            );
                                                        }}
                                                    >
                                                        {t("delete")}
                                                    </div> */}
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}

                                <SwiperSlide>
                                    <div
                                        className="border p-1 text-center d-flex align-items-center rounded-small break-space"
                                        style={{
                                            width: "140px",
                                            minHeight: "115px",
                                        }}
                                    >
                                        <span>
                                            <Link
                                                href="/account/address"
                                                className="main-link "
                                            >
                                                {t("manageAddressBook")}
                                            </Link>
                                            {!isAuthenticated && (
                                                <span className="d-block fs-12 text-black-50">
                                                    {t("loginRequired")}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </SwiperSlide>
                            </HeaderAddressSlider>
                            {/* </div> */}
                        </li>
                        <li className="border-top mt-3">
                            <div
                                className="mt-1  px-3"
                                role="button"
                                onClick={() => {
                                    if (isAuthenticated) {
                                        router.push("/account/address");
                                    } else {
                                        router.push("/auth/login");
                                    }
                                }}
                            >
                                <span className="main-link">
                                    <IconPlus size={16} /> {t("addNewAddress")}{" "}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
