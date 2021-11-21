import {VComponentOptions} from './v-component-options';

export const V_INTERNAL_COMPONENT_ID = 'v-id';

export function VComponent(options: VComponentOptions) {
    function override<T extends new(...arg: any[]) => any>(target: T) {
        return class extends target {
            constructor(...args: any[]) {
                super(...args);

                // Create unique id for every element in our view. With this id, it is much easier to just render the element
                // for change detection later, instead of rendering the whole component over and over again (YN).
                options.html = createUniqueIdForEveryElement(options.html);

                Object.defineProperty(this, 'vComponentOptions', {
                    value: JSON.stringify(options),
                    configurable: false,
                    writable: false,
                });
            }
        };
    }

    return override;
}

const appendUniqueId = (element: Element): void => {
    const uniqueId = Math.random().toString(36).substring(2, 12);
    element.setAttribute(V_INTERNAL_COMPONENT_ID, uniqueId);
    if (element.hasChildNodes()) {
        Array.from(element.children).forEach(c => appendUniqueId(c));
    }
}

const createUniqueIdForEveryElement = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    Array.from(doc.children).forEach(c => appendUniqueId(c));

    // Clone body to add unique id to it as well
    const clonedBody = doc.body.cloneNode(true);
    const clonedBodyWrapper = doc.createElement('div');
    clonedBodyWrapper.append(clonedBody);
    appendUniqueId(clonedBodyWrapper);

    // Replace previous body by wrapper
    doc.body.innerHTML = '';
    doc.body.appendChild(clonedBodyWrapper);

    return doc.body.innerHTML;
}