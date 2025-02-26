import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";
import { useEffect } from "react";
import { resourceDir } from "@tauri-apps/api/path";
import { listen } from "@tauri-apps/api/event";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { ProgressBar } from "@modules/index";

interface DownloadState {
    progress: number;
    message: string;
    stats: string | undefined;
    isDownloading: boolean;
    isExtracting: boolean;
    isDownloaded: boolean;
    setProgress: (progress: number) => void;
    setStats: (stats: string | undefined) => void;
    setMessage: (message: string) => void;
    setDownloaded: (value: boolean) => void;
    startDownload: () => void | boolean;
    startExtract: () => void;
    stopDownload: () => void;
}

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
    startDownload: () => {set({ isDownloading: true, progress: 0, message: "Starting download..." })},
    startExtract: () => set({ isExtracting: true, message: "Extracting files..." }),
    stopDownload: () => set({ isDownloading: false, isExtracting: false, message: "Done!" }),
}));

const FILE_COUNT = 8; //8
//const BASE_URL = "https://huggingface.co/CloudTron/Beyond-2089329/resolve/main/Beyond_Release-2089329-32_os_prod_cbt.7z";
const BASE_URL = "https://beyond.hg-cdn.com/uXUuLlNbIYmMMTlN/0.5/update/6/1/Windows/0.5.28_U1mgxrslUitdn3hb/packs/Beyond_Release-2089329-32_os_prod_cbt.zip";
const FILE_NAME = "Beyond_Release-2089329-32_os_prod_cbt.zip";

const DownloadManager = () => {
    const { progress, message, isDownloading, setProgress, setMessage, startDownload, startExtract, stopDownload, stats, setStats, setDownloaded } = useDownloadStore();

    useEffect(() => {
        const unlistenDownload = listen("download_progress", (event: any) => {
            const [progress, speed, totalSize] = event.payload;
            setProgress(progress);
            setMessage("Downloading resources...")
            setStats(`${progress.toFixed(2)}% (${speed > 1024 ? (speed / 1024).toFixed(2) + " MB/s" : speed + " KB/s"}) | Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
        });

        const unlistenExtract = listen("extract_progress", (event: any) => {
            const [progress, copiedFiles, totalFiles] = event.payload;
            setProgress(progress);
            setMessage("Unpacking data, please wait...")
            setStats(`Copied data: ${copiedFiles}/${totalFiles}`)
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

    const downloadAndExtract = async () => {
        const RESOURCE_PATH = await resourceDir();
        startDownload();
        for (let i = 1; i <= FILE_COUNT; i++) {
            const fileUrl = `${BASE_URL}.${String(i).padStart(3, "0")}`;
            //const fileUrl = BASE_URL;
            //const filePath = `${RESOURCE_PATH}/temp/${fileUrl.split("/").pop()}`;

            setMessage(`Downloading file ${i}/${FILE_COUNT}...`);
            try {
                await invoke("download_file", { url: fileUrl, resourcePath: RESOURCE_PATH });
                continue
            } catch (error) {
                setMessage(`Error downloading file ${i}: ${error}`);
                sendNotification({title: "Downloading failed", body: `Error downloading file ${i}: ${error}`});
                stopDownload();
                return;
            }
        }

        startExtract();
        // setVisible(false);
        setStats(undefined);
        try {
            for(let i = 1; i <= FILE_COUNT; i++) {
                const fileName = `${FILE_NAME}.${String(i).padStart(3, "0")}`;
                await invoke("extract_archive", {
                    archivePath: `${RESOURCE_PATH}/temp/${fileName}`,
                    //archivePath: `${RESOURCE_PATH}/temp/test.7z`,
                    extractPath: `${RESOURCE_PATH}/EndField Game`,
                    sevenZipPath: `${RESOURCE_PATH}/7z/7z.exe`,
                });
            }
        } catch (error) {
            setMessage(`Extraction failed: ${error}`);
            sendNotification({title: "Installation failed", body: `Extraction failed: ${error}`});
            stopDownload();
        }
        sendNotification({title: "BlobField Launcher"});
        setDownloaded(true);
    };

    return (
        <div className="w-full flex flex-col ">
            {isDownloading && <ProgressBar style="w-full" progress={progress} message={message} stats={stats} visible={true} />}
        </div>
    );
};

export default DownloadManager;  