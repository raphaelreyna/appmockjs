import { AppMock } from "../appmock";
import { appendAttribute } from "../document/attributes";
import { typeValue } from "../animation/animation";

export class Browser extends AppMock {
    private _urlInput: HTMLInputElement | null = null;
    private _content: HTMLElement | null = null;

    constructor() { 
        super();
        appendAttribute(this, 'class', 'browser-window');
        appendAttribute(this, 'window-chrome-class', 'browser-window-chrome');
        appendAttribute(this, 'window-content-class', 'browser-window-content');
    }

    renderChrome(): string {
        return `
<div class="browser-controls-container">
    <i class="fas fa-arrow-left browser-control"></i>
    <i class="fas fa-arrow-right browser-control"></i>
</div>
<input type="text" class="browser-window-chrome-input" value="" readonly/>
`
    }

    renderContent(): string {
        return this.innerHTML;
    }

    urlInput(): HTMLInputElement {
        if (!this._urlInput) {
            this._urlInput = this.querySelector('.browser-window-chrome-input');
        }
        if (!this._urlInput) {
            throw new Error('url input not found');
        }
        return this._urlInput;
    }

    content(): HTMLElement | null {
        if (!this._content) {
            this._content = this.querySelector('.browser-window-content');
        }
        return this._content;
    }

    public clearURL() {
        this.urlInput().value = '';
    }

    public typeURL(url: string, speed: number = 75, randomness: number = 3): Promise<void> {
        this.clearURL();
        return typeValue(this.urlInput(), url, speed, randomness);
    }

    public set url(url: string) {
        this.urlInput().value = url;
    }

    public clearContent() {
        const content = this.content();
        if (content) {
            content.innerHTML = '';
        }
    }

    public set contentHTML(html: string) {
        const content = this.content();
        if (content) {
            content.innerHTML = html;
        }
    }

    public set contentText(text: string) {
        const content = this.content();
        if (content) {
            content.innerText = text;
        }
    }

    public get contentHTML(): string {
        const content = this.content();
        if (content) {
            return content.innerHTML;
        }
        return '';
    }

    public get contentText(): string {
        const content = this.content();
        if (content) {
            return content.innerText;
        }
        return '';
    }

    public appendContentChild(child: HTMLElement) {
        const content = this.content();
        if (content) {
            content.appendChild(child);
        }
    }

    public set location(url: string) {
        this.url = url;
        this.contentHTML = `<iframe class="browser-window-content" src="${url}"></iframe>`;
    }
}

export function initBrowser() {
    customElements.define('amjs-browser', Browser);
}