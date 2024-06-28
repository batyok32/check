"use client";
import AddressAddModal from "@/components/Addresses/AddressAddModal";
import AddressEditModal from "@/components/Addresses/AddressEditModal";
import {
    setChosenAddress,
    setRefetchAddress,
} from "@/redux/features/addressBookSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    IconPencil,
    IconPlus,
    IconSelect,
    IconTrash,
} from "@tabler/icons-react";
import React from "react";
import { toast } from "react-toastify";
import { useRef, useState } from "react";
import { deleteAddressFromBook } from "@/redux/actions/authPostActions";
import { useTranslations } from "next-intl";

const mapState = (state) => ({
    addressList: state.addressBook.addressList,
    chosenAddress: state.addressBook.chosenAddress,
});

export default function Page() {
    const { addressList, chosenAddress } = useAppSelector(mapState);
    const dispatch = useAppDispatch();

    const deleteAddress = (addressId) => {
        // console.log("ADDRESSES", addressId);
        dispatch(deleteAddressFromBook(addressId))
            // deleteAddressInBook(addressId, `?new_address_id=${chosenAddress.id}`)
            .then((res) => {
                dispatch(setRefetchAddress(Math.random()));
                // checkAddressBookExistence();
            })
            .catch((error) => {
                console.log("ERROR", error);
                if (error.status === 404) {
                    toast.error("Could not find this address.", {
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
    const t = useTranslations();
    return (
        <div>
            <AddressEditModal addressToEdit={changeAddress}>
                <div className="d-none" ref={openEditAddressModalRef}></div>
            </AddressEditModal>
            <div className="row">
                <div className="mt-3 px-4 col-10 mx-auto">
                    <div className="mb-3 d-flex justify-content-between align-items-end">
                        <div className="">
                            <div className="fw-bold  fs-5">
                                {t("Address.addresses")}
                            </div>
                            {/* <div className=" fs-14 mt-1 ">
                                Enter the first name and last name associated
                                with your Yuusell account.
                            </div> */}
                        </div>
                        <div className="fs-14 m-0 d-flex gap-4">
                            <div className="text-secondary d-flex  align-items-center px-1 rounded-small py-2">
                                <AddressAddModal>
                                    <button className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                                        <IconPlus className="me-1" size={22} />{" "}
                                        {t("Address.addNewAddress")}{" "}
                                        {/* <span className="d-none d-md-inline ms-1">
                                            {" "}
                                            new address
                                        </span> */}
                                    </button>
                                </AddressAddModal>
                            </div>
                        </div>
                    </div>
                    {/* List */}
                    <div className="d-flex gap-2 flex-wrap fs-15">
                        <div className="table-responsive w-100">
                            <table class="table fs-14 table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">{t("Address.line")}</th>
                                        <th scope="col">{t("Address.city")}</th>
                                        <th scope="col">
                                            {t("Address.state")}
                                        </th>
                                        <th scope="col">
                                            {t("Address.zipCode")}
                                        </th>
                                        <th scope="col">
                                            {t("Address.country")}
                                        </th>
                                        <th scope="col">
                                            {t("Address.actions")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addressList &&
                                        addressList.length > 0 &&
                                        addressList.map((adress, index) => (
                                            <tr key={index} role="button">
                                                <th
                                                    onClick={() =>
                                                        dispatch(
                                                            setChosenAddress(
                                                                adress
                                                            )
                                                        )
                                                    }
                                                    scope="row"
                                                >
                                                    {index + 1}
                                                </th>
                                                <td
                                                    onClick={() =>
                                                        dispatch(
                                                            setChosenAddress(
                                                                adress
                                                            )
                                                        )
                                                    }
                                                    className="underline-on-hover"
                                                >
                                                    {adress.address_line1}{" "}
                                                    {adress.address_line2}
                                                </td>
                                                <td
                                                    onClick={() =>
                                                        dispatch(
                                                            setChosenAddress(
                                                                adress
                                                            )
                                                        )
                                                    }
                                                >
                                                    {adress.city}
                                                </td>
                                                <td
                                                    onClick={() =>
                                                        dispatch(
                                                            setChosenAddress(
                                                                adress
                                                            )
                                                        )
                                                    }
                                                >
                                                    {adress.state}
                                                </td>
                                                <td
                                                    onClick={() =>
                                                        dispatch(
                                                            setChosenAddress(
                                                                adress
                                                            )
                                                        )
                                                    }
                                                >
                                                    {adress.zip_code}
                                                </td>
                                                <td
                                                    onClick={() =>
                                                        dispatch(
                                                            setChosenAddress(
                                                                adress
                                                            )
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        `Countries.${adress.country}`
                                                    )}
                                                </td>
                                                <td>
                                                    {" "}
                                                    <div className="d-flex align-items-center   gap-2 justify-content-center ">
                                                        {chosenAddress &&
                                                            chosenAddress.id ===
                                                                adress.id && (
                                                                <div className="text-success fw-medium">
                                                                    <IconSelect
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        <div
                                                            onClick={() =>
                                                                openEditAddressModal(
                                                                    adress
                                                                )
                                                            }
                                                            className="fw-medium text-main "
                                                            role="button"
                                                        >
                                                            <IconPencil
                                                                size={18}
                                                            />
                                                            {/* <IconTrashX size={16} /> */}
                                                        </div>
                                                        <div
                                                            className="fw-medium text-danger "
                                                            role="button"
                                                            onClick={() => {
                                                                deleteAddress(
                                                                    adress?.id
                                                                );
                                                            }}
                                                        >
                                                            <IconTrash
                                                                size={18}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* {addressList && addressList.length > 0 ? (
                        addressList.map((adress) => (
                            <div key={adress.id} className="">
                                <div
                                    className={`border border-2 p-3 rounded-small  ${
                                        chosenAddress &&
                                        chosenAddress?.id === adress?.id
                                            ? "border-main"
                                            : ""
                                    } `}
                                    style={
                                        {
                                            // width: "140px",
                                            // minHeight: "115px",
                                        }
                                    }
                                >
                                    <div
                                        role="button"
                                        onClick={() =>
                                            dispatch(setChosenAddress(adress))
                                        }
                                    >
                                        
                                        <div className="">
                                            <div className="truncate-overflow-1">
                                                {adress.address_line1}{" "}
                                            </div>
                                            <div className="truncate-overflow-1">
                                                {adress?.address_line2}
                                            </div>
                                            <div className="truncate-overflow-1">
                                                {adress.city} {adress.zip_code}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center mt-3  gap-2 justify-content-end pe-2 pb-1">
                                        {chosenAddress &&
                                            chosenAddress.id === adress.id && (
                                                <div className="text-success fw-medium">
                                                    <IconSelect size={18} />
                                                </div>
                                            )}

                                        <div
                                            onClick={() =>
                                                openEditAddressModal(adress)
                                            }
                                            className="fw-medium text-main "
                                            role="button"
                                        >
                                            <IconPencil size={18} />
                                        </div>

                                        <div
                                            className="fw-medium text-danger "
                                            role="button"
                                            onClick={() => {
                                                deleteAddress(adress?.id);
                                            }}
                                        >
                                            <IconTrash size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="fs-5 fw-medium text-dark my-4 mx-auto">
                            No addresses.
                        </div>
                    )} */}
                    </div>
                </div>
            </div>
        </div>
    );
}
