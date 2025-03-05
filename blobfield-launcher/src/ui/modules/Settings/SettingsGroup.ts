import { openUrl } from "@tauri-apps/plugin-opener";
import { relaunch } from "@tauri-apps/plugin-process";
import Config from "@utils/ConfigManager";
import { i18n } from "i18next";

const getUiConfig = async () => {
    const config = await new Config().getUiConfig();
    return config;
};

export const getSettingsConfig = async (t: Function, languages: string[], i18n: i18n, setSelectedGroup: (value: string) => void): Promise<SettingsGroup[]> => {
    const config = await getUiConfig();
    const languagesMap: Record<string, string> = Object.fromEntries(
        languages.map(lang => [t(lang), lang])
    );
    
    
    return [
        {
            name: t("interface"),
            settings: [
                { type: "info", label: t("interface label"), labelStyle: "text-xl font-default ml-8" },
                {
                    type: "toggle",
                    label: t("enable bar"),
                    labelStyle: "flex-1",
                    style: "flex-2",
                    containerStyle: "flex",
                    value: config.enableLeftBar,
                    onChange: async (newValue) => {
                        await new Config().setUiConfig({ enableLeftBar: newValue as boolean });
                    }
                },
                {
                    type: "select",
                    label: t("bar content"),
                    labelStyle: "flex-1",
                    containerStyle: "flex",
                    options: [t("type notes"), t("type news"), t("type none")],
                    style: "flex-2 w-full h-[42px] bg-white rounded-lg inset-shadow-sm inset-shadow-gray-200 outline-none",
                    value: config.leftBarContent,
                    onChange: async (newValue) => {
                        newValue == t("type notes") && (newValue = "notes");
                        newValue == t("type news") && (newValue = "news");
                        newValue == t("type none") && (newValue = "none");
                        await new Config().setUiConfig({ leftBarContent: newValue as "notes" | "news" | "none" });
                    }
                },
                {
                    type: "toggle",
                    label: t("hide logo"),
                    labelStyle: "flex-1",
                    style: "flex-2 w-full h-[42px] bg-black rounded-lg inset-shadow-sm inset-shadow-gray-200 outline-none",
                    containerStyle: "flex justify-center items-center place-content-center",
                    value: config.hideLogo,
                    onChange: async (newValue) => {
                        await new Config().setUiConfig({ hideLogo: newValue as boolean });
                    }
                },
                {
                    type: "toggle",
                    label: t("hide images"),
                    labelStyle: "flex-1",
                    style: "flex-2",
                    containerStyle: "flex",
                    value: config.hideNewsImages,
                    onChange: async (newValue) => {
                        await new Config().setUiConfig({ hideNewsImages: newValue as boolean });
                    }
                },
                {
                    type: "toggle",
                    label: t("hide news"),
                    labelStyle: "flex-1",
                    style: "flex-2",
                    containerStyle: "flex",
                    value: config.hideNews,
                    onChange: async (newValue) => {
                        await new Config().setUiConfig({ hideNews: newValue as boolean });
                    }
                },
                {
                    type: "info",
                    value: t("restart"),
                    style: "p-3 bg-ak-yellow rounded-lg transition duration-150 hover:bg-[#cccc00] cursor-pointer",
                    containerStyle: "flex float-right",
                    onEvent: relaunch
                }
            ],
            style: "p-2"
        },
        {
            name: t("general"),
            settings: [
                { type: "info", label: t("general label"), labelStyle: "text-xl font-default ml-8" },
                {
                    type: "select",
                    label: t("select language"),
                    labelStyle: "flex-1",
                    containerStyle: "flex",
                    options: languages.map(language => t(language)),
                    style: "flex-2 w-full h-[42px] bg-white rounded-lg inset-shadow-sm inset-shadow-gray-200 outline-none",
                    value: t(config.language),
                    onChange: async (newValue) => {
                        const selectedLang = languagesMap[newValue as string];
                        await new Config().setUiConfig({ language: selectedLang });
                        await i18n.changeLanguage(selectedLang);
                        setSelectedGroup(t("general"));
                    }
                },
                { type: "info", value: t("wip") }
            ],
            style: "p-2"
        },
        {
            name: t("about"),
            settings: [
                { type: "info", value: t("awesome launcher"), style: "text-center" },
                {
                    type: "info",
                    value: ("github link"),
                    style: "text-center cursor-pointer hover:text-ak-yellow hover:underline w-fit",
                    onEvent: async () => await openUrl("https://github.com/Xannix246/BlobField-Launcher"),
                    containerStyle: "flex justify-center"
                }
            ],
            style: "p-2"
        }
    ];
};
