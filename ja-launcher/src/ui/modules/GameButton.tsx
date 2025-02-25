import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { join } from '@tauri-apps/api/path';
import { LazyStore } from "@tauri-apps/plugin-store";
import { useState, useEffect } from "react";
import { CgMenu } from "react-icons/cg";
import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';
import Button from "../base/Button/Button";
import clsx from "clsx";
import Config from "../../utils/ConfigManager";

export default function GameButton() {
    const [isRunning, setIsRunning] = useState(false);
    const [isInstalled, setInstalled] = useState(false);
    const [isInstalling, setInstallation] = useState(false);

    useEffect(() => {
        const listenForGameEvents = async () => {
            const store = new LazyStore("./config.json")
            const gamePath = await store.get<string>('game-path');
            const gameExe = await store.get<string>('game-exe');
            setInstalled(await exists(await join(gamePath as string, gameExe as string), {
                baseDir: BaseDirectory.Resource,
            }))

            await listen("game_started", (event) => {
                setIsRunning(event.payload as boolean);
            });
        };

        listenForGameEvents();
    }, []);

    const startGame = async () => {
        try {
            const store = new LazyStore("./config.json");
            const gamePath = await store.get<string>('game-path');
            const gameExe = await store.get<string>('game-exe');

            await invoke("run_game", { gamePath: await join(gamePath as string, gameExe as string) });
        } catch (error) {
            console.error(error);
        }
    };

    const installation = async () => {
        setInstallation(true);
    };

    const className = clsx("hover:bg-[#cccc00] cursor-pointer transition duration-150 disabled:cursor-not-allowed disabled:bg-[#cccc00]")

    return (
        <>
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
                        disabled={isInstalling}
                        onClick={installation}
                    >{isInstalling ? "Installing" : "Install game"}</Button>
                )
            }
            <Button
                color="yellow" style="hover:bg-[#cccc00] cursor-pointer transition duration-150"
                onClick={async () => {
                    new Config().getLazyBlob();
                }}
            >
                <CgMenu className="w-[24px] h-[24px]" />
            </Button>
        </>
    );
}
