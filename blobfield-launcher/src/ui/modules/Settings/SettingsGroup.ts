import { openUrl } from "@tauri-apps/plugin-opener";
import Config from "@utils/ConfigManager";

const config = await new Config().getUiConfig();

export const settingsConfig: SettingsGroup[] = [
    {
        name: "Interface",
        settings: [
            {type: "info", label: "Main interface settings", labelStyle: "text-xl font-default ml-8"},
            {
                type: "toggle", 
                label: "Enable left bar",
                labelStyle: "flex-1",
                style: "flex-2",
                containerStyle: "flex",
                value: config.enableLeftBar
            },
            { 
                type: "select", 
                label: "Left bar content", 
                labelStyle: "flex-1",
                containerStyle: "flex",
                options: ["notes", "news", "none"], 
                style: "flex-2 w-full h-[42px] bg-white rounded-lg inset-shadow-sm inset-shadow-gray-200 outline-none",
                value: config.leftBarContent
            },
            {
                type: "toggle", 
                label: "Hide logo",
                labelStyle: "flex-1",
                style: "flex-2 w-full h-[42px] bg-black rounded-lg inset-shadow-sm inset-shadow-gray-200 outline-none",
                containerStyle: "flex justify-center items-center place-content-center",
                value: config.hideLogo
            },
            {
                type: "toggle", 
                label: "Hide news images",
                labelStyle: "flex-1",
                style: "flex-2",
                containerStyle: "flex",
                value: config.hideNewsImages
            },
            {
                type: "toggle", 
                label: "Hide news",
                labelStyle: "flex-1",
                style: "flex-2",
                containerStyle: "flex",
                value: config.hideNews
            }
        ],
        style: "p-2"
    },
    {
        name: "General",
        settings: [
            // { type: "toggle", label: "blob", value: false }
            { type: "info", value: "Work in progress"}
        ],
        style: "p-2"
    },
    // {
    //     name: "Awesome settings",
    //     settings: [
    //         { type: "select", label: "blob", value: "blob_id", options: ["yes", "no"], style: "w-full h-[42px] bg-white rounded-lg inset-shadow-sm inset-shadow-gray-200 outline-none" }
    //     ],
    //     style: "p-2"
    // },
    {
        name: "About",
        settings: [
            { type: "info", value: "Awesome launcher 3000", style: "text-center" },
            { 
                type: "info", 
                value: "Github link", 
                style: "text-center cursor-pointer hover:text-ak-yellow hover:underline w-fit", 
                onEvent: async () => await openUrl("https://github.com/Xannix246/BlobField-Launcher"),
                containerStyle: "flex justify-center"
            }
        ],
        style: "p-2"
    }
];