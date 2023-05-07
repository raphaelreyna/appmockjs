import { Laptop } from "./laptop";
import { Smartphone } from "./smartphone";

export function registerDevices() {
    customElements.define('amjs-laptop', Laptop);
    customElements.define('amjs-smartphone', Smartphone);
}

export { Laptop, Smartphone };