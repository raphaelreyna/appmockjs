import { IconSignal } from "./signal";
import { IconBattery } from "./battery";
import { IconLeftArrow, IconRightArrow } from "./arrows";

export function registerIcons() {
    customElements.define('fa-signal', IconSignal);
    customElements.define('fa-battery', IconBattery);
    customElements.define('fa-left-arrow', IconLeftArrow);
    customElements.define('fa-right-arrow', IconRightArrow);
}