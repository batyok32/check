import { parseAndFormatDecimal } from "@/redux/utils/opts";
import { IconChevronDown, IconHeartFilled, IconX } from "@tabler/icons-react";
import { IconHeart, IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

function MobileCartItem({
    index,
    item,
    handleItemSelect,
    isChild,
    alreadyInWishlist,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    handleAmountChange,
    dispatch,
    removeFromCart,
    amountValue,
    priceAmount,
    startFetchingShipRates,
    chosenShipRate,
    availableShippingOptions,
    setStartFetchingShipRates,
    setChosenShipRate,
    handleAddToCart,
}) {
    const t = useTranslations("CartItem");
    return (
        <div className="d-flex d-md-none mt-3 row flex-wrap align-items-center py-2">
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
            <div className="col-6 pe-0">
                <Link
                    href={`/products/${item?.product?.slug}/${item?.product?.id}/`}
                >
                    <img
                        src={item?.product?.image}
                        alt=""
                        className="img-fluid"
                        // className={`${isChild ? "d-none" : "img-fluid"}`}
                    />
                </Link>
            </div>
            <div className="col-12 ps-2 pe-0 d-flex  justify-content-between">
                <div>
                    <div className="fw-medium fs-14 truncate-overflow-2">
                        <Link
                            className="fw-medium"
                            href={`/products/${item?.product?.slug}/${item?.product?.id}/`}
                        >
                            {item?.product?.name}
                        </Link>
                    </div>

                    <div className="text-muted py-1 fs-14">
                        <div className="text-muted fs-13">
                            {item?.selectedVariations &&
                                Object.entries(item.selectedVariations).length >
                                    0 &&
                                Object.entries(item.selectedVariations)
                                    .map(([key, variation]) => variation.name)
                                    .join(" / ")}
                        </div>
                    </div>
                    <div className="text-muted fs-1">
                        {item?.product?.sell_in_containers && (
                            <div>
                                <div>
                                    Container Name:{" "}
                                    {item?.selectedBulkPolicy?.container_name}
                                </div>
                                <div>Container Dimensions:</div>
                                <ul>
                                    <li>
                                        Length:{" "}
                                        {
                                            item?.selectedBulkPolicy
                                                ?.container_length
                                        }{" "}
                                        meters
                                    </li>
                                    <li>
                                        Width:{" "}
                                        {
                                            item?.selectedBulkPolicy
                                                ?.container_width
                                        }{" "}
                                        meters
                                    </li>
                                    <li>
                                        Height:{" "}
                                        {
                                            item?.selectedBulkPolicy
                                                ?.container_height
                                        }{" "}
                                        meters
                                    </li>
                                </ul>
                                <div>
                                    Container Weight:{" "}
                                    {item?.selectedBulkPolicy?.container_weight}{" "}
                                    kilograms
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className="fw-medium fs-15">{priceAmount}$</div>
                    <div className="text-muted fs-13 mb-1">
                        + ${parseAndFormatDecimal(item?.shipping?.total_charge)}{" "}
                        {t("ship")}
                    </div>
                    {item?.tax_rate && item?.tax_rate > 0 ? (
                        <div className="text-muted fs-13 mb-1">
                            + ${(item?.tax_rate * priceAmount) / 100} {t("tax")}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                {/* {!item?.is_active && (
                    <div className="d-flex align-items-center gap-2 fs-14 mt-2 ">
                        <IconX size={18} className="text-danger" />
                        Not active
                    </div>
                )} */}
            </div>
            <div className="col-12 my-2 d-flex align-items-center justify-content-between ">
                <div className="d-flex">
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
                </div>
                <div className=" me-2">
                    {!item?.is_active &&
                        startFetchingShipRates &&
                        chosenShipRate && (
                            <button
                                onClick={() => handleAddToCart(true)}
                                className="btn btn-gray px-2  border-0 fw-medium fs-14 py-1"
                            >
                                {t("save")}
                            </button>
                        )}
                    {!item?.is_active &&
                        (startFetchingShipRates ? (
                            <div>
                                <div className="mt-2 border border-black p-2 rounded-small dropdown user-select-none fs-13">
                                    <div
                                        className="fw-medium d-inline-flex  w-100 align-items-center gap-2 truncate-overflow-1"
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
                                                        {parseAndFormatDecimal(
                                                            chosenShipRate.total_charge
                                                        )}
                                                    </span>
                                                </span>
                                            ) : (
                                                <>{t("contactSupport")}</>
                                            )
                                        ) : (
                                            <>
                                                {t("chooseShipping")}
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
                                        {Array.isArray(
                                            availableShippingOptions
                                        ) &&
                                        availableShippingOptions.length > 0 ? (
                                            availableShippingOptions.map(
                                                (rate) => (
                                                    <li
                                                        key={rate.id}
                                                        onClick={() =>
                                                            setChosenShipRate(
                                                                rate
                                                            )
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
                                                                                "15px",
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
                                                                            {t(
                                                                                "cheapest"
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                    {rate?.delivery_time_rank ===
                                                                        1.0 && (
                                                                        <span className="fs-13 text-main fw-bold">
                                                                            {t(
                                                                                "fastest"
                                                                            )}
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
                                                                        {t(
                                                                            "days"
                                                                        )}
                                                                    </div>
                                                                    <div className="fw-bold">
                                                                        $
                                                                        {parseAndFormatDecimal(
                                                                            rate?.total_charge
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </li>
                                                )
                                            )
                                        ) : (
                                            <>
                                                <div
                                                    role="button"
                                                    class={` px-3 py-2 fw-medium`}
                                                >
                                                    {t("noShipping")}

                                                    {/* Request for customer support */}
                                                </div>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div
                                role="button"
                                onClick={() => setStartFetchingShipRates(true)}
                                className="mt-2 border border-black text-center p-2 rounded-small dropdown user-select-none fs-12 truncate-overflow-1"
                            >
                                {t("chooseShipping")}
                            </div>
                        ))}
                </div>
                <div className="d-flex align-items-center gap-1 ms-auto">
                    <button
                        className="btn btn-gray px-2 py-0 border-0"
                        onClick={() => handleAmountChange("minus")}
                    >
                        <IconMinus size={18} />
                    </button>
                    <div>
                        <input
                            type="text"
                            className="text-center fs-14"
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
                <div className="">
                    {/* <button className="btn btn-gray bg-slightgray px-2 py-0 border-0 me-2">
                        <IconHeart size={18} />
                    </button>
                    <button className="btn btn-gray bg-slightgray px-2 py-0 border-0">
                        <IconTrash size={18} />
                    </button> */}
                </div>
            </div>
        </div>
    );
}

export default MobileCartItem;
