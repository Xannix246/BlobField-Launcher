import { exists, mkdir, BaseDirectory, writeFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";

async function init() {
  const gameDir = await exists("EndField Game", {
    baseDir: BaseDirectory.Resource,
  });
  const tempDir = await exists("temp", { baseDir: BaseDirectory.Resource });
  const zDir = await exists("7z", { baseDir: BaseDirectory.Resource });

  !gameDir && (await mkdir("EndField Game", { baseDir: BaseDirectory.Resource }));
  !tempDir && (await mkdir("temp", { baseDir: BaseDirectory.Resource }));
  !zDir && await mkdir("7z", { baseDir: BaseDirectory.Resource });

  if (!await exists("7z/7z.exe", { baseDir: BaseDirectory.Resource })) {
    const url = "https://www.7-zip.org/a/7zr.exe";
    console.log("Downloading 7-Zip CLI...");
    const response = await fetch(url, { method: "GET" });
    const data = new Uint8Array(await response.arrayBuffer());

    if (!response.ok) {
      throw new Error(`Error while loading: ${response.status}`);
    }

    await writeFile(`7z/7z.exe`, new Uint8Array(data), {
        baseDir: BaseDirectory.Resource
    });
  }
}

export default init;
