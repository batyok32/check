"use client";

import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import Link from "next/link";

export default function CategoryDropItem({ category }) {
    const { categories } = useAppSelector((state) => state.shop);
    return (
        <div class="btn-group dropend d-block customdrop">
            <div
                type="button"
                className="listitem  "
                // className={isOpen ? "listitem show" : "listitem"}
                data-bs-toggle="dropdown"
                // aria-expanded={isOpen ? "true" : "false"}
            >
                <Link href={`/products?category=${category.id}`}>
                    {category.name}
                </Link>
            </div>
            <ul
                className="dropdown-menu fs-14 rounded-small bg-grayblack text-white p-3 column-1"
                style={{ width: "220px" }}
                data-popper-placement="right-start"
                // style={
                //     isOpen
                //         ? {
                //               position: "absolute",
                //               inset: "0px auto auto 0px",
                //               margin: 0,
                //               transform: "translate3d(65.6667px, 0px, 0px)",
                //           }
                //         : {}
                // }
            >
                {category.childrens.map((cate) => (
                    <Link key={cate.id} href={`/products?category=${cate.id}`}>
                        <li>{cate.name}</li>
                    </Link>
                ))}
            </ul>
            {/*   */}
        </div>
    );
}
