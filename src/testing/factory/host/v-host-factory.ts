import {VHostComponent} from "./v-host-component";
import {VHostFactoryOptions} from "./v-host-factory-options";
import {VComponentOptions, VComponentType} from "../../../core";
import {VInternalEventbus} from "../../../core/eventbus/v-internal-eventbus";
import {Type, VInjector} from "../../../core/injector/v-injector";
import {VInternalRendererOptions} from "../../../core/renderer/v-internal-renderer-options";
import {VInternalRenderer} from "../../../core/renderer/v-internal-renderer";
import {VInternalEventName} from "../../../core/eventbus/v-internal-event-name";

const createHost = (html: string): VComponentType => {
    const hostOptions: VComponentOptions = {
        selector: 'v-host',
        styles: [],
        html: html,
        encapsulationMode: 'open'
    };
    return {vComponentOptions: JSON.stringify(hostOptions)};
};

const createRenderer = (eventBus: VInternalEventbus): VInternalRenderer => {
    const options: VInternalRendererOptions = {
        selector: 'v-renderer',
        eventBus: eventBus,
        rootElementSelector: 'body' // explicit
    };

    return new VInternalRenderer(options);
};

export const vHostFactory = <T extends VComponentType>(factoryOptions: VHostFactoryOptions): () => VHostComponent => {
    const providedComponentType: Type<T> = factoryOptions.component as Type<T>;
    const providedComponent: T = VInjector.resolve<T>(providedComponentType, {singleton: false});
    const componentOptions: VComponentOptions = providedComponent.vComponentOptions
        ? JSON.parse(providedComponent.vComponentOptions)
        : {};
    const componentOptionsWithOpenMode: VComponentOptions = Object.assign({encapsulationMode: 'open'}, componentOptions);
    const component: T = {vComponentOptions: JSON.stringify(componentOptionsWithOpenMode), ...providedComponent};

    const eventBus = VInjector.resolve<VInternalEventbus>(VInternalEventbus, {singleton: true});
    const renderer = createRenderer(eventBus);
    const host = createHost(factoryOptions.hostHtml);
    renderer.renderAllFromRootNode(host, [host, component]);

    eventBus.subscribe(VInternalEventName.REBUILD, () =>
        renderer.renderAllFromRootNode(host, [host, component]));

    return (): VHostComponent => new VHostComponent(eventBus);
}
