import {VHostComponent} from "./v-host-component";
import {VHostFactoryOptions} from "./v-host-factory-options";
import {VComponentOptions, VComponentType} from "../../../core";
import {VInternalEventbus} from "../../../core/eventbus/v-internal-eventbus";
import {Type, VInjector} from "../../../core/injector/v-injector";
import {VInternalRendererOptions} from "../../../core/renderer/v-internal-renderer-options";
import {VInternalRenderer} from "../../../core/renderer/v-internal-renderer";

export const vHostFactory = <T extends VComponentType>(factoryOptions: VHostFactoryOptions): () => VHostComponent => {
    const eventBus = VInjector.resolve<VInternalEventbus>(VInternalEventbus, { singleton: true });
    const options: VInternalRendererOptions = {
        selector: 'v-renderer',
        eventBus: eventBus
    };

    const rawComponent: T = VInjector.resolve<T>(factoryOptions.component as Type<T>, { singleton: false });
    const componentOptions: VComponentOptions = (rawComponent as any).vComponentOptions
        ? JSON.parse((rawComponent as any).vComponentOptions) : {};
    const componentOptionsOverride: VComponentOptions = Object.assign({ encapsulationMode: 'open' }, componentOptions);
    const component: T = {vComponentOptions: JSON.stringify(componentOptionsOverride), ...rawComponent};

    const hostOptions: VComponentOptions = {
        selector: 'v-host',
        styles: [],
        html: factoryOptions.hostHtml,
        encapsulationMode: 'open'
    };
    const host: VComponentType = { vComponentOptions: JSON.stringify(hostOptions) };
    const renderer = new VInternalRenderer(options);
    renderer.renderRoot(host, [host, component]);

    return (): VHostComponent => new VHostComponent(eventBus);
}
