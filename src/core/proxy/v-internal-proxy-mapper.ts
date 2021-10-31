import {VComponentType} from "../component/v-component-type";
import {Type, VInjector} from "../injector/v-injector";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";

/**
 * Responsible for creating proxy zones. These zones hold traps that are set to detect component changes. By using traps,
 * it is not needed to do change detection by just diffing various template stamps, which is very expensive.
 */
export class VInternalProxyMapper {

    constructor() {
        // Util class
    }

    map(_componentType: Type<VComponentType>, _eventBus: VInternalEventbus): VComponentType {
        const component = VInjector.resolve<VComponentType>(_componentType);
        const proxyZone = this.createProxyZone(_eventBus);
        return new Proxy(component, proxyZone);
    }

    private createProxyZone(eventBus: VInternalEventbus) {
        let isRenderingFinished = false;
        eventBus.subscribe(VInternalEventName.RENDERING_STARTED, () => isRenderingFinished = false);
        eventBus.subscribe(VInternalEventName.RENDERING_FINISHED, () => isRenderingFinished = true);
        eventBus.subscribe(VInternalEventName.REBUILD_CHECK, () => {
            if (isRenderingFinished) {
                // Only rebuild the app when rendering is finished, otherwise this results in a indefinite loop. Not
                // sure if this is the way to go, but it works for now (YN).
                eventBus.publish(VInternalEventName.REBUILD);
            }
        })
        return {
            set: (component: VComponentType, prop: any, newValue: any) => {
                const oldValue = component[prop];
                if (oldValue !== undefined && oldValue !== newValue) {
                    // We have a change detected. First, write the new value.
                    component[prop] = newValue;

                    // Okay, check if we can rebuild the app already.
                    eventBus.publish(VInternalEventName.REBUILD_CHECK);
                }
                component[prop] = newValue;

                return true; // Just indicate that the value has been set
            }
        };
    }
}