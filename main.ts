import { initBrowser, Browser } from './src/applications/browser';
import { initTerminal, Terminal } from './src/applications/terminal';
import { initSmartphone, Smartphone } from './src/devices/smartphone';
import { getFirstParentWithClass, activateScriptTags } from './src/document/document';

declare global {
    interface Window {
        amjsMain: () => void;
        getFirstParentWithClass: (element: HTMLElement, className: string) => HTMLElement | null;
        Terminal: typeof Terminal;
        Browser: typeof Browser;
        Smartphone: typeof Smartphone;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initBrowser();
    initTerminal();
    initSmartphone();
    window.amjsMain();
});

window.amjsMain = () => {};
window.Terminal = Terminal;
window.Browser = Browser;
window.Smartphone = Smartphone;
window.getFirstParentWithClass = getFirstParentWithClass;