import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useState, useEffect } from "react";
import { CgMenu } from "react-icons/cg";
import { exists, BaseDirectory, readDir } from '@tauri-apps/plugin-fs';
import { getFullPath, useDownloadStore } from "@utils/index";
import { Button } from "@base/index";
import clsx from "clsx";

export default function GameButton() {
    const { startDownload, isDownloaded, isDownloading } = useDownloadStore();
    const [isRunning, setIsRunning] = useState(false);
    const [isInstalled, setInstalled] = useState(false);
    const [hasArchive, setHasArchive] = useState(false);
    
    useEffect(() => {
        const listenForGameEvents = async () => {
            setInstalled(await exists(await getFullPath()));

            const dir = await readDir('temp', { baseDir: BaseDirectory.Resource });
            setHasArchive(dir.length > 0 ? true : false);
            await listen("game_started", (event) => {
                setIsRunning(event.payload as boolean);
            });
        };

        listenForGameEvents();
    }, []);

    useEffect(() => {
        setInstalled(true);
    }, [isDownloaded])

    const startGame = async () => {
        try {
            await invoke("run_game", { gamePath: await getFullPath() });
        } catch (error) {
            console.error(error);
        }
    };

    const className = clsx("hover:bg-[#cccc00] w-full cursor-pointer transition duration-150 disabled:cursor-not-allowed disabled:bg-[#cccc00]")

    return (
        <div className="w-full flex">
            {
                isInstalled ? (
                    <Button
                        color="yellow"
                        style={className}
                        disabled={isRunning}
                        onClick={startGame}
                    >{isRunning ? "Game is running" : "Run game"}</Button>
                ) : (
                    <Button
                        color="yellow"
                        style={className}
                        disabled={isDownloading}
                        onClick={startDownload}
                    >{isDownloading ? "Installing" : (hasArchive ? "Continue download" : "Install game")}</Button>
                )
            }
            <Button
                color="yellow" style="hover:bg-[#cccc00] cursor-pointer transition duration-150"
                onClick={async () => {
                    
                }}
            >
                <CgMenu className="w-[24px] h-[24px]" />
            </Button>
        </div>
    );
}
