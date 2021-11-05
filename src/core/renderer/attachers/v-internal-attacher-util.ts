import {VInternalHtmlAttribute} from "../v-internal-html-attribute";

export const findMethodNameInElement = (element: HTMLElement, attr: VInternalHtmlAttribute, methodName: string): HTMLElement | undefined => {
    const inCurrent = element.dataset[attr.internalAttrName] === methodName;
    if (inCurrent) {
        return element;
    }

    if (element.hasChildNodes()) {
        const children = Array.from(element.children);
        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            const inChild = findMethodNameInElement(child, attr, methodName);
            if (inChild) {
                return inChild;
            }
        }
    }

    return undefined;
}