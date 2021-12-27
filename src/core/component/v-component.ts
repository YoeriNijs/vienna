import {VComponentOptions} from './v-component-options';
import {VInternalApplicationSelectors} from "../application/v-internal-application-selectors";

export const V_INTERNAL_COMPONENT_ID = 'v-id';

export function VComponent(options: VComponentOptions) {
    function override<T extends new(...arg: any[]) => any>(target: T) {
        return class extends target {
            constructor(...args: any[]) {
                super(...args);

                // We need to override the html with unique id's for every element, so we can easily execute change
                // detection without slowing down performance
                const optionsOverride = {...options, html: createUniqueIdForEveryElement(options.html)};
                Object.defineProperty(this, 'vComponentOptions', {
                    value: JSON.stringify(optionsOverride),
                    configurable: false,
                    writable: false
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

    const wrapper = doc.createElement(VInternalApplicationSelectors.V_COMPONENT_WRAPPER);
    wrapper.append(doc.body.cloneNode(true));
    appendUniqueId(wrapper);

    return wrapper.outerHTML;
}