import { RiCloseLargeFill } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { VscChromeMinimize } from "react-icons/vsc";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

const TopBar = () => {
    const win = getCurrentWebviewWindow();
    return (
        <div
            className="absolute w-full h-[64px] bg-gradient-to-b from-black/50 z-[5px] flex justify-end"
            style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
        >
            <FiSettings
                className="w-[38px] h-[38px] p-2 m-1 hover:text-gray-300 transition duration-150 hover:bg-black/50 rounded-lg"
            />
            <VscChromeMinimize
                className="w-[38px] h-[38px] p-2 m-1 hover:text-gray-300 font-bold transition duration-150 hover:bg-black/50 rounded-lg"
                onClick={() => {
                    win?.minimize();
                }}
            />
            <RiCloseLargeFill
                className="w-[38px] h-[38px] p-2 m-1 hover:text-gray-300 transition duration-150 hover:bg-black/50 rounded-lg"
                onClick={() => win.close()}
            />
        </div>
    );
}

export default TopBar;