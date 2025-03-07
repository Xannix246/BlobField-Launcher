import { ProgressBar } from "@modules/index";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { BaseDirectory, join, resourceDir } from "@tauri-apps/api/path";
import { readTextFile, writeFile } from "@tauri-apps/plugin-fs";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { Config, getInstallerConfig } from "@utils/index";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { create } from "zustand";


export const UseIntegrityStore = create<IntegrityState>((set) => ({
    progress: 0,
    message: "",
    stats: "",
    isScanning: false,
    needUpdate: false,
    setNeedUpdate: (needUpdate) => set({ needUpdate }),
    setProgress: (progress) => set({ progress }),
    setStats: (stats) => set({ stats }),
    setMessage: (message) => set({ message }),
    startScan: () => { set({ isScanning: true, progress: 0, message: "" }) },
    stopScan: () => set({ isScanning: false, message: "" }),
}));

const CheckFileIntegrity = () => {
    const { t } = useTranslation();

    const { progress, message, stats, isScanning, setProgress, setMessage, setStats, stopScan, needUpdate, setNeedUpdate } = UseIntegrityStore();
    const [visible, setVisible] = useState(true);
    const [files, setFiles] = useState("");
    const [BaseConfig, setBaseConfig] = useState<InstallerConfig>();
    const filesRef = useRef("");

    useEffect(() => {
        (async () => {
            setBaseConfig(await getInstallerConfig());
            setMessage(t("file check start"));
        })();
    }, []);

    useEffect(() => {
        const unlistenProgress = listen("integrity_progress", (event: any) => {
            const [progress, checked, totalFiles] = event.payload;
            setProgress(progress);
            setMessage(t("file checking"))
            setStats(t("file checking stat", {progress: progress.toFixed(2), checked, totalFiles }));
        });

        const unlistenDownload = listen("download_progress", (event: any) => {
            const [progress, speed] = event.payload;
            setVisible(true);
            setProgress(progress);
            setMessage(t("file downloading"));
            setStats(t("file downloading stat", {progress: progress.toFixed(2), speed: speed > 1024 ? (speed / 1024).toFixed(2) + " MB/s" : speed + " KB/s", current: filesRef.current}));
        });

        const unlistenExtract = listen("extract_progress", () => {
            setVisible(false);
            setMessage(t("unpacking"));
            setStats(t("unpacking stat", {current: filesRef.current}));
        });

        return () => {
            unlistenProgress.then((f) => f());
            unlistenDownload.then((f) => f());
            unlistenExtract.then((f) => f());
        };
    }, [])

    useEffect(() => {
        if (isScanning) checkFiles();
    }, [isScanning])

    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    async function checkFiles() {
        setVisible(true);
        const config = new Config();
        const resourcePath = await resourceDir();
        const gamePath = await config.getValue("gamePath");
        const manifest = await join(resourcePath, "rescue/manifest.json");
        const archivesPath = await join(resourcePath, "rescue/archives.json");

        try {
            const response = await fetch((BaseConfig as InstallerConfig).MANIFEST_URL, { method: "GET" });
            const data = new Uint8Array(await response.arrayBuffer());

            await writeFile("rescue/manifest.json", new Uint8Array(data), {
                baseDir: BaseDirectory.Resource,
            });
        } catch (err) {
            stopScan();
            return sendNotification({ title: t("notification failed"), body: `${err}` });
        }

        try {
            const response = await fetch((BaseConfig as InstallerConfig).ARCHIVES_TABLE, { method: "GET" });
            const data = new Uint8Array(await response.arrayBuffer());

            await writeFile("rescue/archives.json", new Uint8Array(data), {
                baseDir: BaseDirectory.Resource,
            });
        } catch (err) {
            stopScan();
            return sendNotification({ title: t("notification failed"), body: `${err}` });
        }

        const archives = JSON.parse((await readTextFile(archivesPath)));

        await invoke("check_integrity", { gameDir: gamePath, manifestPath: manifest }).then(async (res) => {
            const needToDownload: string[] = [];

            for (const [entry, file] of Object.entries<string[]>(archives)) {
                for (const archive of res as string[]) {
                    if (file.find(e => e.includes(archive))) {
                        needToDownload.push(entry);
                        break;
                    }
                }
            }

            try {
                for (let i = 0; i < needToDownload.length; i++) {
                    const archive = needToDownload[i];
                    setFiles(`${i + 1}/${needToDownload.length}`);
                    await invoke("download_file", {
                        url: `${(BaseConfig as InstallerConfig).RESTORE_FILES_URL}${archive}`,
                        resourcePath: resourcePath
                    });
                    await invoke("extract_archive", {
                        archivePath: `${resourcePath}/temp/${archive}`,
                        extractPath: gamePath,
                        sevenZipPath: `${resourcePath}/7z/7z.exe`,
                        manifestPath: manifest
                    });
                }

                stopScan();
                setMessage(t("file check done"));
                setVisible(false);
                !needUpdate && sendNotification({ title: t("notification completed body"), body: (res as Array<string>).length === 0 ? t("notification completed") : t("notification fixed", {count: (res as Array<string>).length}) });
                setNeedUpdate(false);
            } catch (err) {
                sendNotification({ title: t("nofification download failed"), body: `${err}` });
            }
        });
    }

    return (
        <div className="w-full flex flex-col">
            {isScanning && <ProgressBar style="w-full" progress={progress} message={message} stats={stats} visible={visible} />}
        </div>
    );
}

export default CheckFileIntegrity;