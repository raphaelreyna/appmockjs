import { AppMock } from "../appmock.js";
import { appendAttribute } from "../document/attributes.js";
import { typeText } from "../animation/animation.js";
import terminal from '../../css/applications/terminal.module.scss';
import window from '../../css/applications/window.module.scss';

export class Terminal extends AppMock {
    private _ul: HTMLUListElement | null = null;
    private _currentLine: HTMLLIElement | null = null;
    private _currentLineEndWithCursor: boolean = false;

    public prompt: string = "$";
    public cursor: string = "_";
    public blinkCursor: boolean = true;

    constructor() {
        super();

        appendAttribute(this, "class", terminal.terminalWindow);
        appendAttribute(this, "window-content-class", terminal.terminalWindowContent);

        const attrPrompt = this.getAttribute("prompt");
        if (attrPrompt) {
            this.prompt = attrPrompt;
        }
        const attrCursor = this.getAttribute("cursor");
        if (attrCursor) {
            this.cursor = attrCursor;
        }
        const attrBlinkCursor = this.getAttribute("blink-cursor");
        if (attrBlinkCursor) {
            this.blinkCursor = attrBlinkCursor === "true";
        }
    }

    protected renderChrome(): string {
        let title = this.getAttribute("chrome-title");
        if (!title) {
            title = "terminal";
        }

        return `
<div class="${window.windowChromeButtonContainer}">
    <div class="${window.redDot}"></div>
    <div class="${window.yellowDot}"></div>
    <div class="${window.greenDot}"></div>
</div>
<span class="${window.windowChromeTitle}">${title}</span>
`;
    }

    protected renderContent(): string {
        var innerHTML = this.innerHTML;
        if (!this.innerHTML.trim()) {
            innerHTML = `<li>${this.wrappedPrompt()} ${this.wrappedCursor()}</li>`;
        }
        return `<ul class="${terminal.scrollbar}">${innerHTML}</ul>`;
    }

    protected postScript(): string {
        return `
    const script = document.currentScript;
    const terminalWindow = getFirstParentWithClass(script, "${terminal.terminalWindow}");
    const ul = terminalWindow.querySelector("ul");
    let shouldScrollToBottom = true;

    function scrollToBottom() {
        ul.scrollTop = ul.scrollHeight;
    }

    ul.addEventListener('scroll', () => {
        shouldScrollToBottom = ul.scrollTop + ul.clientHeight !== ul.scrollHeight;
        if (!shouldScrollToBottom) {
            scrollToBottom();
        }
    });

    scrollToBottom();
`;
    }

    public getLineList(): HTMLUListElement {
        if (!this._ul) {
            const ul = this.querySelector("ul");
            if (!ul) {
                throw new Error("No ul element found in terminal window");
            }
            this._ul = ul;
        }
        return this._ul;
    }

    public scrollToBottom(): void {
        const ul = this.getLineList();
        ul.scrollTop = ul.scrollHeight;
    }

    private wrappedCursor(): string {
        if (!this.blinkCursor) {
            return this.cursor;
        }
        return `<span class="${terminal.cursor} ${window.notSelectable}">${this.cursor}</span>`;
    }

    private wrappedPrompt(): string {
        return `<span class="${window.notSelectable}">${this.prompt}</span>`;
    }

    public currentLine() {
        if (!this._currentLine) {
            const contentChild = this.querySelector(`.${window.windowContent}`);
            var li = contentChild?.querySelector("ul")?.lastElementChild as HTMLLIElement;

            if (!li) {
                li = this._newLine('', true);
            } else {
                if (li.innerHTML.endsWith(this.wrappedCursor())) {
                    this._currentLineEndWithCursor = true;
                }
            }

            this._currentLine = li;
        }
        return this._currentLine;
    }

    private _newLine(text?: string, skipCurrentLineCheck?: boolean): HTMLLIElement {
        if (!skipCurrentLineCheck) {
            const currentLine = this.currentLine();
            if (currentLine && this._currentLineEndWithCursor) {
                currentLine.innerHTML = currentLine.innerHTML.slice(0, -1 * this.wrappedCursor().length);
                this._currentLineEndWithCursor = false;
            }
        }

        const ul = this.querySelector("ul");
        if (!ul) {
            throw new Error("No ul element found in terminal window");
        }
        const li = document.createElement("li");
        if (text) {
            li.innerHTML = text;
        }
        ul.appendChild(li);
        this._currentLine = li;
        this.scrollToBottom();

        return li;
    }

    public newLine(text?: string): HTMLLIElement {
        return this._newLine(text);
    }

    public async type(text: string, speed: number = 75, randomness: number = 0) {
        const line = this.currentLine();

        if (!speed) {
            if (this._currentLineEndWithCursor) {
                line.innerHTML = line.innerHTML.slice(0, -1 * this.wrappedCursor().length);
            }
            line.innerHTML += text + this.wrappedCursor();
            this._currentLineEndWithCursor = true;
            return;
        }

        if (this._currentLineEndWithCursor) {
            line.innerHTML = line.innerHTML.slice(0, -1 * this.wrappedCursor().length);
            this._currentLineEndWithCursor = false;
        }

        return new Promise<void>((resolve) => {
            typeText(line, text, speed, randomness, this.scrollToBottom.bind(this)).then(() => {
                line.innerHTML += this.wrappedCursor();
                this._currentLineEndWithCursor = true;
                resolve();
            });
        });
    }

    public return() {
        this.newLine(`${this.wrappedPrompt()} ${this.wrappedCursor()}`);
        this._currentLineEndWithCursor = true;
        this.scrollToBottom();
        return Promise.resolve();
    }

    public clearScreen() {
        const ul = this.querySelector("ul");

        if (!ul) {
            return Promise.resolve();
        }
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        return this.return();
    }
};