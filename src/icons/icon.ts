export abstract class Icon extends HTMLElement {
    protected abstract _svg(): string;

    constructor() {
        super();
        this.style.width = '100%';
        this.style.height = '100%';
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        this.innerHTML = this._svg();
        const child = this.firstChild as HTMLElement;
        if (child) {
            child.style.width = '100%';
            child.style.height = '100%';
        }
    }
}
