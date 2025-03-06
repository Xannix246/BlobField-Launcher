import { readDir, readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";

const LOCALES_PATH = "resources/locales";

export const loadLocales = async () => {
  try {
    const files = await readDir(LOCALES_PATH, { baseDir: BaseDirectory.Resource });

    const translations: Record<string, any> = {};
    for (const file of files) {
      if (file.name?.endsWith(".json")) {
        const lang = file.name.replace(".json", "");
        const content = await readTextFile(`${LOCALES_PATH}/${file.name}`, {
          baseDir: BaseDirectory.Resource,
        });
        translations[lang] = { translation: JSON.parse(content) };
      }
    }
    return translations;
  } catch (error) {
    console.error("Failed to load locales:", error);
    return {};
  }
}