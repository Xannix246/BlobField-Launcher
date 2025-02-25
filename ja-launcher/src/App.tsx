import { useEffect, useState } from "react";
import "./css/App.css";
import "./css/text.css";
import Button from "./ui/base/Button/Button";
import LeftBar from "./ui/modules/LeftBar/LeftBar";
import NewsBlock from "./ui/modules/NewsBlock/NewsBlock";
import ProgressBar from "./ui/modules/ProgressBar/ProgressBar";
import TopBar from "./ui/modules/TopBar/TopBar";
import { CgMenu } from "react-icons/cg";
import { invoke } from "@tauri-apps/api/core";
import GameButton from "./ui/modules/GameButton";

const App = () => {
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        async function fetchConfig() {
            try {
                const data = await invoke<Config>("read_config");
                setConfig(data);
                console.log(data);
            } catch (error) {
                console.error("Ошибка при чтении конфигурации:", error);
            }
        }
        fetchConfig();
    }, []);

    // const saveConfig = async () => {
    //     try {
    //         await invoke("write_config", { config: { game_directory: "J:\\endfield\\EndField Launcher\\EndField Game", is_installed: true } });
    //         console.log("Конфиг сохранён!");
    //         console.log(config);
    //     } catch (error) {
    //         console.error("Ошибка при записи конфигурации:", error);
    //     }
    // };

    return (
        <div className="h-screen w-full bg-[url(/src/assets/base_bg.jpg)] bg-center bg-no-repeat bg-cover font-default">
            <TopBar />
            <LeftBar />
            <div className="absolute bottom-0 right-0 my-10 z-10 flex flex-nowrap justify-end items-center place-items-center gap-20 w-[90%]">
                {!config?.is_installed && <ProgressBar progress={66} style="" />}
                <div className="bg-transparent rounded-full overflow-hidden w-fit h-fit mr-10">
                    <div className="rounded-full shadow-inner border border-gray-500 flex">
                        {/* <Button
                            color="yellow" style="hover:bg-[#cccc00] cursor-pointer transition duration-150"
                            onClick={async () => {
                                if(config?.is_installed) {
                                    await invoke("run_game");
                                } else {
                                    await saveConfig();
                                }
                            }}
                        >{config?.is_installed ? "Run game" : "Install game"}</Button> */}
                        <GameButton />
                        <Button color="yellow" style="hover:bg-[#cccc00] cursor-pointer transition duration-150">
                            <CgMenu className="w-[24px] h-[24px]" />
                        </Button>
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
        </div>
    );
}

export default App;
