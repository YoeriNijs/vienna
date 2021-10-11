import {isEmpty} from 'pincet';
import {VRendererOptions} from './v-renderer-options';
import {VComponentOptions} from '../component/v-component-options';
import {VInternalComponent} from '../internal/v-internal-component';
import {VComponentType} from '../router/v-route';
import {VRendererUtil} from './v-renderer-util';
import {VRenderError} from "./v-render-error";
import {VHtmlParser} from "./v-html-parser";
import {VRenderEvents} from "./v-render-events";

interface VElement {
    publicDataName: string;
    internalDataName: string;
}

interface VDomEvent extends VElement {
    domEvent: string;
}

interface VAttributeDirective extends VElement {
}

const SUPPORTED_DOM_EVENTS: VDomEvent[] = [
    {publicDataName: 'v-click', internalDataName: 'vClick', domEvent: 'click'},
];

const SUPPORTED_ATTRIBUTE_DIRECTIVES: VAttributeDirective[] = [
    {publicDataName: 'v-if', internalDataName: 'vIf'},
    {publicDataName: 'v-if-not', internalDataName: 'vIfNot'},
    {publicDataName: 'v-for', internalDataName: 'vFor'},
];

enum InternalLifeCycleHook {
    INIT,
    UNKNOWN
}

@VInternalComponent({
    name: 'VRenderer',
})
export class VRenderer {
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

                const componentHtml = VHtmlParser.parse(componentType, declaredComponentOptions.html);
                this._lastKnownHtml = componentHtml;

                const parser = new DOMParser();
                const dom = parser.parseFromString(componentHtml, 'text/html');

                // Attach supported attribute directives
                SUPPORTED_ATTRIBUTE_DIRECTIVES.forEach((vAttributeDirective) => this.attachAttributeDirective(vAttributeDirective, componentType, dom));

                const htmlContainer = dom.createElement(`${declaredComponentOptions.selector}-body`);
                htmlContainer.innerHTML = dom.body.innerHTML;
                this._shadow.appendChild(htmlContainer);

                // Attach supported dom events
                SUPPORTED_DOM_EVENTS.forEach((vDomEvent) => this.attachDomEvents(vDomEvent, componentType));

                // Call init lifecycle hook
                this.callLifeCycleHook(InternalLifeCycleHook.INIT, componentType);

                // Enable change detection loop
                setInterval(() => this.detectChanges(), 300);
            }

            private detectChanges() {
                const currentHtml = VHtmlParser.parse(componentType, declaredComponentOptions.html);
                if (this._lastKnownHtml !== currentHtml) {
                    this._lastKnownHtml = currentHtml;
                    this.forceRebuild();
                }
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
                    const methodName = el.dataset[directive.internalDataName];
                    if (directive.internalDataName === 'vIf') {
                        const shouldRender = this.callInternalMethod(component, methodName, el);
                        if (!shouldRender) {
                            el.parentNode.removeChild(el);
                        }
                    } else if (directive.internalDataName === 'vIfNot') {
                        const shouldNotRender = this.callInternalMethod(component, methodName, el);
                        if (shouldNotRender) {
                            el.parentNode.removeChild(el);
                        }
                    } else if (directive.internalDataName === 'vFor') {
                        const number = this.callInternalMethod(component, methodName, el);
                        for (let i = 0; i < number; i++) {
                            const clone = el.cloneNode(true);
                            el.parentNode.insertBefore(clone, el);
                        }
                    }
                });
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
                            return child;
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
                        .map((variableName) => VRendererUtil.getObjectValueForTemplateReference(component, variableName))
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
