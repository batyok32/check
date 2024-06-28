import Link from "next/link";

export default function HelpColumnItem({ item, preRoute }) {
    return (
        <Link
            key={item?.id}
            href={`${preRoute ? preRoute : ""}/help/${item?.id}`}
            className="fs-15 p-2  px-3"
        >
            <div>
                <img className="img-fluid" src={item?.image} alt="" />
            </div>
            <div className="fw-bold mb-2 mt-3 text-center">{item?.name}</div>
            <div className="truncate-overflow-2 fs-14">
                {item?.short_description}
            </div>
        </Link>
    );
}
