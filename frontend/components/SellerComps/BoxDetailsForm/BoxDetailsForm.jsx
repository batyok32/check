"use client";
import isEmpty from "@/components/utils/isEmpty";
import { useEffect, useState } from "react";

const BoxDetailsForm = ({ onSubmit }) => {
    const initialState = {
        itemCount: 1,
        length: "",
        height: "",
        width: "",
        weight: "",
    };
    const [boxDetails, setBoxDetails] = useState(initialState);
    const [formErrors, setFormErrors] = useState(null);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setBoxDetails({ ...boxDetails, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isEmpty(formErrors)) {
            onSubmit(boxDetails);
            setBoxDetails(initialState);
        }
    };
    const validateForm = (details) => {
        const errors = {};
        if (!details.itemCount) errors.itemCount = "Item count is required";
        if (!details.length) errors.length = "Length is required";
        if (!details.height) errors.height = "Height is required";
        if (!details.width) errors.width = "Width is required";
        if (!details.weight) errors.weight = "Weight is required";
        return errors;
    };
    useEffect(() => {
        setFormErrors(validateForm(boxDetails));
    }, [boxDetails]);

    return (
        <form onSubmit={handleSubmit} className="row g-3 px-4 mt-3 mb-3 fs-15">
            <div className="col-md-2">
                <label htmlFor="itemCount" className="form-label">
                    Items in box
                </label>
                <input
                    type="number"
                    className="form-control fs-14 rounded-small border shadow-none"
                    id="itemCount"
                    name="itemCount"
                    value={boxDetails.itemCount}
                    onChange={handleChange}
                    placeholder="Items in box"
                />
            </div>

            <div className="col-md-2">
                <label htmlFor="length" className="form-label">
                    Length
                </label>
                <input
                    type="number"
                    className="form-control fs-14 rounded-small border shadow-none"
                    id="length"
                    name="length"
                    value={boxDetails.length}
                    onChange={handleChange}
                    placeholder="Length"
                />
            </div>
            <div className="col-md-2">
                <label htmlFor="height" className="form-label">
                    Height
                </label>
                <input
                    type="number"
                    className="form-control fs-14 rounded-small border shadow-none"
                    id="height"
                    name="height"
                    value={boxDetails.height}
                    onChange={handleChange}
                    placeholder="Height"
                />
            </div>
            <div className="col-md-2">
                <label htmlFor="width" className="form-label">
                    Width
                </label>
                <input
                    type="number"
                    className="form-control fs-14 rounded-small border shadow-none"
                    id="width"
                    name="width"
                    value={boxDetails.width}
                    onChange={handleChange}
                    placeholder="Width"
                />
            </div>
            <div className="col-md-2">
                <label htmlFor="weight" className="form-label">
                    Weight
                </label>
                <input
                    type="number"
                    className="form-control fs-14 rounded-small border shadow-none"
                    id="weight"
                    name="weight"
                    value={boxDetails.weight}
                    onChange={handleChange}
                    placeholder="Weight"
                />
            </div>

            <div className="col-12">
                <button
                    type="submit"
                    disabled={!isEmpty(formErrors)}
                    className="btn btn-main rounded-small fs-15"
                >
                    Add Box
                </button>
            </div>
        </form>
    );
};

export default BoxDetailsForm;
