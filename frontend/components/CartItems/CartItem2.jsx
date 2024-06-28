import { useAppDispatch } from "@/redux/hooks";
import { fetchProductShipRates } from "@/redux/utils/product";
import {
    IconChevronDown,
    IconHeart,
    IconMinus,
    IconPlus,
    IconRefresh,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import { IconHeartFilled } from "@tabler/icons-react";

const mapState = (state) => ({
    wishItems: selectWishItems(state),
    chosenAddress: state.addressBook.chosenAddress,
    user: state.auth.user,
});

function CartItem2({ item, handleItemSelect, index, isChild }) {
    return (
        <div
            className={`row fs-14 align-items-center py-3 ${
                !item?.is_active
                    ? "border-top border-bottom border-2 border-danger "
                    : ""
            }`}
            // style={!item?.is_active ? { opacity: 0.5 } : undefined}
        >
            <div className="col-auto">
                <input
                    className="form-check-input customcheckbox fs-6 rounded-small border-main"
                    type="checkbox"
                    role="button"
                    checked={item.selected || false}
                    id="flexCheckDefault"
                    onChange={(e) => handleItemSelect(index, e.target.checked)}
                />
            </div>
            <Link
                href={`/products/${item?.product?.slug}/${item?.product?.id}/`}
                className="col-2"
            >
                <img
                    src={item?.product?.image}
                    alt=""
                    className="img-fluid"
                    // className={`${isChild ? "d-none" : "img-fluid"}`}
                />
            </Link>
            <div className="col">
                <Link
                    className="fw-medium"
                    href={`/products/${item?.product?.slug}/${item?.product?.id}/`}
                >
                    {item?.product?.name}
                </Link>
                <div className="text-muted fs-13">
                    {item?.selectedVariations &&
                        Object.entries(item.selectedVariations).length > 0 &&
                        Object.entries(item.selectedVariations)
                            .map(([key, variation]) => variation.name)
                            .join(" / ")}
                </div>
                {!item?.is_active && (
                    <div>
                        <IconX size={18} className="text-danger" />
                        Not active
                    </div>
                )}
                <div className="mt-3 ">
                    {!isChild &&
                        (alreadyInWishlist ? (
                            <button
                                onClick={() => handleRemoveFromWishlist()}
                                className="btn btn-main px-2 py-0 border-0 text-white me-2"
                            >
                                <IconHeartFilled size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleAddToWishlist()}
                                className="btn btn-gray px-2 py-0 border-0 me-2"
                            >
                                <IconHeart size={18} />
                            </button>
                        ))}
                    <button
                        onClick={() => dispatch(removeFromCart([item]))}
                        className="btn btn-gray px-2 py-0 border-0 me-2"
                    >
                        <IconTrash size={18} />
                    </button>
                    {!item?.is_active && chosenShipRate && (
                        <button
                            onClick={() => handleAddToCart(true)}
                            className="btn btn-gray px-2  border-0 fw-medium fs-14 py-1"
                        >
                            Save
                        </button>
                    )}
                    {!item?.is_active &&
                        shippingOption?.name === "Based on zip" &&
                        (startFetchingShipRates ? (
                            <div>
                                {!chosenShipRate && !refreshedRates && (
                                    <div className="d-flex">
                                        <div
                                            role="button"
                                            onClick={() =>
                                                setRefreshedRates(true)
                                            }
                                            className="fs-13 border border-2 btn-custom user-select-none fw-medium border-main w-auto px-2 rounded-small"
                                        >
                                            Refresh rates{" "}
                                            <IconRefresh
                                                size={18}
                                                className="text-main ms-1"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="mt-2 border border-black p-2 rounded-small dropdown user-select-none fs-13">
                                    <div
                                        className="fw-medium d-inline-flex  w-100 align-items-center gap-2"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        data-bs-auto-close="false"
                                        role="button"
                                    >
                                        {chosenShipRate ? (
                                            chosenShipRate?.courier_name ? (
                                                <span className="d-flex justify-content-between w-100">
                                                    <span>
                                                        {
                                                            chosenShipRate.courier_name
                                                        }
                                                    </span>
                                                    <span className="fw-bold">
                                                        $
                                                        {
                                                            chosenShipRate.total_charge
                                                        }
                                                    </span>
                                                </span>
                                            ) : (
                                                <>
                                                    Contact support for detailed
                                                    shipping
                                                </>
                                            )
                                        ) : (
                                            <>
                                                Choose shipping
                                                <IconChevronDown size={18} />
                                            </>
                                        )}
                                    </div>

                                    <ul
                                        class="dropdown-menu main-drop fs-13 user-select-none rounded-small mt-2"
                                        style={{
                                            minWidth: "350px",
                                        }}
                                    >
                                        {Array.isArray(shipRates) &&
                                        shipRates.length > 0 ? (
                                            shipRates.map((rate) => (
                                                <li
                                                    key={rate.id}
                                                    onClick={() =>
                                                        setChosenShipRate({
                                                            ...rate,
                                                            type: "BASED_ON_ZIP",
                                                        })
                                                    }
                                                    role="button"
                                                    class={`dropdown-item border-bottom pt-3`}
                                                >
                                                    <div
                                                        class="form-check"
                                                        role="button"
                                                    >
                                                        <input
                                                            class="form-check-input customradio"
                                                            type="radio"
                                                            name="shipRates"
                                                            id={
                                                                rate?.courier_name
                                                            }
                                                            checked={
                                                                chosenShipRate &&
                                                                chosenShipRate?.courier_name ===
                                                                    rate?.courier_name
                                                            }
                                                        />
                                                        <label
                                                            class="form-check-label  w-100"
                                                            for={
                                                                rate?.courier_name
                                                            }
                                                            role="button"
                                                        >
                                                            <div className="d-flex gap-2">
                                                                <img
                                                                    src={
                                                                        rate?.courier_logo_url
                                                                    }
                                                                    style={{
                                                                        maxHeight:
                                                                            "20px",
                                                                    }}
                                                                    alt=""
                                                                />
                                                                <span className="fw-medium">
                                                                    {
                                                                        rate.courier_name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="pt-1 border-top my-1">
                                                                {rate?.cost_rank ===
                                                                    1.0 && (
                                                                    <span className="fs-13 text-main fw-bold me-2">
                                                                        Cheapest
                                                                    </span>
                                                                )}
                                                                {rate?.delivery_time_rank ===
                                                                    1.0 && (
                                                                    <span className="fs-13 text-main fw-bold">
                                                                        Fastest
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <div className="fw-medium">
                                                                    {
                                                                        rate?.min_delivery_time
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        rate?.max_delivery_time
                                                                    }{" "}
                                                                    days
                                                                </div>
                                                                <div className="fw-bold">
                                                                    $
                                                                    {
                                                                        rate?.total_charge
                                                                    }
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <>
                                                <div
                                                    role="button"
                                                    class={` px-3 py-2 fw-medium`}
                                                >
                                                    No shipping available for
                                                    your case
                                                    {/* Request for customer support */}
                                                </div>
                                                <li
                                                    class={`dropdown-item text-main border mt-1 pb-0 pt-2`}
                                                >
                                                    <div
                                                        class="form-check"
                                                        role="button"
                                                    >
                                                        <input
                                                            class="form-check-input customradio"
                                                            type="radio"
                                                            name="shipRates"
                                                            id="contactsupport"
                                                            checked={
                                                                chosenShipRate &&
                                                                chosenShipRate?.type ===
                                                                    "CONTACT_SUPPORT"
                                                            }
                                                        />
                                                        <label
                                                            class="form-check-label  w-100"
                                                            for="contactsupport"
                                                            role="button"
                                                            onClick={() =>
                                                                setChosenShipRate(
                                                                    {
                                                                        type: "CONTACT_SUPPORT",
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            Contact customer
                                                            support for detailed
                                                            shipping
                                                        </label>
                                                    </div>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div
                                role="button"
                                onClick={() => setStartFetchingShipRates(true)}
                                className="mt-2 border border-black text-center p-2 rounded-small dropdown user-select-none fs-12"
                            >
                                Choose new shipping rate
                            </div>
                        ))}
                </div>
            </div>
            <div className="col-2">
                <div className="fw-medium">{priceAmount}$</div>
                <div className="text-muted fs-13">
                    {item && shippingOfProduct?.name}
                </div>
            </div>
            <div className="col-2 d-flex align-items-center gap-1">
                <button
                    className="btn btn-gray px-2 py-0 border-0"
                    onClick={() => handleAmountChange("minus")}
                >
                    <IconMinus size={18} />
                </button>
                <div>
                    <input
                        type="text"
                        className="text-center"
                        style={{ maxWidth: "40px" }}
                        value={amountValue}
                    />
                </div>
                <button
                    className="btn btn-gray px-2 py-0 border-0"
                    onClick={() => handleAmountChange("plus")}
                >
                    <IconPlus size={18} />
                </button>
            </div>
        </div>
    );
}

export default CartItem2;
