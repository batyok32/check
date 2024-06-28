"use client";

import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

function MobileHeaderSearch() {
    const { push } = useRouter();
    const t = useTranslations();
    return (
        <div className="input-group flex-grow-1 align-items-center bg-slightgray my-1  rounded-2 py-0">
            {/* <div className="bg-gray align-self-stretch d-flex justify-content-center">
                <select
                    className="form-select btn  border-0 rounded-0 me-0 fs-13 noarrow  m-0 truncate-overflow-1 px-1"
                    style={{ maxWidth: "60px" }}
                    aria-label="Default select example"
                >
                    <option value="1">All</option>
                    <option value="2">Antiques</option>
                    <option value="3">Art</option>
                    <option value="4">Baby</option>
                    <option value="5">Books & Magazines</option>
                    <option value="6">Business & Industrials</option>
                </select>
            </div> */}
            {/* <button
                className="btn btn-gray border-0 rounded-0 me-0 dropdown-toggle fs-14 align-self-stretch"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                All
            </button>
            <ul className="dropdown-menu fs-14">
                <li>
                    <a className="dropdown-item" href="#">
                        Action
                    </a>
                </li>
                <li>
                    <a className="dropdown-item" href="#">
                        Another action
                    </a>
                </li>
                <li>
                    <a className="dropdown-item" href="#">
                        Something else here
                    </a>
                </li>
                <li>
                    <hr className="dropdown-divider" />
                </li>
                <li>
                    <a className="dropdown-item" href="#">
                        Separated link
                    </a>
                </li>
            </ul> */}
            <IconSearch className="text-secondary ms-2 fw-medium" size={20} />

            <input
                type="text"
                className="form-control border-0 shadow-none ps-2 py-2 fs-14 user-select-none bg-slightgray  text-black placeholder-gray"
                aria-label="Text input with dropdown button "
                placeholder={t("Search_Yuusell")}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim().length > 0) {
                        push(`/products?search=${e.target.value.trim()}`);
                    }
                }}
            />
            {/* <div
                role="button"
                onClick={() => push("/search?query=hello")}
                className="btn-main  text-white align-self-stretch d-flex align-items-center px-2 rounded-end-1"
            >
                <div className="btn-custom">
                    <IconSearch />
                </div>
            </div> */}
        </div>
    );
}

export default MobileHeaderSearch;
