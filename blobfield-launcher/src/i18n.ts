import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Config, loadLocales } from "@utils/index";

export const initI18n = async () => {
    const resources = await loadLocales();
    const config = new Config();
    const language = (await config.getUiConfig()).language;
    const languages = Object.keys(resources);

    i18n.use(initReactI18next).init({
        resources,
        fallbackLng: languages,
        interpolation: { escapeValue: false },
        lng: languages.includes(language as string) ? language : "en-US",
        load: "currentOnly",
    });
};
