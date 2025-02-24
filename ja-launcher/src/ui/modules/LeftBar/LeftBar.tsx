import clsx from "clsx";
import { FaPlus } from "react-icons/fa6";
import ContextMenu from "../../../utils/ContextMenu";

const LeftBar = () => {
    const items = [
        { label: "Редактировать", onClick: () => console.log("Редактировать") },
        { label: "Удалить", onClick: () => console.log("Удалить") }
    ];

    const className = clsx('absolute bg-black/75 h-full w-[64px] flex flex-col justify-center place-items-center z-40');
    return (
        <div className={className}>
            <div className="overflow-y-auto scrollbar-hidden grid gap-4">
                <ContextMenu items={items} style="overflow-y-auto scrollbar-hidden grid gap-4">
                    <div className="w-[48px] h-[48px] rounded-md bg-gray-800 flex justify-center place-items-center text-[32px] text-bold cursor-pointer">
                        SC
                    </div>
                    <div className="w-[48px] h-[48px] rounded-md bg-gray-800 flex justify-center place-items-center text-[32px] text-bold cursor-pointer">
                        SC
                    </div>
                    <div className="w-[48px] h-[48px] rounded-md bg-gray-800 flex justify-center place-items-center text-[32px] text-bold cursor-pointer">
                        SC
                    </div>
                    <div className="w-[48px] h-[48px] rounded-md bg-gray-800 flex justify-center place-items-center text-[32px] text-bold cursor-pointer">
                        SC
                    </div>
                </ContextMenu>
                <FaPlus className="text-white hover:text-gray-200 w-[48px] h-[48px] rounded-md drop-shadow-lg transition duration-150 cursor-pointer" />
            </div>
        </div>
    );
}

export default LeftBar;