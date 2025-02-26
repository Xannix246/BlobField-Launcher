import { create } from "zustand";
import { useEffect, useRef, useState } from "react";

interface SettingsStore {
    isOpen: boolean;
    open: (bool: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    isOpen: false,
    open: (bool: boolean) => set(({ isOpen: bool }))
}));

const Settings = () => {
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

    return (
        <div
            className={`${show ? "opacity-100 z-40" : "opacity-0 z-0"
                } transition-opacity duration-150 absolute w-full h-full bg-black/50 place-items-center content-center py-24 px-32 backdrop-blur-sm`}
        >
            <div ref={settingsRef} className="w-full h-full bg-white rounded-lg bg-[url(/src/assets/bg_settings.jpg)] bg-center bg-no-repeat bg-cover">
                <div className="w-[250px] h-full bg-black/15">

                </div>
                <div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
