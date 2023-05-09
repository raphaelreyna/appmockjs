import { registerApplications, Browser, Terminal } from './src/applications/applications';
import { registerDevices, Smartphone, Laptop } from './src/devices/devices';
import { getFirstParentWithClass } from './src/document/document';
import { registerIcons } from './src/icons/icons';

declare global {
    interface Window {
        amjsMain: () => void;
        getFirstParentWithClass: (element: HTMLElement, className: string) => HTMLElement | null;
        Terminal: typeof Terminal;
        Browser: typeof Browser;
        Smartphone: typeof Smartphone;
        Laptop: typeof Laptop;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    registerIcons();
    registerDevices();
    registerApplications();
    window.amjsMain();
});

window.amjsMain = () => {};
window.Terminal = Terminal;
window.Browser = Browser;
window.Smartphone = Smartphone;
window.Laptop = Laptop;
window.getFirstParentWithClass = getFirstParentWithClass;

export { Terminal, Browser, Smartphone, Laptop };