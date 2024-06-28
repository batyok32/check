import React from "react";

function LoadingSpin({ tip, className }) {
    return (
        <div className={`text-center my-5 ${className && className}`}>
            <div class="spinner-border text-main" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div>{tip && tip}</div>
        </div>
    );
}

export default LoadingSpin;
