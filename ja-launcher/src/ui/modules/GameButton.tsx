import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import Button from "../base/Button/Button";
import clsx from "clsx";

export default function GameButton() {
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const checkProcess = async () => {
            console.log("ok");
            const running = await invoke<boolean>("is_game_running");
            setIsRunning(running);
        };

        checkProcess();
        const interval = setInterval(checkProcess, 5000); // Проверять каждые 5 сек
        return () => clearInterval(interval);
    }, []);

    const startGame = async () => {
        try {
            await invoke("run_game");
        } catch (error) {
            console.error(error);
        }
    };

    const className = clsx("hover:bg-[#cccc00] cursor-pointer transition duration-150 disabled:cursor-not-allowed disabled:bg-[#cccc00]")

    return (
        // <button onClick={startGame} disabled={isRunning} className="btn">
        //   {isRunning ? "Игра уже запущена" : "Запустить игру"}
        // </button>
        <Button
            color="yellow" 
            style={className}
            disabled={isRunning}
            onClick={startGame}
        >{isRunning ? "Game is running" : "Run game"}</Button>
    );
}
