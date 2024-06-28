function CategoryItem({ img, title, className, clickHandler, key }) {
    return (
        <div
            key={key}
            role="button"
            className={`d-flex py-2 px-1  align-items-center flex-column ${
                className && className
            } `}
            onClick={clickHandler}
        >
            <div className="rounded-small d-flex justify-content-center align-items-center p-1 overflow-hidden">
                <img className="img-fluid" src={img} alt="" />
            </div>
            <div className="text-center mt-1 fs-15 fw-medium truncate-overflow-2">
                {title}
            </div>
        </div>
    );
}

export default CategoryItem;
