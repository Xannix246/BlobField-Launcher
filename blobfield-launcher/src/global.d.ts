declare type Config = {
    game_directory: string;
    is_installed: boolean;
    //idk what to add also
}

declare type ImageSlider = {
    url: string;
    link?: string;
}

declare type Setting = {
    type: "input" | "select" | "toggle";
    label: string;
    value: string | boolean;
    options?: string[];
    style?: string;
    labelStyle?: string;
}

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