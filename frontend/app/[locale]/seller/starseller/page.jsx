import {
    IconMailForward,
    IconPlus,
    IconSearch,
    IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";

export default function StarSellerPage() {
    return (
        <div className="mb-5">
            <div className="border-start py-2 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                <h5 className="m-0 fw-bold">Star Seller</h5>
                <div className="fs-14 m-0 d-flex gap-4">
                    <Link href="/seller/listing/add/category">
                        <button className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                            <IconMailForward className="me-1" size={22} /> Send
                            a request
                        </button>
                    </Link>
                </div>
            </div>

            <div class="text-center py-5">
                <h1 className="fw-bold">Become Star Seller</h1>
                <p className="text-muted fs-6">
                    Feature your products on the top of YuuSell search page.
                </p>
                <div className="d-flex justify-content-center">
                    <button class="btn btn-main rounded-small fs-15 fw-bold px-3 d-flex align-items-center">
                        Send a request
                    </button>
                </div>
            </div>

            <blockquote class="blockquote text-center fs-15 border-top border-bottom mt-4 py-3 bg-white">
                <p class="mb-0">
                    &quot;We had a fantastic experience with deals. Using deals
                    allows us to sell in a couple of hours what we would
                    normally sell in a week.&quot;
                </p>
                <footer class="blockquote-footer mt-3">Sandy Leaf Farm</footer>
            </blockquote>

            <h4 className="fw-bold text-center py-5">
                Benefits to your business
            </h4>

            <div class="row row-cols-2 mt-3 fs-15 px-4">
                <div className="mb-2">
                    <div class="h-100 bg-white shadow-sm p-3">
                        <div className="fw-bold mb-2">
                            Take part in Amazon events
                        </div>
                        <p>
                            Benefit from marketing efforts for events such as
                            Prime Day and Black Friday...
                        </p>
                    </div>
                </div>
                <div className="mb-2">
                    <div class="bg-white shadow-sm p-3 h-100">
                        <div className="fw-bold mb-2">
                            Improve discoverability of your brand and products
                        </div>
                        <p>
                            Your deals will be featured on the Amazon Deals
                            page...
                        </p>
                    </div>
                </div>
                <div className="mb-2">
                    <div class="h-100 bg-white shadow-sm p-3">
                        <div className="fw-bold mb-2">
                            Increase sales across your brand
                        </div>
                        <p>
                            Promotions are a useful lever to help increase sales
                            by offering discounts...
                        </p>
                    </div>
                </div>
                <div className="mb-2">
                    <div class="h-100 bg-white shadow-sm p-3">
                        <div className="fw-bold mb-2">
                            Highlight products in search results
                        </div>
                        <p>
                            Products running as deals receive additional badging
                            in search results, helping customers find your best
                            offers.
                        </p>
                    </div>
                </div>
            </div>

            <h4 className="fw-bold text-center py-5">
                How to become YuuSell star seller?
            </h4>

            <div class="row row-cols-3 mt-3 fs-15 px-4">
                <div className="mb-2">
                    <div class="h-100 bg-white shadow-sm p-3">
                        <div className="text-center fs-4 fw-bold text-main mb-2">
                            1
                        </div>
                        <div className="fw-bold mb-2">
                            Sell more than 50 products
                        </div>
                        <p>
                            Benefit from marketing efforts for events such as
                            Prime Day and Black Friday...
                        </p>
                    </div>
                </div>
                <div className="mb-2">
                    <div class="h-100 bg-white shadow-sm p-3">
                        <div className="text-center fs-4 fw-bold text-main mb-2">
                            2
                        </div>
                        <div className="fw-bold mb-2">
                            Answer to messages in that day
                        </div>
                        <p>
                            Benefit from marketing efforts for events such as
                            Prime Day and Black Friday...
                        </p>
                    </div>
                </div>
                <div className="mb-2">
                    <div class="h-100 bg-white shadow-sm p-3">
                        <div className="text-center fs-4 fw-bold text-main mb-2">
                            3
                        </div>
                        <div className="fw-bold mb-2">Buy premium</div>
                        <p>
                            Benefit from marketing efforts for events such as
                            Prime Day and Black Friday...
                        </p>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center my-3">
                <div className="fs-14 m-0 d-flex gap-4">
                    <Link href="/seller/listing/add/category">
                        <button className="btn btn-main rounded-small fs-14 fw-bold px-3 d-flex align-items-center">
                            <IconMailForward className="me-1" size={22} /> Send
                            a request
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
