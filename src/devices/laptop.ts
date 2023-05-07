import { setInnerHTML } from "../appmock";
import laptop from "../../css/devices/laptop.module.scss";

export class Laptop extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        
        setInnerHTML(this, this.render());
    }

    private render(): string {
        return `
<section class="${laptop.laptopContainer}">
    <div class="${laptop.top}">
        <div class="${laptop.case}">
            ${this.innerHTML}
        </div>
    </div>
    <div class="${laptop.keyboard}">
    <div class="${laptop.bottom}">
</section>
`
    }
}