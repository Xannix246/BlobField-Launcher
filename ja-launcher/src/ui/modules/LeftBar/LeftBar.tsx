import clsx from "clsx";
import { IoIosArrowForward } from "react-icons/io";
import ContextMenu from "../../../utils/ContextMenu";
import { useEffect, useRef, useState } from "react";

const LeftBar = () => {
    const [open, setOpen] = useState(false);
    const items = [
        { label: "Edit", onClick: () => console.log("click") },
        { label: "Delete", onClick: () => console.log("click") }
    ];
    const menuRef = useRef<HTMLDivElement | null>(null);

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);
    
    const className = clsx(
        'absolute bg-black/75 h-full w-[390px] translation duration-300 ease-[cubic-bezier(0.8,0.05,0.05,0.8)] flex flex-col z-40 bg-[url(/src/assets/bg.png)] bg-center bg-no-repeat bg-cover',
        open ? 'left-0' : 'left-[-326px]'
    );
    const arrowClassName = clsx(
        "w-[42px] h-[42px] m-2 translation duration-300 ease-[cubic-bezier(0.8,0.05,0.05,0.8)] hover:bg-white/25 rounded-lg",
        open && "-rotate-180"
    );
    return (
        <div ref={menuRef} className={className}>
            <div className="place-items-end">
            <IoIosArrowForward className={arrowClassName} onClick={() => setOpen(!open)}/>
            </div>
            <div className="overflow-y-auto scrollbar-hidden grid gap-4 p-20">
                <ContextMenu items={items} style="overflow-y-auto scrollbar-hidden grid gap-4 text-center">
                    <div className="bg-black/50 p-5 rounded-lg">
                        Originally there was supposed to be presets here, but there aren't ¯\\_(ツ)_/¯
                        <br/>
                        <br/>
                        Maybe I'll do something here, maybe not
                    </div>
                </ContextMenu>
            </div>
        </div>
    );
}

export default LeftBar;