import Image from "next/image";

function MenuCategoryItem({ img, title }) {
    return (
        <div
            style={{ width: "140px" }}
            className="col-auto d-flex py-2  align-items-center flex-column"
        >
            <div
                style={{
                    borderRadius: "50%",
                    width: "100px",
                    height: "100px",
                }}
                className="bg-main-50 d-flex justify-content-center align-items-center p-1 overflow-hidden"
            >
                <img className="img-fluid" src={`${img}`} alt="" />
            </div>
            <div className="text-center mt-1">{title ? title : "Cars"}</div>
        </div>
    );
}

export default MenuCategoryItem;
