import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Config, loadLocales } from "@utils/index";

export const initI18n = async () => {
    const resources = await loadLocales();
    const config = new Config();
    const language = (await config.getUiConfig()).language;

    i18n.use(initReactI18next).init({
        resources,
        fallbackLng: Object.keys(resources),
        interpolation: { escapeValue: false },
        lng: language,
        load: "currentOnly",
    });
};
