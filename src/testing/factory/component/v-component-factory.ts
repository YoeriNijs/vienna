import {VComponentFactoryOptions} from "./v-component-factory-options";
import {VTestComponent} from "./v-test-component";
import {VComponentOptions, VComponentType} from "../../../core";
import {VInternalEventbus} from "../../../core/eventbus/v-internal-eventbus";
import {Type, VInjector} from "../../../core/injector/v-injector";
import {VInternalRendererOptions} from "../../../core/renderer/v-internal-renderer-options";
import {VInternalRenderer} from "../../../core/renderer/v-internal-renderer";

export const vComponentFactory = <T extends VComponentType>(factoryOptions: VComponentFactoryOptions): () => VTestComponent<T> => {
    const eventBus = VInjector.resolve<VInternalEventbus>(VInternalEventbus, { singleton: true });
    const options: VInternalRendererOptions = {
        selector: 'v-renderer',
        eventBus: eventBus
    };

    const component: T = VInjector.resolve<T>(factoryOptions.component as Type<T>, { singleton: false });

    // Override encapsulation mode to query shadowroot
    const componentOptions: VComponentOptions = (component as any).vComponentOptions
        ? JSON.parse((component as any).vComponentOptions) : {};
    const optionsOverride: VComponentOptions = Object.assign({ encapsulationMode: 'open' }, componentOptions);
    const clone: T = {vComponentOptions: JSON.stringify(optionsOverride), ...component};

    const renderer = new VInternalRenderer(options);
    renderer.renderRoot(clone, [clone]);

    return (): VTestComponent<T> => new VTestComponent<T>(clone, eventBus);
}
