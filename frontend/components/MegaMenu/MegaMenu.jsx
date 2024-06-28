"use client";
import { useState } from "react";
import "./MegaMenu.css";

function MegaMenu({ children }) {
    const [clicked, setClicked] = useState(false);
    return (
        <div>
            <div onClick={() => setClicked(!clicked)}>{children}</div>
            <div className={`d-content ${clicked ? "d-block" : "d-none"}`}>
                <div className="row row-cols-3 mx-0">
                    <div className="">
                        <h3>Category 1</h3>
                        <div>Link 1</div>
                        <div>Link 2</div>
                        <div>Link 3</div>
                    </div>
                    <div className="">
                        <h3>Category 2</h3>
                        <div>Link 1</div>
                        <div>Link 2</div>
                        <div>Link 3</div>
                    </div>
                    <div className="">
                        <h3>Category 3</h3>
                        <div>Link 1</div>
                        <div>Link 2</div>
                        <div>Link 3</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MegaMenu;
