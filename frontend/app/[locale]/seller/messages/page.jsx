import {
    IconFilter,
    IconPlus,
    IconSearch,
    IconSortDescending2,
    IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";

export default function MessagesPage() {
    return (
        <div>
            <div className="border-start py-2 px-2 px-md-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                <h5 className="m-0 fw-bold d-none d-md-block">Messages</h5>
                <div className="fs-14 m-0 d-flex gap-4 align-items-center">
                    <div className="text-secondary d-flex border align-items-center py-2 px-1 rounded-small">
                        <IconSearch size={22} className="me-2" />
                        <input
                            type="text"
                            class="form-control border-0 p-0 rounded-0 shadow-none placeholder-gray fs-14"
                            id="exampleFormControlInput1"
                            placeholder="Search by title, tag or SKU"
                        />
                    </div>
                    <Link href="/seller/messages">
                        <button className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                            <IconPlus className="me-1" size={22} /> Send{" "}
                            <span className="d-none d-md-inline ms-1">
                                {" "}
                                a message
                            </span>
                        </button>
                    </Link>
                </div>
            </div>

            <div className="row mx-0 ">
                <div className="col-md-8 ">
                    <div className="d-flex mt-4 gap-1 gap-md-3 ">
                        <div className="border px-2 d-flex flex-wrap  justify-content-center align-items-center bg-white rounded-1 ">
                            <input
                                className="form-check-input customcheckbox fs-15 "
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                            />
                        </div>

                        <div
                            role="button"
                            className="border px-2 py-2 fw-medium bg-white rounded-1 fs-15 text-secondary d-flex align-items-center"
                        >
                            Delete <IconTrash size={20} className="ms-2" />
                        </div>

                        <div
                            class="btn-group border ms-auto"
                            role="group"
                            style={{ borderRadius: 3, overflow: "hidden" }}
                            aria-label="Basic radio toggle button group"
                        >
                            <div
                                role="button"
                                className="border-end btn-active px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center"
                            >
                                All
                            </div>
                            <div
                                role="button"
                                className="border-end px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center"
                            >
                                Inbox
                            </div>
                            <div
                                role="button"
                                className=" px-2 py-2 fw-medium bg-white  fs-15 text-secondary d-flex align-items-center"
                            >
                                Sent
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-2 justify-content-end gap-1">
                        <div
                            role="button"
                            className="border px-2 py-2 fw-medium bg-white rounded-small  fs-15 text-secondary d-flex align-items-center"
                        >
                            <IconFilter className="text-main me-1" size={20} />
                            Filters
                        </div>
                        <div
                            role="button"
                            className="border px-2 py-2 fw-medium bg-white rounded-small  fs-15 text-secondary d-flex align-items-center"
                        >
                            <IconSortDescending2
                                className="text-main me-1"
                                size={22}
                            />{" "}
                            Sorts
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="row mx-0 fs-15 bg-white border mb-1 rounded-small py-2 align-items-center ">
                            <div className="col-auto">
                                <input
                                    className="form-check-input customcheckbox fs-15"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                />
                            </div>
                            <div className="col-auto px-0 px-md-2 fw-medium">
                                Yuusell
                            </div>
                            <div className="col truncate-overflow-1 ps-3 ">
                                Your funds are on hold
                            </div>
                            <div className="col-auto col-md-2 text-muted fs-14">
                                Jan 01
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 py-4 d-none d-md-block">
                    <div className="mb-3">
                        <div className="fs-14  fw-bold mb-2">Sort</div>
                        <select
                            className="form-select fs-14 w-100 rounded-0 mb-2 shadow-none border"
                            aria-label="Default select example"
                        >
                            <option value="1">Top Sold</option>
                            <option value="2">Less Sold</option>
                            <option value="2">Title A:Z</option>
                            <option value="2">Title Z:A</option>
                            <option value="2">Stock: lowest to highest</option>
                            <option value="2">Stock: highest to lowest </option>
                            <option value="2">Price: highest to lowest </option>
                            <option value="2">Price: lowest to highest</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <div className="fs-14  fw-bold mb-2">Date & Time</div>
                        <select
                            className="form-select fs-14 w-100 rounded-0 mb-2 shadow-none border"
                            aria-label="Default select example"
                        >
                            <option value="1">Time</option>
                            <option value="2">Today</option>
                            <option value="2">Yesterday</option>
                            <option value="2">Last 30 days</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <div className="fs-14  fw-bold mb-2">Categories</div>
                        <ul className="list-unstyled fs-14">
                            <li>
                                <input
                                    className="form-check-input customcheckbox me-1"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                />{" "}
                                From members
                            </li>
                            <li>
                                <input
                                    className="form-check-input customcheckbox me-1"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                />{" "}
                                From Yuusell
                            </li>
                            <li>
                                <input
                                    className="form-check-input customcheckbox me-1"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                />{" "}
                                Unread messages
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
