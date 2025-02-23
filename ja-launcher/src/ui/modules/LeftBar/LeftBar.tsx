import clsx from "clsx";
import { FaPlus } from "react-icons/fa6";

const LeftBar = () => {
    const className = clsx('absolute bg-black/75 h-full w-[64px] flex flex-col justify-center place-items-center gap-4 z-40');
    return(
        
        <div className={className}>
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
            <FaPlus className="text-white hover:text-gray-200 w-[48px] h-[48px] rounded-md drop-shadow-lg transition duration-150 cursor-pointer"/>
        </div>
    );
}

export default LeftBar;