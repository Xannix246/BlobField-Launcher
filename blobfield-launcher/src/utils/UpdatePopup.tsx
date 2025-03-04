import { openUrl } from '@tauri-apps/plugin-opener';
import { useState } from 'react';

const UpdatePopup = ({ message, onConfirm }: { message: string, onConfirm: () => void }) => {
    const [open, setOpen] = useState(true);

    return (
        <>
            {open && <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 text-black">
                <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <p className="relative text-lg mb-4 font-second text-center">{message}</p>
                    <div className="text-lg w-full right-0 font-second text-right">
                        <a 
                            className="text-[#636363] hover:text-[#cccc00] cursor-pointer hover:underline"
                            onClick={async () => await openUrl("https://github.com/Xannix246/BlobField-Launcher/releases/latest")}
                        >//Release notes ={">"}</a>
                    </div>
                    <div className="relative h-[70px] flex justify-center gap-4">
                        <button
                            className="absolute left-0 bottom-0 w-fit bg-ak-yellow drop-shadow-md px-4 py-2 rounded-lg transition duration-150 hover:bg-[#cccc00] cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            Maybe later
                        </button>
                        <button
                            className="absolute right-0 bottom-0 w-fit bg-[#f0f0f0] drop-shadow-md px-4 py-2 rounded-lg transition duration-150 hover:bg-black/5 cursor-pointer"
                            onClick={onConfirm}
                        >
                            Yep!
                        </button>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default UpdatePopup;