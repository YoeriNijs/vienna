import {VComponentFactoryOptions} from "./v-component-factory-options";
import {VTestComponent} from "./v-test-component";
import {VComponentOptions, VComponentType} from "../../../core";
import {VInternalEventbus} from "../../../core/eventbus/v-internal-eventbus";
import {Type, VInjector} from "../../../core/injector/v-injector";
import {VInternalRendererOptions} from "../../../core/renderer/v-internal-renderer-options";
import {VInternalRenderer} from "../../../core/renderer/v-internal-renderer";
import {VInternalEventName} from "../../../core/eventbus/v-internal-event-name";

export const vComponentFactory = <T extends VComponentType>(factoryOptions: VComponentFactoryOptions): () => VTestComponent<T> => {
    const providedComponentType: Type<T> = factoryOptions.component as Type<T>;
    const eventBus = VInjector.resolve<VInternalEventbus>(VInternalEventbus, {singleton: true});
    const options: VInternalRendererOptions = {
        selector: 'v-renderer',
        eventBus: eventBus,
        encapsulationModeOverride: 'open'
    };

    const renderer = new VInternalRenderer(options);
    renderer.renderAllFromRootNode(providedComponentType, [providedComponentType]);

    eventBus.subscribe(VInternalEventName.REBUILD, () =>
        renderer.renderAllFromRootNode(providedComponentType, [providedComponentType]));

    const providedComponent: T = VInjector.resolve<T>(providedComponentType, {singleton: false});
    const componentOptions: VComponentOptions = (providedComponent as any).vComponentOptions
        ? JSON.parse((providedComponent as any).vComponentOptions)
        : {};
    const optionsWithOpenEncapsulation: VComponentOptions = Object.assign({encapsulationMode: 'open'}, componentOptions);
    const component: T = {vComponentOptions: JSON.stringify(optionsWithOpenEncapsulation), ...providedComponent};

    return (): VTestComponent<T> => new VTestComponent<T>(component, eventBus);
}
