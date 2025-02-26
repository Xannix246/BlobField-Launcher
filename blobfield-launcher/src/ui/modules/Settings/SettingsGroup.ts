export const settingsConfig: SettingsGroup[] = [
    {
        name: "General",
        settings: [
            { type: "toggle", label: "blob", value: false }
        ],
        style: "p-2"
    },
    {
        name: "Awesome settings",
        settings: [
            { type: "select", label: "blob", value: "blob_id", options: ["yes", "no"], style: "w-full h-[42px] bg-white rounded-lg inset-shadow-sm inset-shadow-gray-200 outline-none" }
        ],
        style: "p-2"
    }
];