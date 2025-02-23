import { RiCloseLargeFill } from "react-icons/ri";
import { FaRegWindowMinimize } from "react-icons/fa";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { exit } from '@tauri-apps/plugin-process';

const TopBar = () => {

    return(
        <div 
            className="absolute w-full h-[64px] bg-gradient-to-b from-black/50 z-[-5px] flex justify-end"
            style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
        >
            <FaRegWindowMinimize 
                className="w-[24px] h-[24px] m-4 hover:text-gray-300 transition duration-150"
                onClick={() => getCurrentWindow().minimize}
            />
            <RiCloseLargeFill 
                className="w-[24px] h-[24px] m-4 hover:text-gray-300 transition duration-150" 
                onClick={() => exit(0)}
            />
        </div>
    );
}

export default TopBar;