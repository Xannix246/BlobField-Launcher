import { join } from "@tauri-apps/api/path";
import { Config } from "@utils/index";

const config = new Config();

export async function getFullPath(): Promise<string> {
    try {
        return await join(await config.getValue<string>('gamePath'), await config.getValue<string>('gameExecutable'))
    } catch {
        return "";
    };
}