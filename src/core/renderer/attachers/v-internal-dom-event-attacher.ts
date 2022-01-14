import {VInternalAttacher} from "./v-internal-attacher";
import {VComponentType} from "../../component/v-component-type";
import {VInternalHtmlAttribute} from "../v-internal-html-attribute";
import {VInternalAttacherMethods} from "./v-internal-attacher-methods";
import {VInternalHtmlAttributeMap} from "../v-internal-html-attribute-map";
import {findMethodNameInElement} from "./v-internal-attacher-util";

const V_INTERNAL_ATTRIBUTE_SEPARATOR = '.';

export class VInternalDomEventAttacher implements VInternalAttacher {
    accept(component: VComponentType, shadowRoot: ShadowRoot): boolean {
        return true;
    }

    attach(component: VComponentType, shadow: ShadowRoot, methods: VInternalAttacherMethods): void {
        VInternalHtmlAttributeMap.forEach(attr =>
            Array.from(shadow.children)
                .forEach((child: HTMLElement) =>
                    this.checkElement(child, attr, shadow, methods, component)));
    }

    private checkElement(element: HTMLElement, internalAttribute: VInternalHtmlAttribute,
                         shadow: ShadowRoot, methods: VInternalAttacherMethods, component: VComponentType): void {
        Array.from(element.attributes).forEach(attr => {
            const attributeName = attr.name;
            const internalAttributeName = internalAttribute.internalClientAttrName;
            if (attributeName.startsWith(internalAttributeName)) {
                const internalAttributeVariable = attributeName.replace(internalAttributeName, '')
                    .replace(V_INTERNAL_ATTRIBUTE_SEPARATOR, '');
                this.addEventListener(element, internalAttribute, shadow, methods, component, internalAttributeVariable)
            }
        });

        if (element.hasChildNodes()) {
            Array.from(element.children).forEach((c: HTMLElement) =>
                this.checkElement(c, internalAttribute, shadow, methods, component));
        }
    }

    private addEventListener(el: HTMLElement, attr: VInternalHtmlAttribute, shadow: ShadowRoot,
                             methods: VInternalAttacherMethods, component: VComponentType, variable: string) {
        const methodName = el.dataset[attr.internalAttrName];
        Array.from(shadow.children)
            .filter((shadowEl) => shadowEl.nodeName !== 'STYLE')
            .map((shadowEl: HTMLElement) => findMethodNameInElement(shadowEl, attr, methodName))
            .filter((shadowEl) => shadowEl)
            .forEach((shadowEl: HTMLElement) => this.listen(variable, shadowEl, attr, methods, component, methodName));
    }

    private listen(variable: string, shadowEl: HTMLElement, attr: VInternalHtmlAttribute, methods: VInternalAttacherMethods, component: VComponentType, methodName: string) {
        const keyboardListener = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === variable.toLowerCase()) {
                shadowEl.removeEventListener(attr.domEvent, keyboardListener);
                methods.callInternalMethod(component, methodName, shadowEl);
                methods.forceRerendering(); // Re-render since view may have changed
            }
        };

        const defaultListener = () => {
            shadowEl.removeEventListener(attr.domEvent, defaultListener);
            methods.callInternalMethod(component, methodName, shadowEl);
            methods.forceRerendering(); // Re-render since view may have changed
        };

        switch (attr.domEvent) {
            case 'keydown':
            case 'keyup':
                shadowEl.addEventListener(attr.domEvent, keyboardListener);
                break;
            default:
                shadowEl.addEventListener(attr.domEvent, defaultListener);
        }
    }
}