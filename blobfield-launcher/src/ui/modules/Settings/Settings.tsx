import { create } from "zustand";
import { useEffect, useRef, useState } from "react";
import { SettingsSubmodule } from "./SettingsSubmodule";
import { settingsConfig } from "./SettingsGroup";

interface SettingsStore {
    isOpen: boolean;
    open: (bool: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    isOpen: false,
    open: (bool: boolean) => set(({ isOpen: bool }))
}));

const Settings = () => {
    const [settingsTable, settingsData] = SettingsSubmodule(); //предположим, что так оно должно работать здесь
    const { isOpen } = useSettingsStore();
    const [show, setShow] = useState(false);
    const settingsRef = useRef<HTMLDivElement | null>(null);
    const handleClickOutside = (e: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
            useSettingsStore.getState().open(!isOpen);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            setTimeout(() => setShow(false), 10);
        }
    }, [isOpen]);


    useEffect(() => {
        if(show) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [show]);

    useEffect(() => {
        
    }, [settingsConfig, SettingsSubmodule]);

    return (
        <div
            className={`${show ? "opacity-100 z-40" : "opacity-0 z-0"
                } transition-opacity duration-150 absolute w-full h-full bg-black/50 place-items-center content-center py-24 px-32 backdrop-blur-sm overflow-clip`}
        >
            <div ref={settingsRef} className="relative w-full h-full bg-white rounded-lg bg-[url(/src/assets/bg_settings.jpg)] bg-center bg-no-repeat bg-cover flex">
                <div className="w-[250px] h-full bg-black/15 pt-5">
                    {settingsTable}
                </div>
                <div className="p-5 w-full overflow-y-auto text-black">
                    {settingsData}
                </div>
            </div>
        </div>
    );
};

export default Settings;
