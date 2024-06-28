import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

function DropSelect({ label, onSelect, fetchOptions, defaultOption, reset }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [sawDefaultOption, setSawDefaultOption] = useState(false);

    useEffect(() => {
        if (options.length < 1) {
            setIsLoading(true);
            fetchOptions(null, setOptions, setIsLoading);
        }
    }, []);

    useEffect(() => {
        if (searchValue.trim().length >= 2) {
            setIsLoading(true);
            fetchOptions(searchValue.trim(), setOptions, setIsLoading);
        }
    }, [searchValue]);

    useEffect(() => {
        if (defaultOption && !sawDefaultOption) {
            defaultOption(setSelectedItem);
            setSawDefaultOption(true);
        }
    }, [defaultOption]);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("CLICKED ENTER");
            // Call the function to fetch options
            if (searchValue.trim().length > 0) {
                console.log("ADDED");
                setSelectedItem({
                    name: searchValue,
                });
                onSelect(searchValue);
            }
        }
    };

    const t = useTranslations();

    return (
        <div className="dropdown position-relative my-2">
            <button
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                    outline: "none",
                    boxShadow: "none",
                }}
                className="w-100 rounded-small fs-14 btn px-3 d-flex justify-content-between align-items-center border dropdown-toggle truncate-overflow-1"
            >
                {selectedItem?.name ? selectedItem.name : label}
                <i className="ms-2 bi bi-chevron-down fs-14"></i>
            </button>
            <ul
                className="dropdown-menu p-0 mt-1 rounded-small main-drop"
                style={{ width: "90%" }}
            >
                <div
                    className="my-3 mx-auto d-flex px-2 bg-gray text-muted align-items-center"
                    style={{ width: "90%" }}
                >
                    <input
                        type="text"
                        placeholder={t("Listings.searchOrEnterOwn")}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="form-control border-0 fs-14  bg-transparent sm-placeholder"
                        style={{
                            outline: "none",
                            boxShadow: "none",
                        }}
                        required
                        onKeyDown={handleKeyPress}
                    />
                </div>
                {isLoading && (
                    <div className="text-center my-2 text-main">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <div
                    style={{
                        overflowY: "scroll",
                        maxHeight: "150px",
                    }}
                >
                    {selectedItem ? (
                        <div className="px-2">
                            <div
                                onClick={() => {
                                    setSelectedItem(null);
                                    reset();
                                }}
                                role="button"
                                className="dropdown-item rounded-small fw-medium  fs-14 truncate-overflow-1 btn-main justify-content-between align-items-center my-2 py-2 d-flex"
                            >
                                <span>{selectedItem.name}</span>x
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {Array.isArray(options) &&
                        options.length > 0 &&
                        options
                            .filter(
                                (option) => option.name !== selectedItem?.name
                            )
                            .map((option, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setSelectedItem({
                                                name: option.name,
                                            });
                                            onSelect(option.value);
                                        }}
                                        role="button"
                                        key={index}
                                        className="dropdown-item py-2 fs-14 "
                                    >
                                        {option.name}
                                    </div>
                                );
                            })}
                </div>
            </ul>
        </div>
    );
}

export default DropSelect;
