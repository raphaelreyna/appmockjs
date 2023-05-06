import { initBrowser } from './src/applications/browser';
import { initTerminal, Terminal } from './src/applications/terminal';
import { getFirstParentWithClass, activateScriptTags } from './src/document/document';

declare global {
    interface Window {
        devicesMainFunction: () => void;
        getFirstParentWithClass: (element: HTMLElement, className: string) => HTMLElement | null;
        Terminal: typeof Terminal;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initBrowser();
    initTerminal();
    if (window.devicesMainFunction) {
        window.devicesMainFunction();
    }
});

window.Terminal = Terminal;
window.getFirstParentWithClass = getFirstParentWithClass;