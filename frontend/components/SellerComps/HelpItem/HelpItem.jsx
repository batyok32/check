import Link from "next/link";

export default function HelpItem({ item, preRoute }) {
    return (
        <Link
            href={`${preRoute ? preRoute : ""}/help/category/${item?.id}`}
            className="px-2 py-2 fs-14 "
            role="button"
        >
            <div style={{ borderRadius: "50%" }} className=" p-2">
                <img
                    style={{ width: 100, height: 100 }}
                    src={item?.image}
                    className="rounded-5"
                    alt=""
                />
            </div>
            <div className="text-center mt-1">{item?.title}</div>
        </Link>
    );
}
