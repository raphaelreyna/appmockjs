export function appendAttribute(element: HTMLElement, name: string, value: string) {
    const attr = element.getAttribute(name);
    if (attr) {
        element.setAttribute(name, attr + ' ' + value);
    }
    else {
        element.setAttribute(name, value);
    }
}