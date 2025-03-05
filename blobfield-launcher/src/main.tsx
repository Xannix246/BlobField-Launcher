import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import init from "@utils/init";
import { initI18n } from "./i18n";

window.addEventListener("contextmenu", (event) => event.preventDefault());

(async () => {
    await init();
    await initI18n();
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
})();