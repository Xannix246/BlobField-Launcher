import { openUrl } from "@tauri-apps/plugin-opener";
import Config from "@utils/ConfigManager";

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
                value: (await new Config().getUiConfig()).enableLeftBar,
                onChange: async (newValue) => {
                    await new Config().setUiConfig({ enableLeftBar: newValue as boolean });
                }
            },
            { 
                type: "select", 
                label: "Left bar content", 
                labelStyle: "flex-1",
                containerStyle: "flex",
                options: ["notes", "news", "none"], 
                style: "flex-2 w-full h-[42px] bg-white rounded-lg inset-shadow-sm inset-shadow-gray-200 outline-none",
                value: (await new Config().getUiConfig()).leftBarContent,
                onChange: async (newValue) => {
                    await new Config().setUiConfig({ leftBarContent: newValue as "notes" | "news" | "none" });
                }
            },
            {
                type: "toggle", 
                label: "Hide logo",
                labelStyle: "flex-1",
                style: "flex-2 w-full h-[42px] bg-black rounded-lg inset-shadow-sm inset-shadow-gray-200 outline-none",
                containerStyle: "flex justify-center items-center place-content-center",
                value: (await new Config().getUiConfig()).hideLogo,
                onChange: async (newValue) => {
                    await new Config().setUiConfig({ hideLogo: newValue as boolean });
                }
            },
            {
                type: "toggle", 
                label: "Hide news images",
                labelStyle: "flex-1",
                style: "flex-2",
                containerStyle: "flex",
                value: (await new Config().getUiConfig()).hideNewsImages,
                onChange: async (newValue) => {
                    await new Config().setUiConfig({ hideNewsImages: newValue as boolean });
                }
            },
            {
                type: "toggle", 
                label: "Hide news",
                labelStyle: "flex-1",
                style: "flex-2",
                containerStyle: "flex",
                value: (await new Config().getUiConfig()).hideNews,
                onChange: async (newValue) => {
                    await new Config().setUiConfig({ hideNews: newValue as boolean });
                }
            }
        ],
        style: "p-2"
    },
    {
        name: "General",
        settings: [
            { type: "info", value: "Work in progress"}
        ],
        style: "p-2"
    },
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
