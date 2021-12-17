import {VInternalRendererOptions} from './v-internal-renderer-options';
import {VComponentOptions} from '../component/v-component-options';
import {VRenderError} from "./v-render-error";
import {VComponentType} from '../component/v-component-type';
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {getDefinedOrElse} from "../util/v-internal-object-util";
import {VInternalComponentBuilder} from "./v-internal-component-builder";

export class VInternalRenderer {

    private readonly _view: HTMLElement;
    private readonly _eventBus: VInternalEventbus;

    constructor(options: VInternalRendererOptions) {
        this._eventBus = options.eventBus;
        this._view = document.createElement(options.selector);

        const rootElementSelector = options.rootElementSelector || 'body';
        const rootElement = getDefinedOrElse(document.querySelector(rootElementSelector), () => {
            throw new VRenderError(`Missing or invalid root element '${rootElementSelector}'!`);
        });
        while (rootElement.firstChild) {
            rootElement.removeChild(rootElement.firstChild);
        }
        rootElement.append(this._view);
    }

    public renderAllFromRootNode(component: unknown & VComponentType, allComponents: VComponentType[]) {
        // Notify listeners that rendering has started
        this._eventBus.publish(VInternalEventName.RENDERING_STARTED);

        // First, clean up the entire view
        this._view.innerHTML = '';

        // Then, initialize all webcomponents
        VInternalComponentBuilder.buildAndDefineWebComponents(allComponents, this._eventBus);

        // Then, append the root node to the dom, which holds the webcomponents
        const rootOptions: VComponentOptions = JSON.parse(component.vComponentOptions);
        this._view.innerHTML = `<${rootOptions.selector}></${rootOptions.selector}>`;

        // Notify users that rendering is done
        this._eventBus.publish(VInternalEventName.RENDERING_FINISHED);
    }


}
