import React, { useState, useEffect } from "react";

function DraggableDiv({
    children,
    containerWidth,
    givingValue,
    duration,
    onMove,
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startX, setStartX] = useState(0);
    // const [timeframe, setTimeframe] = useState(0);
    const divWidth = 15; // Width of the draggable div

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                // Here i need to know is he going to left or right

                let newX = e.clientX - startX;
                // Constrain the movement within the container
                newX = Math.max(0, Math.min(newX, containerWidth - divWidth));
                onMove(newX, containerWidth, divWidth);

                // Before setting position we need to set handleChangeTime and after that set the value of x and y as values of startTime and endTime
                // const direction = newX > position.x ? 'right' : 'left';

                // setPosition({ x: newX, y: 0 });
                // Update the timeframe based on the position
                // setTimeframe(
                //     Math.floor((newX / (containerWidth - divWidth)) * 100)
                // );
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, startX]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX - position.x);
    };

    // Update the position of the div when startTime changes
    useEffect(() => {
        const newX = (givingValue / duration) * (containerWidth - divWidth);
        setPosition({ x: newX, y: 0 });
        // setTimeframe(Math.floor((newX / (containerWidth - divWidth)) * 100));
    }, [givingValue, duration, containerWidth, divWidth]);

    return (
        <div
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                width: `${divWidth}px`,
                height: "100%",
                cursor: "grab",
            }}
            className="bg-blur-main shadow "
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    );
}

export default DraggableDiv;
