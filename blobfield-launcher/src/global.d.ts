declare type UiConfig = {
    enableLeftBar?: boolean;
    leftBarContent?: "notes" | "news" | "none";
    hideLogo?: boolean;
    hideNewsImages?: boolean;
    hideNews?: boolean;
}

declare type ImageSlider = {
    url: string;
    link?: string;
}

declare type Note = {
    id: string;
    data: string;
}

declare type News = {
    data: string;
    time: string;
    url?: string;
    image?: string;
    desc: string;
}

declare type Setting = {
    type: "input" | "select" | "toggle" | "info";
    label?: string;
    value?: string | boolean;
    options?: string[];
    style?: string;
    containerStyle?: string;
    labelStyle?: string;
    onEvent?: () => void;
    onChange?: (newValue: string | boolean | "notes" | "news" | "none") => void;
};

declare type SettingsGroup = {
    name: string;
    settings: Setting[];
    style?: string;
}

declare type MenuItem = {
  label: string;
  onClick: () => void;
};

declare type ContextMenuProps = {
    items: { label: string; onClick: () => void }[];
    children: React.ReactNode;
    style?: string;
}

declare type DownloadState = {
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

declare type IntegrityState = {
    progress: number;
    message: string;
    stats: string;
    isScanning: boolean;
    setProgress: (progress: number) => void;
    setStats: (stats: string | undefined) => void;
    setMessage: (message: string) => void;
    startScan: () => void;
    stopScan: () => void;
}

declare type UiUpdateState = {
    isUpdated: number;
    setUpdated: (isUpdated: number) => void;
}

declare type InstallerConfig = {
    BASE_URL: string;
    FILE_NAME: string;
    FILE_COUNT: number;
    MANIFEST_URL: string;
    ARCHIVES_TABLE: string;
    RESTORE_FILES_URL: string;
    IMAGES_URL: string;
    NEWS_URL: string;
}