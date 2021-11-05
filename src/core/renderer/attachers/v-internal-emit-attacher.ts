import {VInternalAttacher} from "./v-internal-attacher";
import {VComponentType} from "../../component/v-component-type";
import {VInternalHtmlAttribute} from "../v-internal-html-attribute";
import {VInternalAttacherMethods} from "./v-internal-attacher-methods";
import {VInternalHtmlAttributeMap} from "../v-internal-html-attribute-map";
import {VInjector} from "../../injector/v-injector";
import {VInternalEventbus} from "../../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../../eventbus/v-internal-event-name";
import {VInternalEmitterData} from "../../binding/v-internal-emitter-data";
import {VRenderError} from "../v-render-error";
import {findMethodNameInElement} from "./v-internal-attacher-util";

const EMIT_SPLITTER = '=>';

export class VInternalEmitAttacher implements VInternalAttacher {
    private readonly _eventBus = VInjector.resolve<VInternalEventbus>(VInternalEventbus);

    accept(component: VComponentType, shadowRoot: ShadowRoot): boolean {
        return shadowRoot.children && VInternalHtmlAttributeMap.some(attr =>
            shadowRoot.querySelectorAll<HTMLElement>(`[${attr.internalClientAttrName}]`));
    }

    attach(component: VComponentType, shadow: ShadowRoot, methods: VInternalAttacherMethods): void {
        VInternalHtmlAttributeMap
            .filter(attr => attr.internalAttrName === 'vEmit')
            .forEach(attr => {
                const elements = shadow.querySelectorAll<HTMLElement>(`[${attr.internalClientAttrName}]`);
                Array.from(elements).forEach(el => this.addInternalEmitListener(el, attr, shadow, methods, component));
            })
    }

    private addInternalEmitListener(el: HTMLElement, attr: VInternalHtmlAttribute, shadow: ShadowRoot, methods: VInternalAttacherMethods, component: VComponentType) {
        const signature = el.dataset[attr.internalAttrName];
        if (signature.indexOf(EMIT_SPLITTER) === -1) {
            throw new VRenderError('Invalid emit attribute: no arrow found!');
        }

        const [caller, methodName] = signature
            .split(EMIT_SPLITTER)
            .filter(v => v)
            .map(v => v.trim());
        if (!caller || !methodName) {
            throw new VRenderError('Invalid emit attribute: no left or right side found!');
        }

        const elements = Array.from(shadow.children)
            .filter((shadowEl) => shadowEl.nodeName !== 'STYLE')
            .map((shadowEl: HTMLElement) => findMethodNameInElement(shadowEl, attr, signature))
            .filter((shadowEl) => shadowEl);
        if (!elements || elements.length < 1) {
            return;
        }

        this._eventBus.subscribe(VInternalEventName.EMIT, (internalEmitterData: VInternalEmitterData<any>) => {
            const data = internalEmitterData.data;
            if (internalEmitterData.callerName === caller) {
                methods.callInternalMethod(component, methodName, elements[0], data);
                methods.forceRebuild(); // Re-render since view may have changed
            }
        });
    }
}