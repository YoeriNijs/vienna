import {VInternalAttacher} from "./v-internal-attacher";
import {VComponentType} from "../../component/v-component-type";
import {VInternalHtmlAttribute} from "../v-internal-html-attribute";
import {VInternalAttacherMethods} from "./v-internal-attacher-methods";
import {VInternalHtmlAttributeMap} from "../v-internal-html-attribute-map";

export class VInternalEventAttacher implements VInternalAttacher {
    accept(component: VComponentType, shadowRoot: ShadowRoot): boolean {
        return shadowRoot.children && VInternalHtmlAttributeMap.some(attr =>
            shadowRoot.querySelectorAll<HTMLElement>(`[${attr.internalClientAttrName}]`));
    }

    attach(component: VComponentType, shadow: ShadowRoot, methods: VInternalAttacherMethods): void {
        VInternalHtmlAttributeMap.forEach(attr => {
            const elements = shadow.querySelectorAll<HTMLElement>(`[${attr.internalClientAttrName}]`);
            Array.from(elements).forEach(el => this.addEventListener(el, attr, shadow, methods, component));
        })
    }

    private addEventListener(el: HTMLElement, attr: VInternalHtmlAttribute, shadow: ShadowRoot, methods: VInternalAttacherMethods, component: VComponentType) {
        const methodName = el.dataset[attr.internalAttrName];
        Array.from(shadow.children)
            .filter((shadowEl) => shadowEl.nodeName !== 'STYLE')
            .map((shadowEl: HTMLElement) => this.findMethodNameInElement(shadowEl, attr, methodName))
            .filter((shadowEl) => shadowEl)
            .forEach((shadowEl: HTMLElement) => {
                shadowEl.addEventListener(attr.domEvent, () => {
                    methods.callInternalMethod(component, methodName, shadowEl);
                    methods.forceRebuild(); // Re-render since view may have changed
                });
            });
    }

    private findMethodNameInElement(element: HTMLElement, attr: VInternalHtmlAttribute, methodName: string): HTMLElement | undefined {
        const inCurrent = element.dataset[attr.internalAttrName] === methodName;
        if (inCurrent) {
            return element;
        }

        if (element.hasChildNodes()) {
            const children = Array.from(element.children);
            for (let i = 0; i < children.length; i++) {
                const child = children[i] as HTMLElement;
                const inChild = this.findMethodNameInElement(child, attr, methodName);
                if (inChild) {
                    return inChild;
                }
            }
        }

        return undefined;
    }

}