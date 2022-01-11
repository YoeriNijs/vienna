import {VInternalRendererOptions} from './v-internal-renderer-options';
import {VComponentOptions} from '../component/v-component-options';
import {VRenderError} from "./v-render-error";
import {VComponentType} from '../component/v-component-type';
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {getAllMethods, getDefinedOrElse} from "../util/v-internal-object-util";
import {Type} from "../injector/v-injector";
import {VInternalProxyMapper} from "../proxy/v-internal-proxy-mapper";
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
import {VInternalEventRebuildData} from "../eventbus/v-internal-event-rebuild-data";
import {V_INTERNAL_COMPONENT_ID} from "../component/v-component";
import {VInternalTemplate} from "../template-engine/v-internal-template";
import {VInternalTemplateEngine} from "../template-engine/v-internal-template-engine";
import {isEmpty} from "pincet";
import {VComponentEncapsulationMode} from "../component/v-component-encapsulation";

interface ComponentAndType {
    type: Type<VComponentType>;
    component: VComponentType;
}

interface Range {
    start: number;
    end: number;
}

const emptyMethod = () => {
    // Ignore
};

const createComponentClass = (componentType: Type<VComponentType>, eventBus: VInternalEventbus,
                              encapsulationModeOverride: VComponentEncapsulationMode) => {
    return class VInternalViennaComponent extends HTMLElement {
        private readonly _proxyMapper = new VInternalProxyMapper();

        private _component: VComponentType;
        private _intervalRange: Range;
        private _timeoutRange: Range;

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
            new VInternalEmitAttacher(),
            new VInternalDomEventAttacher()
        ]

        connectedCallback() {
            const startIntervalId = window.setInterval(emptyMethod, 0);
            const startTimeoutId = window.setTimeout(emptyMethod, 0);

            this._component = this._proxyMapper.map(componentType, eventBus);
            this._component = this.transformInternalComponentType(this._component);

            const shadowRoot = this.createShadowRoot(this._component);
            this.updateHtml(this._component, shadowRoot);

            const vInit = getAllMethods(componentType.prototype).find(m => m === 'vInit');
            if (vInit) {
                this._component[vInit] = componentType.prototype[vInit];
                this._component[vInit]();
                this.updateHtml(this._component, shadowRoot);
            }

            this.attachBindings(this._component, shadowRoot);

            eventBus.subscribe(VInternalEventName.REBUILD_PARTIALLY, (data: VInternalEventRebuildData) => {
                // Notify subscribers that we are currently rendering something
                eventBus.publish(VInternalEventName.RENDERING_STARTED);

                data.dirtyElementIds.forEach(id => this.rerenderPartialHtml(shadowRoot, data.component, id));

                // Notify subscribers that we are done rendering
                eventBus.publish(VInternalEventName.RENDERING_FINISHED);
            });

            const endIntervalId = window.setInterval(emptyMethod, 0);
            this._intervalRange = {start: startIntervalId, end: endIntervalId};

            const endTimeoutId = window.setTimeout(emptyMethod, 0);
            this._timeoutRange = {start: startTimeoutId, end: endTimeoutId};
        }

        disconnectedCallback(): void {
            const vDestroy = getAllMethods(componentType.prototype).find(m => m === 'vDestroy');
            if (vDestroy) {
                this._component[vDestroy] = componentType.prototype[vDestroy];
                this._component[vDestroy]();
            }

            // Clear intervals for this component only
            const intervalStart = this._intervalRange.start;
            const intervalEnd = this._intervalRange.end;
            let intervalIdToRemove = this._intervalRange.end;
            while (intervalIdToRemove-- && intervalEnd >= intervalStart) {
                window.clearInterval(intervalIdToRemove)
            }

            // Clear timeouts for this component only
            const timeoutStart = this._timeoutRange.start;
            const timeoutEnd = this._timeoutRange.end;
            let timeoutIdToRemove = this._timeoutRange.end;
            while (timeoutIdToRemove-- && timeoutEnd >= timeoutStart) {
                window.clearTimeout(timeoutIdToRemove)
            }

            this._component = null;
        }

        private createShadowRoot(component: VComponentType): ShadowRoot {
            const options: VComponentOptions = JSON.parse(component.vComponentOptions);
            const mode = encapsulationModeOverride ? encapsulationModeOverride :
                options.encapsulationMode ? options.encapsulationMode : 'closed';
            return this.attachShadow({mode});
        }

        private transformInternalComponentType(component: VComponentType): VComponentType {
            return this._controllerTransformers
                .filter(transformer => transformer.accept(component, this.attributes))
                .reduce((component, transformer) =>
                    transformer.transform(component, this.attributes), component);
        }

        private attachBindings(component: VComponentType, shadowRoot: ShadowRoot) {
            this._attachers
                .filter(a => a.accept(component, shadowRoot))
                .forEach(a => a.attach(component, shadowRoot, {
                    callInternalMethod: this.callInternalMethod,
                    forceRerendering: () => {
                        this.updateHtml(component, shadowRoot);
                        this.attachBindings(component, shadowRoot);
                    }
                }));
        }

        private updateHtml(component: VComponentType, shadowRoot: ShadowRoot) {
            const options: VComponentOptions = JSON.parse(component.vComponentOptions);
            shadowRoot.innerHTML = this._htmlTransformers.reduce((html, transformer) =>
                transformer.transform(html, component, this.attributes), options.html);
        }

        private rerenderPartialHtml(shadowRoot: ShadowRoot, componentState: VComponentType, dirtyElementId: string) {
            if (!componentState) {
                throw new VRenderError(`Unknown state for component with dirty element id: '${dirtyElementId}'`);
            }
            const options: VComponentOptions = JSON.parse(componentState.vComponentOptions);
            const parser = new DOMParser();
            const document = parser.parseFromString(options.html, 'text/html');
            const original = document.querySelector(`[${V_INTERNAL_COMPONENT_ID}="${dirtyElementId}"]`);
            const current = shadowRoot.querySelector(`[${V_INTERNAL_COMPONENT_ID}="${dirtyElementId}"]`);
            if (original && current && original !== current) {
                current.innerHTML = this._htmlTransformers.reduce((html, transformer) =>
                    transformer.transform(html, componentState, this.attributes), original.innerHTML);
            }
        }

        private callInternalMethod(component: VComponentType, methodName: string, htmlElement?: HTMLElement, data?: any): void {
            const methods = getAllMethods(componentType.prototype);
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
                const method = Object.getPrototypeOf(componentType.prototype)[methods[methodIndex]].bind(component);
                if (isEmpty(methodVariables) && htmlElement) {
                    return method(htmlElement);
                }
                if (!isEmpty(methodVariables)) {
                    return method(methodVariables);
                }
                return method();
            }
        }
    };
}

export class VInternalRenderer {

    private readonly _eventBus: VInternalEventbus;
    private readonly _view: HTMLElement;
    private readonly _encapsulationModeOverride: "open" | "closed";
    private readonly _proxyMapper: VInternalProxyMapper = new VInternalProxyMapper();

    constructor(options: VInternalRendererOptions) {
        this._eventBus = options.eventBus;
        this._view = document.createElement(options.selector);
        this._encapsulationModeOverride = options.encapsulationModeOverride || null;

        const rootElementSelector = options.rootElementSelector || 'body';
        const rootElement = getDefinedOrElse(document.querySelector(rootElementSelector), () => {
            throw new VRenderError(`Missing or invalid root element '${rootElementSelector}'!`);
        });
        while (rootElement.firstChild) {
            rootElement.removeChild(rootElement.firstChild);
        }
        rootElement.append(this._view);
    }

    public renderAllFromRootNode(root: unknown & Type<VComponentType>, declarations: Type<VComponentType>[]) {
        // Notify subscribers that rendering has started
        this._eventBus.publish(VInternalEventName.RENDERING_STARTED);

        // First, clean up the entire view
        this._view.innerHTML = '';

        // Then, initialize all webcomponents
        this.buildAndDefineWebComponents(declarations, this._eventBus);

        // Then, append the root node to the dom, which holds the webcomponents
        const rootComponent = this._proxyMapper.map(root, this._eventBus);
        const rootOptions: VComponentOptions = JSON.parse(rootComponent.vComponentOptions);
        this._view.innerHTML = `<${rootOptions.selector}></${rootOptions.selector}>`;

        // Notify subscribers that rendering is done
        this._eventBus.publish(VInternalEventName.RENDERING_FINISHED);
    }

    private buildAndDefineWebComponents(componentTypes: Type<VComponentType>[], eventBus: VInternalEventbus) {
        componentTypes.map(cType => ({type: cType, component: this._proxyMapper.map(cType, eventBus)}))
            .filter(componentAndType => componentAndType.component)
            .forEach(componentAndType => this.createWebComponent(componentAndType, eventBus));
    }

    private createWebComponent(componentAndType: ComponentAndType, eventBus: VInternalEventbus) {
        if (!componentAndType.component.vComponentOptions) {
            throw new VRenderError('Component is not a Vienna component!');
        }

        const options: VComponentOptions = JSON.parse(componentAndType.component.vComponentOptions);
        const selector = options.selector;
        if (selector.indexOf('-') === -1) {
            throw new VRenderError(`Selector '${selector}' must have a hyphen`);
        }

        const isCustomElementUndefined = !window.customElements.get(selector);
        if (isCustomElementUndefined) {
            const clazz = createComponentClass(componentAndType.type, eventBus, this._encapsulationModeOverride);
            window.customElements.define(selector, clazz);
        }
    }
}
