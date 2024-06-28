"use client";

import AddressAddModal from "@/components/Addresses/AddressAddModal";
import AddressEditModal from "@/components/Addresses/AddressEditModal";
import { deleteAddressFromBook } from "@/redux/actions/authPostActions";
import {
    setChosenAddress,
    setRefetchAddress,
} from "@/redux/features/addressBookSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IconPencil, IconSelect, IconTrash } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
const mapState = (state) => ({
    addressList: state.addressBook.addressList,
    chosenAddress: state.addressBook.chosenAddress,
});

export default function Page() {
    const { addressList, chosenAddress } = useAppSelector(mapState);
    const dispatch = useAppDispatch();
    const t = useTranslations("Address");
    const allcounts = useTranslations("Countries");

    const deleteAddress = (addressId) => {
        // console.log("ADDRESSES", addressId);
        dispatch(deleteAddressFromBook(addressId))
            .then((res) => {
                dispatch(setRefetchAddress(Math.random()));
            })
            .catch((error) => {
                console.log("ERROR", error);
                if (error.status === 404) {
                    toast.error(t("findAddressError"), {
                        className: "fs-14",
                    });
                    dispatch(setRefetchAddress(Math.random()));
                } else {
                    toast.error(error.data.error, { className: "fs-14" });
                }
            });
    };
    const openEditAddressModalRef = useRef();
    const [changeAddress, setChangeAddress] = useState(null);

    const openEditAddressModal = (address) => {
        setChangeAddress(address);
        openEditAddressModalRef.current.click();
    };

    const openAddressCreateModalRef = useRef();

    return (
        <div>
            <AddressEditModal addressToEdit={changeAddress}>
                <div className="d-none" ref={openEditAddressModalRef}></div>
            </AddressEditModal>
            <AddressAddModal>
                <div className="d-none" ref={openAddressCreateModalRef}></div>
            </AddressAddModal>
            <div className="row mx-0">
                <div className="mt-3 col-lg-10 mx-auto">
                    <div className="mb-3 d-md-flex justify-content-between align-items-center ">
                        <div className="fw-bold  fs-5">{t("addresses")}</div>
                        <div className="fs-14  m-0 d-flex gap-4 ">
                            <div className="text-secondary d-flex  align-items-center px-1 rounded-small py-2">
                                <button
                                    onClick={() =>
                                        openAddressCreateModalRef.current.click()
                                    }
                                    className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center"
                                >
                                    <IconPlus className="me-1" size={22} />{" "}
                                    {t("addNewAddress")}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table fs-14 table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">{t("line")}</th>
                                    <th scope="col">{t("city")}</th>
                                    <th scope="col">{t("state")}</th>
                                    <th scope="col">{t("zipCode")}</th>
                                    <th scope="col">{t("country")}</th>
                                    <th scope="col">{t("actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addressList && addressList.length > 0 ? (
                                    addressList.map((address, index) => (
                                        <tr key={index} role="button">
                                            <th
                                                scope="row"
                                                onClick={() =>
                                                    dispatch(
                                                        setChosenAddress(
                                                            address
                                                        )
                                                    )
                                                }
                                            >
                                                {index + 1}
                                            </th>
                                            <td
                                                className="underline-on-hover"
                                                onClick={() =>
                                                    dispatch(
                                                        setChosenAddress(
                                                            address
                                                        )
                                                    )
                                                }
                                            >
                                                {address.address_line1}{" "}
                                                {address.address_line2}
                                            </td>
                                            <td
                                                onClick={() =>
                                                    dispatch(
                                                        setChosenAddress(
                                                            address
                                                        )
                                                    )
                                                }
                                            >
                                                {address.city}
                                            </td>
                                            <td
                                                onClick={() =>
                                                    dispatch(
                                                        setChosenAddress(
                                                            address
                                                        )
                                                    )
                                                }
                                            >
                                                {address.state}
                                            </td>
                                            <td
                                                onClick={() =>
                                                    dispatch(
                                                        setChosenAddress(
                                                            address
                                                        )
                                                    )
                                                }
                                            >
                                                {address.zip_code}
                                            </td>
                                            <td
                                                onClick={() =>
                                                    dispatch(
                                                        setChosenAddress(
                                                            address
                                                        )
                                                    )
                                                }
                                            >
                                                {allcounts(address.country)}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2 justify-content-center">
                                                    {chosenAddress &&
                                                        chosenAddress.id ===
                                                            address.id && (
                                                            <div className="text-success fw-medium">
                                                                <IconSelect
                                                                    size={18}
                                                                />
                                                            </div>
                                                        )}
                                                    <div
                                                        className="fw-medium text-main"
                                                        role="button"
                                                        onClick={() =>
                                                            openEditAddressModal(
                                                                address
                                                            )
                                                        }
                                                    >
                                                        <IconPencil size={18} />
                                                    </div>
                                                    <div
                                                        className="fw-medium text-danger"
                                                        role="button"
                                                        onClick={() =>
                                                            deleteAddress(
                                                                address.id
                                                            )
                                                        }
                                                    >
                                                        <IconTrash size={18} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            {t("noAddresses")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
