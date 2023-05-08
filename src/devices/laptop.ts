import { setInnerHTML } from "../appmock";
import laptop from "../../css/devices/laptop.module.scss";

type attr = {
    originalName: string;
    value: string;
};

type attrs = { [key: string]: attr };

export class Laptop extends HTMLElement {
    private fingerBezelAttrs: attrs = {
        'class': {
            originalName: '',
            value: laptop.fingerBezel
        }
    }

    constructor() {
        super();
        this.classList.add(laptop.laptop);
        if (!this.style.width) {
            this.style.width = '435px';
        }
        if (!this.style.height) {
            this.style.height = '250px';
        }

        for (const a of this.attributes) {
            if (a.name.startsWith('bottom-')) {
                const newName = a.name.replace('bottom-', '');
                let aa = this.fingerBezelAttrs[newName];
                if (!aa) {
                    aa = {
                        originalName: a.name,
                        value: a.value,
                    };
                    this.fingerBezelAttrs[newName] = aa;
                } else {
                    this.fingerBezelAttrs[newName] = {
                        originalName: aa.originalName ? aa.originalName : a.name,
                        value: a.value ? aa.value + ' ' + a.value : aa.value,
                    }
                }
            }
        }

        // iterate over this._bottomAttrs and add them to the bottom div
        for (const key in this.fingerBezelAttrs) {
            if (!this.fingerBezelAttrs.hasOwnProperty(key)) {
                continue;
            }

            const a = this.fingerBezelAttrs[key];
            if (a.originalName) {
                this.removeAttribute(a.originalName);
            }
        }
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        
        setInnerHTML(this, this.render());
    }

    private render(): string {
        let fingerBezelAttrs = '';
        for (const key in this.fingerBezelAttrs) {
            if (!this.fingerBezelAttrs.hasOwnProperty(key)) {
                continue;
            }

            const a = this.fingerBezelAttrs[key];
            fingerBezelAttrs += `${key}="${a.value}" `;
        }

        return `
<section class="${laptop.laptopContainer}">
    <div class="${laptop.top}">
        <div class="${laptop.case}">
            ${this.innerHTML}
        </div>
    </div>
    <div ${fingerBezelAttrs}>
    <div class="${laptop.bottom}">
</section>
`
    }
}