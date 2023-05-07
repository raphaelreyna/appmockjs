import window from '../css/applications/window.module.scss';

export abstract class AppMock extends HTMLElement {
    protected abstract renderChrome(): string;
    protected abstract renderContent(): string;

    constructor() { 
        super(); 
        if (this.hasAttribute('fullscreen')) {
            this.style.width = '100%';
            this.style.height = '100%';
            this.classList.add(window.windowFullscreen);
        }
    }

    connectedCallback() {
        if (!this.isConnected || this.hasAttribute('rendered')) {
            return;
        }
        setInnerHTML(this, this.render());
        this.setAttribute('rendered', '');
    }

    // the script returned by this method will be wrapped in an IIFE (function() { ... })();
    // and added to as the last child of this element.
    // once the script is executed, the script element will be removed.
    protected postScript(): string {
        return '';
    }

    private render(): string {
        const attrs = stringifyAttributes(this);
        return `
    <div ${attrs.chrome}>
        ${this.renderChrome()}
    </div>
    <div ${attrs.content}>
        ${this.renderContent()}
    </div>
    <script>
        (function() {
            ${this.postScript()}
        })();
        const script = document.currentScript;
        script.parentElement.removeChild(script);
    </script>
`;
    }
}

type windowAttributes = {
    chrome: string;
    content: string;
};

function stringifyAttributes(element: HTMLElement): windowAttributes {
    const wa = {
        chrome: '',
        content: '',
    } as windowAttributes;
    const toRemove: Attr[] = [];
  
    var foundWindowClass = false;
    var foundChromeClass = false;
    var foundContentClass = false;

    for (const attr of element.attributes) {
        if (attr.name.startsWith('window-chrome-')) {
            const name = attr.name.replace('window-chrome-', '');
            var value = attr.value;
            if (name === 'class' && !foundChromeClass) {
                value += ` ${window.windowChrome}`;
                foundChromeClass = true;
            }
            wa.chrome += attributeToString(name, value);
            toRemove.push(attr);
        } else if (attr.name.startsWith('window-content-')) {
            const name = attr.name.replace('window-content-', '');
            var value = attr.value;
            if (name === 'class' && !foundContentClass) {
                value += ` ${window.windowContent}`;
                foundContentClass = true;
            }
            wa.content += attributeToString(name, value);
            toRemove.push(attr);
        }  else {
            if (attr.name === 'class' && !foundWindowClass) {
                attr.value += ` ${window.window}`;
                foundWindowClass = true;
            }
        }
    }

    if (!foundChromeClass) {
        wa.chrome = ` class="${window.windowChrome}"` + wa.chrome;
    }

    if (!foundContentClass) {
        wa.content = ` class="${window.windowContent}"` + wa.content;
    }

    toRemove.forEach((attr) => element.removeAttributeNode(attr));

    return wa;
}

function attributeToString(name: string, value?: string): string {
    let attrString = '';
    if (value) {
        attrString = ` ${name}="${value}"`;
    } else {
        attrString = ` ${name}`;
    }
    return attrString;
}

export function setInnerHTML(elm: HTMLElement, html: string) {
    elm.innerHTML = html;
    
    Array.from(elm.querySelectorAll("script"))
      .forEach( oldScriptEl => {
        if (oldScriptEl.hasAttribute("amjs-processed")) {
            return;
        }

        const newScriptEl = document.createElement("script");
        newScriptEl.setAttribute("amjs-processed", "");
        
        Array.from(oldScriptEl.attributes).forEach( attr => {
          newScriptEl.setAttribute(attr.name, attr.value) 
        });
        
        const scriptText = document.createTextNode(oldScriptEl.innerHTML);
        newScriptEl.appendChild(scriptText);
        
        oldScriptEl.parentNode?.replaceChild(newScriptEl, oldScriptEl);
    });
  }