import {VInternalAttacher} from "./v-internal-attacher";
import {VComponentType} from "../../component/v-component-type";
import {VInternalHtmlAttributeMap} from "../v-internal-html-attribute-map";

export class VInternalBindAttacher implements VInternalAttacher {
    accept(component: VComponentType, shadowRoot: ShadowRoot): boolean {
        return shadowRoot.children && VInternalHtmlAttributeMap.some(attr =>
            shadowRoot.querySelectorAll<HTMLElement>(`[${attr.internalClientAttrName}]`));
    }

    attach(component: VComponentType, shadow: ShadowRoot): void {
        VInternalHtmlAttributeMap.forEach(attr => {
            const elements = shadow.querySelectorAll<HTMLElement>(`[${attr.internalClientAttrName}]`);
            Array.from(elements).forEach((el: HTMLElement) => {
                const value = el.dataset[attr.internalAttrName];
                if (attr.internalAttrName === 'vBind') {
                    (component as any)[value] = el;
                }
            });
        });
    }
}