import "./css/App.css";
import "./css/text.css";
import LeftBar from "./ui/modules/LeftBar/LeftBar";
import NewsBlock from "./ui/modules/NewsBlock/NewsBlock";
import TopBar from "./ui/modules/TopBar/TopBar";
import GameButton from "./ui/modules/GameButton";
import { getVersion } from '@tauri-apps/api/app';
import { useEffect, useState } from "react";
import Settings from "./ui/modules/Settings/Settings";


const App = () => {
    const [version, setVersion] = useState<string>("");
    const ver = async () => {
        setVersion(await getVersion());
    }

    useEffect(() => {
        ver();
    }, []);

    return (
        <div className="h-screen w-full bg-[url(/src/assets/base_bg.jpg)] bg-center bg-no-repeat bg-cover font-default">
            <Settings />
            <TopBar />
            <LeftBar />
            <div className="absolute bottom-0 right-0 my-10 z-10 flex flex-nowrap justify-end items-center place-items-center gap-20 w-[90%]">
                <div className="bg-transparent rounded-full overflow-hidden w-fit h-fit mr-10">
                    <div className="rounded-full shadow-inner border border-gray-500 flex">
                        <GameButton />
                    </div>
                </div>
            </div>
            <NewsBlock />

            <div className="absolute w-full h-[512px] bottom-0 right-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] from-25%" />
                <div
                    className="absolute inset-0 bg-[url('/src/assets/heights.png')] bg-no-repeat bg-cover bg-bottom"
                    style={{
                        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
                        maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
                    }}
                />
            </div>
            <div className="absolute right-0 bottom-0 m-2 font-second font-light text-xs">
                Launcher version: {version}
            </div>
        </div>
    );
}

export default App;
