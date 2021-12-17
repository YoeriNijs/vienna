import {VComponentType} from "../component/v-component-type";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VRenderError} from "./v-render-error";
import {VComponentOptions} from "../component/v-component-options";
import {VInternalControllerTransformer} from "./transformers/controller/v-internal-controller-transformer";
import {VInternalPropTransformer} from "./transformers/controller/v-internal-prop-transformer";
import {VInternalHtmlTransformer} from "./transformers/html/v-internal-html-transformer";
import {VInternalHtmlAttributeTransformer} from "./transformers/html/v-internal-html-attribute-transformer";
import {VInternalRepeatTransformer} from "./transformers/html/v-internal-repeat-transformer";
import {VInternalTemplateTransformer} from "./transformers/html/v-internal-template-transformer";
import {VInternalStyleTransformer} from "./transformers/html/v-internal-style-transformer";
import {VInternalCheckTransformer} from "./transformers/html/v-internal-check-transformer";
import {VInternalAttacher} from "./attachers/v-internal-attacher";
import {VInternalBindAttacher} from "./attachers/v-internal-bind-attacher";
import {VInternalDomEventAttacher} from "./attachers/v-internal-dom-event-attacher";
import {VInternalEmitAttacher} from "./attachers/v-internal-emit-attacher";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VInternalEventRebuildData} from "../eventbus/v-internal-event-rebuild-data";
import {VInternalTemplate} from "../template-engine/v-internal-template";
import {VInternalTemplateEngine} from "../template-engine/v-internal-template-engine";
import {isEmpty} from "pincet";
import {V_INTERNAL_COMPONENT_ID} from "../component/v-component";

type InternalLifeCycleHook = 'init' | 'destroy' | 'unknown';

export class VInternalComponentBuilder {

    private constructor() {
        // Util
    }

    static buildAndDefineWebComponents(componentTypes: VComponentType[], eventBus: VInternalEventbus) {
        componentTypes.forEach(componentType => {
            if (!componentType.vComponentOptions) {
                throw new VRenderError('Component is not a Vienna Component');
            }

            const options: VComponentOptions = JSON.parse(componentType.vComponentOptions);

            class ViennaWebComponent extends HTMLElement {

                private readonly _shadow: ShadowRoot;

                private _controllerTransformers: VInternalControllerTransformer[] = [
                    new VInternalPropTransformer()
                ];
                private _htmlTransformers: VInternalHtmlTransformer[] = [
                    new VInternalHtmlAttributeTransformer(),
                    new VInternalRepeatTransformer(),
                    new VInternalTemplateTransformer(),
                    new VInternalStyleTransformer(),
                    new VInternalCheckTransformer()
                ];
                private _attachers: VInternalAttacher[] = [
                    new VInternalBindAttacher(),
                    new VInternalDomEventAttacher(),
                    new VInternalEmitAttacher()
                ]

                constructor() {
                    super();

                    const mode = options.encapsulationMode ? options.encapsulationMode : 'closed';
                    this._shadow = this.attachShadow({mode});

                    eventBus.subscribe(VInternalEventName.REBUILD_PARTIALLY, (data: VInternalEventRebuildData) => {
                        data.dirtyElementIds.forEach(dirtyElementId => this.rerenderDirtyElement(dirtyElementId));
                    });

                    this.render();
                }

                render() {
                    const component = this.transformInternalComponentState();
                    const html = this.transformComponentView(component, options.html);

                    // Attach supported attribute directives
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(html, 'text/html');

                    // Append element to shadow dom
                    this._shadow.append(dom.head, dom.body);

                    // Attach events, bindings and so on
                    this._attachers
                        .filter(a => a.accept(component, this._shadow))
                        .forEach(a => a.attach(component, this._shadow, {
                            callInternalMethod: this.callInternalMethod,
                            forceRebuild: this.forceRebuild
                        }));

                    // Call init lifecycle hook
                    this.callLifeCycleHook('init', componentType);
                }

                disconnectedCallback(): void {
                    // Call destroy hook, so that components are able to clean up their own logic, such as setInterval
                    // functions and so on.
                    this.callLifeCycleHook('destroy', componentType);
                }

                private forceRebuild(): void {
                    this.callLifeCycleHook('destroy', componentType);
                    eventBus.publish(VInternalEventName.REBUILD);
                }

                private transformComponentView(component: VComponentType, componentHtml: string): string {
                    return this._htmlTransformers.reduce((html, transformer) => {
                        return transformer.transform(html, component, this.attributes)
                    }, componentHtml);
                }

                private transformInternalComponentState(): VComponentType {
                    return this._controllerTransformers
                        .filter(transformer => transformer.accept(componentType, this.attributes))
                        .reduce((component, transformer) =>
                            transformer.transform(component, this.attributes), componentType);
                }

                private callLifeCycleHook(hook: InternalLifeCycleHook, component: VComponentType): void {
                    switch (hook) {
                        case 'init':
                            this.callInternalMethod(component, 'vInit');
                            break;
                        case 'destroy':
                            this.callInternalMethod(component, 'vDestroy');
                            break;
                        case 'unknown':
                        default:
                        // Intended fall-through
                    }
                }

                private callInternalMethod(component: VComponentType, methodName: string, htmlElement?: HTMLElement, data?: any): void {
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
                        if (data) {
                            methodVariables.push(data);
                            methodName = methodName.substring(0, indexOfFirstParenthesis);
                        } else {
                            // First, we find the actual values for the variables that we have some references for
                            const actualValues = methodName.substring(indexOfFirstParenthesis + 1, indexOfLastParenthesis)
                                .split(',')
                                .filter(v => v.length > 0)
                                .map(v => {
                                    const template = new VInternalTemplate(v);
                                    return VInternalTemplateEngine.render(template, component);
                                });
                            methodVariables.push(...actualValues);

                            // Then, just replace the method name by the name without arguments
                            methodName = methodName.substring(0, indexOfFirstParenthesis);
                        }
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

                private rerenderDirtyElement(dirtyElementId: string) {
                    const parser = new DOMParser();
                    const document = parser.parseFromString(options.html, 'text/html');
                    const original = document.querySelector(`[${V_INTERNAL_COMPONENT_ID}="${dirtyElementId}"]`);
                    const current = this._shadow.querySelector(`[${V_INTERNAL_COMPONENT_ID}="${dirtyElementId}"]`);
                    if (original && current) {
                        this.transformInternalComponentState();
                        current.innerHTML = this.transformComponentView(componentType, original.innerHTML);
                    }
                }
            }

            const selector = options.selector;
            if (selector.indexOf('-') === -1) {
                throw new VRenderError(`Selector '${selector}' must have a hyphen`);
            }

            const isCustomElementUndefined = !window.customElements.get(selector);
            if (isCustomElementUndefined) {
                window.customElements.define(selector, ViennaWebComponent);
            }
        });
    }
}
