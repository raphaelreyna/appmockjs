import { Laptop } from "./laptop";
import { Smartphone } from "./smartphone";

export function registerDevices() {
    customElements.define('fa-laptop', Laptop);
    customElements.define('fa-smartphone', Smartphone);
}

export { Laptop, Smartphone };