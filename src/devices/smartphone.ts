import { setInnerHTML } from "../appmock";
import smartphone from "../../css/devices/smartphone.module.scss";
import window from "../../css/applications/window.module.scss";

export class Smartphone extends HTMLElement {
    private _smartphoneScreen: HTMLElement | null = null;
    public statusBarTime: string = '12:34';

    constructor() {
        super();
        this.classList.add(smartphone.smartphoneBezel);
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
<div class="${smartphone.smartphone}">
    <div class="${smartphone.smartphoneScreen}">
        <div class="${smartphone.smartphoneStatusBar}">
            <div class="${smartphone.smartphoneStatusBarReceptionBars}">
                <fa-signal></fa-signal>
            </div>
            <div class="${smartphone.smartphoneStatusBarTime}">
                ${this.statusBarTime}
            </div>
            <div class="${smartphone.smartphoneStatusBarBattery}">
                <fa-battery></fa-battery>
            </div>
        </div>
        <div class="${smartphone.smartphoneContent}">
            ${this.innerHTML}
        </div>
        <script>
            (function() {
                const script = document.currentScript;
                const content = script.parentElement.querySelector('.${smartphone.smartphoneContent}');
                const child = content.firstElementChild;
                if (child) { 
                    child.style.height = '100%';
                    child.style.width = '100%';
                    child.classList.add('${window.windowFullscreen}');
                }
                //script.parentElement.removeChild(script);
        })();
        </script>
    </div>
</div>
`
    }

    private getSmartphoneScreen(): HTMLElement {
        if (!this._smartphoneScreen) {
            this._smartphoneScreen = this.querySelector(smartphone.smartphoneScreen);
        }
        if (!this._smartphoneScreen) {
            throw new Error('smartphone screen not found');
        }
        return this._smartphoneScreen;
    }

    public turnOffScreen() {
        this.getSmartphoneScreen().classList.add(smartphone.smartphoneScreenOff);
    }

    public turnOnScreen() {
        this.getSmartphoneScreen().classList.remove(smartphone.smartphoneScreenOff);
    }
}