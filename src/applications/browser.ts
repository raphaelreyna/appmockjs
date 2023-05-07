import { AppMock } from "../appmock";
import { appendAttribute } from "../document/attributes";
import { typeValue } from "../animation/animation";
import browser from '../../css/applications/browser.module.scss';

export class Browser extends AppMock {
    private _urlInput: HTMLInputElement | null = null;
    private _content: HTMLElement | null = null;

    constructor() { 
        super();
        appendAttribute(this, 'class', browser.browserWindow);
        appendAttribute(this, 'window-chrome-class', browser.browserWindowChrome);
        appendAttribute(this, 'window-content-class', browser.browserWindowContent);
    }

    renderChrome(): string {
        return `
<div class="${browser.browserControlsContainer}">
    <fa-left-arrow class="${browser.browserControl}"></fa-left-arrow>
    <fa-right-arrow class="${browser.browserControl}"></fa-right-arrow>
</div>
<input type="text" class="${browser.browserWindowChromeInput}" value="" readonly/>
`
    }

    renderContent(): string {
        return this.innerHTML;
    }

    urlInput(): HTMLInputElement {
        if (!this._urlInput) {
            this._urlInput = this.querySelector(browser.browserWindowChromeInput);
        }
        if (!this._urlInput) {
            throw new Error('url input not found');
        }
        return this._urlInput;
    }

    content(): HTMLElement | null {
        if (!this._content) {
            this._content = this.querySelector(browser.browserWindowContent);
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
        this.contentHTML = `<iframe class="${browser.browserWindowContent}" src="${url}"></iframe>`;
    }
}