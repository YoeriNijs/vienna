import {isEmpty} from 'pincet';
import {VRendererOptions} from './v-renderer-options';
import {VComponentOptions} from '../component/v-component-options';
import {VInternalComponent} from '../internal/v-internal-component';
import {VRenderError} from "./v-render-error";
import {VRenderEvents} from "./v-render-events";
import { VComponentType } from '../component/v-component-type';
import {VInternalRendererTransformer} from "./handlers/v-internal-renderer-transformer";
import {VInternalTemplateTransformer} from "./handlers/v-internal-template-transformer";
import {VInternalAttributeTransformer} from "./handlers/v-internal-attribute-transformer";
import {getNestedPropertyByStringPath} from "../util/v-internal-object-util";

interface VElement {
    publicDataName: string;
    internalDataName: string;
}

interface VDomEvent extends VElement {
    domEvent: string;
}

interface VAttributeDirective extends VElement {
}

interface VAttributeBinding extends VElement {
}

const SUPPORTED_DOM_EVENTS: VDomEvent[] = [
    {publicDataName: 'v-click', internalDataName: 'vClick', domEvent: 'click'},
];

const SUPPORTED_ATTRIBUTE_MANIPULATORS: VAttributeDirective[] = [
    {publicDataName: 'v-if', internalDataName: 'vIf'},
    {publicDataName: 'v-if-not', internalDataName: 'vIfNot'},
    {publicDataName: 'v-for', internalDataName: 'vFor'}
];

const SUPPORTED_ATTRIBUTE_BINDINGS: VAttributeBinding[] = [
    {publicDataName: 'v-bind', internalDataName: 'vBind'}
]

enum InternalLifeCycleHook {
    INIT,
    UNKNOWN
}

@VInternalComponent({
    name: 'VRenderer',
})
export class VInternalRenderer {
    private readonly _view: HTMLElement;

    constructor(options: VRendererOptions) {
        this._view = document.createElement(options.selector);
        const body = document.querySelector('body');
        if (body) {
            body.appendChild(this._view);
        } else {
            throw new VRenderError('No body tag found');
        }
    }

    public renderRoot(component: unknown & VComponentType, allComponents: VComponentType[]) {
        this.clearHtml();

        allComponents.forEach(this.defineAsWebComponent);

        const rootOptions: VComponentOptions = JSON.parse(component.vComponentOptions)
        this._view.innerHTML = `<${rootOptions.selector}></${rootOptions.selector}>`;
    }

    private clearHtml(): void {
        this._view.innerHTML = '';
    }

    private defineAsWebComponent(componentType: VComponentType) {
        if (!componentType.vComponentOptions) {
            throw new VRenderError('Component is not a Vienna Component');
        }

        const declaredComponentOptions: VComponentOptions = JSON.parse(componentType.vComponentOptions);

        class DeclaredElement extends HTMLElement {

            private _shadow;
            private _lastKnownHtml: string;
            private _transformers: VInternalRendererTransformer[] = [
                new VInternalAttributeTransformer(),
                new VInternalTemplateTransformer()
            ]

            constructor() {
                super();

                const mode = declaredComponentOptions.encapsulationMode
                    ? declaredComponentOptions.encapsulationMode
                    : 'closed';
                this._shadow = this.attachShadow({mode});

                this.render();
            }

            forceRebuild() {
                const event = new CustomEvent(VRenderEvents.REBUILD);
                document.dispatchEvent(event);
            }

            render() {
                const style = document.createElement('style');
                style.innerHTML = declaredComponentOptions.styles.length < 1
                    ? ''
                    : declaredComponentOptions.styles.join();
                this._shadow.append(style);

                const parser = new DOMParser();
                const html = this._transformers.reduce((prevTransformer, currentTransformer) => {
                        return currentTransformer.transform(prevTransformer, componentType, this.attributes)
                    }, declaredComponentOptions.html);
                const dom = parser.parseFromString(html, 'text/html');

                // Attach supported attribute directives
                SUPPORTED_ATTRIBUTE_MANIPULATORS.forEach((vAttributeDirective) => this.attachAttributeDirective(vAttributeDirective, componentType, dom));

                const htmlContainer = dom.createElement(`${declaredComponentOptions.selector}-body`);
                htmlContainer.innerHTML = dom.body.innerHTML;
                this._shadow.appendChild(htmlContainer);

                // Attach supported dom events
                SUPPORTED_DOM_EVENTS.forEach((vDomEvent) => this.attachDomEvents(vDomEvent, componentType));

                // Bind
                SUPPORTED_ATTRIBUTE_BINDINGS.forEach((b) => this.bind(b, componentType));

                // Call init lifecycle hook
                this.callLifeCycleHook(InternalLifeCycleHook.INIT, componentType);

                // Todo: replace this setInterval by proxy
                // Enable change detection loop
                // setInterval(() => this.detectChanges(), 300);
            }

            attachAttributeDirective(directive: VAttributeDirective, component: VComponentType, dom: Document): void {
                if (!this._shadow.children) {
                    return;
                }

                const elements = dom.querySelectorAll<HTMLElement>(`[data-${directive.publicDataName}]`);
                if (!elements) {
                    return;
                }

                Array.from(elements).forEach((el: HTMLElement) => {
                    const value = el.dataset[directive.internalDataName];
                    if (directive.internalDataName === 'vIf') {
                        const shouldRender = this.callInternalMethod(component, value, el);
                        if (!shouldRender) {
                            el.parentNode.removeChild(el);
                        }
                    } else if (directive.internalDataName === 'vIfNot') {
                        const shouldNotRender = this.callInternalMethod(component, value, el);
                        if (shouldNotRender) {
                            el.parentNode.removeChild(el);
                        }
                    } else if (directive.internalDataName === 'vFor') {
                        const number = this.callInternalMethod(component, value, el);
                        if (number > 0) {
                            for (let i = 0; i < number - 1; i++) {
                                const clone = el.cloneNode(true);
                                el.parentNode.insertBefore(clone, el);
                            }
                        }
                    }
                });
            }

            bind(directive: VAttributeDirective, component: VComponentType): void {
                if (!this._shadow.children) {
                    return;
                }

                const elements = this._shadow.querySelectorAll<HTMLElement>(`[data-${directive.publicDataName}]`);
                if (!elements) {
                    return;
                }

                Array.from(elements).forEach((el: HTMLElement) => {
                    const value = el.dataset[directive.internalDataName];
                    if (directive.internalDataName === 'vBind') {
                        (component as any)[value] = el;
                    }
                });
            }

            private detectChanges() {
                // const currentHtml = VHtmlParser.parse(componentType, declaredComponentOptions.html, this.attributes);
                // if (this._lastKnownHtml !== currentHtml) {
                //     this._lastKnownHtml = currentHtml;
                //     this.forceRebuild();
                // }
            }

            private attachDomEvents(vDomEvent: VDomEvent, component: VComponentType): void {
                if (!this._shadow.children) {
                    return;
                }

                const elements = this._shadow.querySelectorAll<HTMLElement>(`[data-${vDomEvent.publicDataName}]`);
                if (!elements) {
                    return;
                }

                Array.from(elements).forEach((el) => {
                    const methodName = el.dataset[vDomEvent.internalDataName];
                    Array.from(this._shadow.children)
                        .filter((shadowEl) => shadowEl.nodeName !== 'STYLE')
                        .map((shadowEl: HTMLElement) => this.findMethodNameInElement(shadowEl, vDomEvent, methodName))
                        .filter((shadowEl) => shadowEl)
                        .forEach((shadowEl: HTMLElement) => {
                            shadowEl.addEventListener(vDomEvent.domEvent, () => {
                                this.callInternalMethod(component, methodName, shadowEl);
                                this.forceRebuild(); // Re-render since view may have changed
                            });
                        });
                });
            }

            private findMethodNameInElement(element: HTMLElement, vElement: VElement, methodName: string): HTMLElement | undefined {
                const inCurrent = element.dataset[vElement.internalDataName] === methodName;
                if (inCurrent) {
                    return element;
                }

                if (element.hasChildNodes()) {
                    const children = Array.from(element.children);
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i] as HTMLElement;
                        const inChild = this.findMethodNameInElement(child, vElement, methodName);
                        if (inChild) {
                            return inChild;
                        }
                    }
                }

                return undefined;
            }

            private callLifeCycleHook(hook: InternalLifeCycleHook, component: VComponentType): void {
                switch (hook) {
                    case InternalLifeCycleHook.INIT:
                        this.callInternalMethod(component, 'vInit');
                        break;
                    case InternalLifeCycleHook.UNKNOWN:
                    default:
                    // Intended fall-through
                }
            }

            private callInternalMethod(component: VComponentType, methodName: string, htmlElement?: HTMLElement) {
                const componentPrototype = Object.getPrototypeOf(component) || {};
                const componentPrototypePrototype = Object.getPrototypeOf(componentPrototype) || {};
                const methods = Object.getOwnPropertyNames(componentPrototypePrototype);
                if (!methods || methods.length < 1) {
                    return;
                }

                const methodVariables: any[] = [];

                const indexOfFirstParenthesis = methodName.indexOf('(');
                const indexOfLastParenthesis = methodName.indexOf(')');
                if (indexOfFirstParenthesis !== -1 && indexOfLastParenthesis !== -1) {
                    // First, we find the actual values for the variables that we have some references for
                    methodName.substring(indexOfFirstParenthesis + 1, indexOfLastParenthesis)
                        .split(',')
                        .filter(v => v.length > 0)
                        .map(v => getNestedPropertyByStringPath(component, v))
                        .forEach((value) => methodVariables.push(value));

                    // Then, just replace the method name by the name without arguments
                    methodName = methodName.substring(0, indexOfFirstParenthesis);
                }

                const methodIndex = methods.indexOf(methodName);
                if (methodIndex !== -1) {
                    const method = Object.getPrototypeOf(componentPrototype)[methods[methodIndex]].bind(component);
                    if (isEmpty(methodVariables) && htmlElement) {
                        return method(htmlElement);
                    }
                    if (!isEmpty(methodVariables)) {
                        return method(methodVariables);
                    }
                    return method();
                }
            }
        }

        const selector = declaredComponentOptions.selector;
        if (selector.indexOf('-') === -1) {
            throw new VRenderError(`Selector '${selector}' must have a hyphen`);
        }

        const isCustomElementUndefined = !window.customElements.get(selector);
        if (isCustomElementUndefined) {
            window.customElements.define(selector, DeclaredElement);
        }
    }
}
