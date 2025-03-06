import { join, resourceDir } from "@tauri-apps/api/path";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { open } from "@tauri-apps/plugin-dialog";
import { Config } from "@utils/index";
import { create } from "zustand";
import { exists, readFile } from "@tauri-apps/plugin-fs";

const config = new Config();

export const useUiStore = create<UiUpdateState>((set) => ({
    isUpdated: 1,
    setUpdated: (isUpdated) => set({ isUpdated })
}));

export async function getFullPath(): Promise<string> {
    try {
        return await join(await config.getValue<string>('gamePath'), await config.getValue<string>('gameExecutable'))
    } catch {
        return "";
    };
}

export const parseDate = (dateString: string): Date => {
    return new Date(dateString.replace(' ', 'T'));
};

export async function setDefaultDirectory() {
    await config.setValue("gamePath", await resourceDir() + "\\EndField Game");
    await config.setValue("gameExecutable", "Endfield_TBeta_OS.exe");
    sendNotification({ title: `Default path changed`, body: `Path changed to ${await getFullPath()}` });
}

export async function customDirectory() {
    try {
        const customPath = await open({ directory: true, multiple: false });
        
        if(customPath === null) return;

        config.setValue("gamePath", customPath as string);
        console.log("edited");
    } catch(err) {
        console.log(err);
    }
}

export async function getInstallerConfig(): Promise<InstallerConfig> {
    const response = await fetch("https://raw.githubusercontent.com/Xannix246/BlobField-Launcher/refs/heads/main/online-data/config.json", { method: "GET" });
    return await JSON.parse(await response.text());
}

export async function getBgUrl(): Promise<string> {
    const image: string = await config.getValue("bgImage");
    try {
        if (await exists(image)) {
            const data = await readFile(image);
            const type = image.endsWith(".jpg") ? "jpg" : image.endsWith(".jpeg") ? "jpeg" : "png";
            const blob = new Blob([data], { type: `image/${type}` });
            return URL.createObjectURL(blob);
        }
    } catch {}

    const getImage = await fetch("https://raw.githubusercontent.com/Xannix246/BlobField-Launcher/main/online-data/default.jpg", { method: "HEAD" });
    if(getImage.ok) {
        return getImage.url;
    }

    return "/src/assets/base_bg.jpg";
}