function SideBarResizer({ startResizing }: { startResizing: () => void }) {
    return (
        <div
            className="sidebar-resizer h-full w-[0.2vw] hover:w-[1vw] cursor-col-resize flex-grow-0 flex-shrink-0 justify-self-end"
            onMouseDown={startResizing}
        />
    );
}

export default SideBarResizer;