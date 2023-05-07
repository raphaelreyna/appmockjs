import { setInnerHTML } from "../appmock";

export class Smartphone extends HTMLElement {
    private _smartphoneScreen: HTMLElement | null = null;
    public statusBarTime: string = '12:34';

    constructor() {
        super();
        this.classList.add('smartphone-bezel');
        const attr = this.getAttribute('status-bar-time');
        if (attr) {
            this.statusBarTime = attr;
        }
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        
        setInnerHTML(this, this.render());
    }

    private render(): string {
        return `
<div class="smartphone">
    <div class="smartphone-screen">
        <div class="smartphone-status-bar">
            <div class="smartphone-status-bar-reception-bars">
                <i class="fas fa-signal"></i>
            </div>
            <div class="smartphone-status-bar-time">
                ${this.statusBarTime}
            </div>
            <div class="smartphone-status-bar-battery">
                <i class="fas fa-battery-full"></i>
            </div>
        </div>
        <div class="smartphone-content">
            ${this.innerHTML}
        </div>
        <script>
            (function() {
                const script = document.currentScript;
                const content = script.parentElement.querySelector('.smartphone-content');
                const child = content.firstElementChild;
                if (child) { 
                    child.style.height = '100%';
                    child.style.width = '100%';
                    child.classList.add('window-fullscreen');
                }
                script.parentElement.removeChild(script);
        })();
        </script>
    </div>
</div>
`
    }

    private getSmartphoneScreen(): HTMLElement {
        if (!this._smartphoneScreen) {
            this._smartphoneScreen = this.querySelector('.smartphone-screen');
        }
        if (!this._smartphoneScreen) {
            throw new Error('smartphone screen not found');
        }
        return this._smartphoneScreen;
    }

    public turnOffScreen() {
        this.getSmartphoneScreen().classList.add('smartphone-screen-off');
    }

    public turnOnScreen() {
        this.getSmartphoneScreen().classList.remove('smartphone-screen-off');
    }
}

export function initSmartphone() {
    customElements.define('amjs-smartphone', Smartphone);
}