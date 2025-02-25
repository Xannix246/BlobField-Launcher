import { sendNotification } from '@tauri-apps/plugin-notification';
import { load, LazyStore } from '@tauri-apps/plugin-store';
import { join } from '@tauri-apps/api/path';

class Config {
    constructor() {

    }

    public async blob() {
        const store = await load('store.json', { autoSave: true });

        await store.set('some-key', { value: 5 });

        const val = await store.get<{ value: number }>('some-key');
        console.log(val); // { value: 5 }

        await store.save();
    }

    public async lazyBlob(filepath: string, filename: string) {
        const store = new LazyStore("./config.json")
        await store.set('game-path', filepath);
        await store.set('game-exe', filename);
        await store.save();
    }

    public async getLazyBlob() {
        const store = new LazyStore("./config.json")
        const gamePath = await store.get<string>('game-path');
        const gameExe = await store.get<string>('game-exe');

        if(!gamePath || !gameExe) this.lazyBlob("J:\\endfield\\EndField Launcher\\EndField Game", "Endfield_TBeta_OS.exe");
        
        sendNotification({title: "BlobField Launcher", body: `Stored location: ${await join(gamePath as string, gameExe as string)}`});
    }
}

export default Config;