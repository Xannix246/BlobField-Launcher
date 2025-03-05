import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";
import { useEffect, useState } from "react";
import { resourceDir } from "@tauri-apps/api/path";
import { listen } from "@tauri-apps/api/event";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { ProgressBar } from "@modules/index";
import { getInstallerConfig } from "@utils/index";
import { useTranslation } from "react-i18next";

export const useDownloadStore = create<DownloadState>((set) => ({
    progress: 0,
    message: "Initializing...",
    stats: "",
    isDownloading: false,
    isExtracting: false,
    isDownloaded: false,
    setProgress: (progress) => set({ progress }),
    setStats: (stats) => set({ stats }),
    setMessage: (message) => set({ message }),
    setDownloaded: (value) => set({ isDownloaded: value}),
    startDownload: () => {set({ isDownloading: true, progress: 0, message: "" })},
    startExtract: () => set({ isExtracting: true, message: "" }),
    stopDownload: () => set({ isDownloading: false, isExtracting: false, message: "Done!" }),
}));

const DownloadManager = () => {
    const { progress, message, isDownloading, setProgress, setMessage, startDownload, startExtract, stopDownload, stats, setStats, setDownloaded } = useDownloadStore();
    const [visible, setVisible] = useState(true);
    const [BaseConfig, setBaseConfig] = useState<InstallerConfig>();
    const fileCount = BaseConfig?.FILE_COUNT;
    const baseUrl = BaseConfig?.BASE_URL;
    const fileName = BaseConfig?.FILE_NAME;
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            setBaseConfig(await getInstallerConfig());
            setMessage(t("start download"));
        })();
    }, []);

    useEffect(() => {
        const unlistenDownload = listen("download_progress", (event: any) => {
            const [progress, speed, totalSize] = event.payload;
            setProgress(progress);
            setMessage(t("download message"));
            setStats(t("download stat", {progress: progress.toFixed(2), speed: speed > 1024 ? (speed / 1024).toFixed(2) + " MB/s" : speed + " KB/s", totalSize: (totalSize / 1024 / 1024).toFixed(2)}));
        });

        const unlistenExtract = listen("extract_progress", (event: any) => {
            setMessage(t("unpacking"));
            setStats("");
            if (event.payload === "Extraction complete!") {
                stopDownload();
            }
        });

        return () => {
            unlistenDownload.then((f) => f());
            unlistenExtract.then((f) => f());
        };
    }, []);


    useEffect(() => {
        if (isDownloading) downloadAndExtract();
    }, [isDownloading])

    async function downloadAndExtract() {
        const resourcePath = await resourceDir();
        startDownload();
        for (let i = 1; i <= (fileCount as number); i++) {
            //const fileUrl = `${BASE_URL}.${String(i).padStart(3, "0")}`;
            const fileUrl = baseUrl;

            setMessage(t("download progress", {file: i, fileCount}));
            try {
                await invoke("download_file", { url: fileUrl, resourcePath: resourcePath });
                continue
            } catch (error) {
                sendNotification({title: t("notification download error title"), body: t("notification download error body", {file: i, error})});
                stopDownload();
                return;
            }
        }

        startExtract();
        setMessage(t("start extract"));
        setVisible(false);
        setStats(undefined);
        try {
            for(let i = 1; i <= (fileCount as number); i++) {
                //const fileName = `${fileName}.${String(i).padStart(3, "0")}`;
                await invoke("extract_archive", {
                    archivePath: `${resourcePath}/temp/${fileName}`,
                    //archivePath: `${RESOURCE_PATH}/temp/test.7z`,
                    extractPath: `${resourcePath}/EndField Game`,
                    sevenZipPath: `${resourcePath}/7z/7z.exe`,
                });
                sendNotification({title: "BlobField Launcher", body: t("notification download finish")});
                setDownloaded(true);
            }
        } catch (error) {
            setMessage(`Extraction failed: ${error}`);
            sendNotification({title: t("notification download fail"), body: t("notification download fail body", {error})});
            stopDownload();
        }
    };

    return (
        <div className="w-full flex flex-col ">
            {isDownloading && <ProgressBar style="w-full" progress={progress} message={message} stats={stats} visible={visible} />}
        </div>
    );
};

export default DownloadManager;  