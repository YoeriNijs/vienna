import {isEmpty} from 'pincet';
import {VInternalRendererOptions} from './v-internal-renderer-options';
import {VComponentOptions} from '../component/v-component-options';
import {VInternalComponent} from '../internal/v-internal-component';
import {VRenderError} from "./v-render-error";
import {VRenderEvents} from "./v-render-events";
import {VComponentType} from '../component/v-component-type';
import {VInternalHtmlTransformer} from "./transformers/html/v-internal-html-transformer";
import {VInternalTemplateTransformer} from "./transformers/html/v-internal-template-transformer";
import {getNestedPropertyByStringPath} from "../util/v-internal-object-util";
import {VInternalStyleTransformer} from "./transformers/html/v-internal-style-transformer";
import {VInternalControllerTransformer} from "./transformers/controller/v-internal-controller-transformer";
import {VInternalAttributeTransformer} from "./transformers/controller/v-internal-attribute-transformer";
import {VInternalCheckTransformer} from "./transformers/html/v-internal-check-transformer";
import {VInternalRepeatTransformer} from "./transformers/html/v-internal-repeat-transformer";

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

    constructor(options: VInternalRendererOptions) {
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

        const options: VComponentOptions = JSON.parse(componentType.vComponentOptions);

        class DeclaredElement extends HTMLElement {

            private _shadow: ShadowRoot;
            private _controllerTransformers: VInternalControllerTransformer[] = [
                new VInternalAttributeTransformer()
            ];
            private _htmlTransformers: VInternalHtmlTransformer[] = [
                new VInternalRepeatTransformer(),
                new VInternalTemplateTransformer(),
                new VInternalStyleTransformer(),
                new VInternalCheckTransformer()
            ];

            constructor() {
                super();

                const mode = options.encapsulationMode ? options.encapsulationMode : 'closed';
                this._shadow = this.attachShadow({mode});

                this.render();
            }

            forceRebuild() {
                const event = new CustomEvent(VRenderEvents.REBUILD);
                document.dispatchEvent(event);
            }

            render() {
                // Transform internal component state
                const component = this._controllerTransformers.reduce((component, transformer) => {
                    return transformer.transform(component, this.attributes);
                }, componentType);

                // Transform visible component view
                const html = this._htmlTransformers.reduce((html, transformer) => {
                    return transformer.transform(html, component, this.attributes)
                }, options.html);

                // Attach supported attribute directives
                const parser = new DOMParser();
                const dom = parser.parseFromString(html, 'text/html');
                // SUPPORTED_ATTRIBUTE_MANIPULATORS.forEach((vAttributeDirective) => this.attachAttributeDirective(vAttributeDirective, component, dom));

                this._shadow.append(dom.head, dom.body);

                // Attach supported dom events
                SUPPORTED_DOM_EVENTS.forEach((vDomEvent) => this.attachDomEvents(vDomEvent, component));

                // Bind
                SUPPORTED_ATTRIBUTE_BINDINGS.forEach((b) => this.bind(b, component));

                // Call init lifecycle hook
                this.callLifeCycleHook(InternalLifeCycleHook.INIT, component);

                // Todo: replace this setInterval by proxy
                // Enable change detection loop
                // setInterval(() => this.detectChanges(), 300);
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

        const selector = options.selector;
        if (selector.indexOf('-') === -1) {
            throw new VRenderError(`Selector '${selector}' must have a hyphen`);
        }

        const isCustomElementUndefined = !window.customElements.get(selector);
        if (isCustomElementUndefined) {
            window.customElements.define(selector, DeclaredElement);
        }
    }
}
