import { Browser } from './browser';
import { Terminal } from './terminal';

export function registerApplications() {
    customElements.define('amjs-terminal', Terminal);
    customElements.define('amjs-browser', Browser);
}

export { Browser, Terminal };
