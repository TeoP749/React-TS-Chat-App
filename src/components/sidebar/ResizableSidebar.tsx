import { useCallback, useEffect, useRef, useState } from "react";
import SideBarResizer from "./SideBarResizer";

function ResizableSidebar({ children, sidebarWidth, setSidebarWidth }: { children?: React.ReactNode, sidebarWidth: number, setSidebarWidth: (width: number) => void }) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback(
        (mouseMoveEvent: MouseEvent) => {
            if (isResizing && sidebarRef.current) {
                const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
                setSidebarWidth(newWidth);
            }
        },
        [isResizing, setSidebarWidth]
    );

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div className="flex h-full">
            <div
                ref={sidebarRef}
                style={{ width: sidebarWidth }}
                className="flex flex-col items-center w-1/4 justify-center h-full bg-base-200">
                {children ? children : <></>}
            </div>
            <SideBarResizer startResizing={startResizing} />
        </div>
    )
}

export default ResizableSidebar;