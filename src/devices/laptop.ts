import { setInnerHTML } from "../appmock";
import laptop from "../../css/devices/laptop.module.scss";

export class Laptop extends HTMLElement {
    constructor() {
        super();
        this.classList.add(laptop.laptop);
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
    <div class="${laptop.top} ${laptop.rotatingDiv}">
        <div class="${laptop.case}">
            ${this.innerHTML}
        </div>
    </div>
    <div class="${laptop.fingerBezel}">
    <div class="${laptop.bottom}">
</section>
`
    }
}