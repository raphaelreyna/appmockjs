export abstract class AppMock extends HTMLElement {
    protected abstract renderChrome(): string;
    protected abstract renderContent(): string;

    constructor() { 
        super(); 
        if (this.hasAttribute('fullscreen')) {
            this.style.width = '100%';
            this.style.height = '100%';
        }
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        setInnerHTML(this, this.render());
    }

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
        ${this.postScript()}
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
                value += ' window-chrome';
                foundChromeClass = true;
            }
            wa.chrome += attributeToString(name, value);
            toRemove.push(attr);
        } else if (attr.name.startsWith('window-content-')) {
            const name = attr.name.replace('window-content-', '');
            var value = attr.value;
            if (name === 'class' && !foundContentClass) {
                value += ' window-content';
                foundContentClass = true;
            }
            wa.content += attributeToString(name, value);
            toRemove.push(attr);
        }  else {
            if (attr.name === 'class' && !foundWindowClass) {
                attr.value += ' window';
                foundWindowClass = true;
            }
        }
    }

    if (!foundChromeClass) {
        wa.chrome = ' class="window-chrome"' + wa.chrome;
    }

    if (!foundContentClass) {
        wa.content = ' class="window-content"' + wa.content;
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

function setInnerHTML(elm: HTMLElement, html: string) {
    elm.innerHTML = html;
    
    Array.from(elm.querySelectorAll("script"))
      .forEach( oldScriptEl => {
        const newScriptEl = document.createElement("script");
        
        Array.from(oldScriptEl.attributes).forEach( attr => {
          newScriptEl.setAttribute(attr.name, attr.value) 
        });
        
        const scriptText = document.createTextNode(oldScriptEl.innerHTML);
        newScriptEl.appendChild(scriptText);
        
        oldScriptEl.parentNode?.replaceChild(newScriptEl, oldScriptEl);
    });
  }