"use client";
export default function Page({ params }) {
    const { order_id } = params;
    return <div>Request refund form - {order_id}</div>;
}
