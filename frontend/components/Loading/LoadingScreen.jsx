export default function LoadingScreen() {
    return (
        <div
            className="d-flex bg-gray-50 justify-content-center align-items-center min-vh-100 min-vw-100 position-absolute top-0 "
            style={{ zIndex: 1000 }}
        >
            <div
                class="spinner-border text-main bg-white"
                style={{ padding: 100 }}
                role="status"
            ></div>
            <div className="d-flex position-absolute align-items-center ">
                <img
                    src="/logo2.jpg"
                    alt=""
                    style={{ height: 40 }}
                    // fill={true}
                    // className="w-auto"
                />{" "}
                <img
                    src="/logo3.jpg"
                    alt=""
                    style={{ marginLeft: "-8px", height: 30 }}
                />{" "}
            </div>
        </div>
    );
}
