"use client";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function LogoutButton({ children }) {
    const dispatch = useAppDispatch();
    // const closeBtnRef = useRef(null);
    const onSubmit = () => {
        // closeBtnRef.current.click();
        dispatch(logout());
    };
    return <div onClick={() => onSubmit()}>{children}</div>;
}
