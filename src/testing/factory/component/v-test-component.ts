import {VComponentOptions, VComponentType} from "../../../core";
import {VInternalEventbus} from "../../../core/eventbus/v-internal-eventbus";
import {VInternalEventName} from "../../../core/eventbus/v-internal-event-name";

export class VTestComponent<T extends VComponentType> {
    private readonly _component: T;
    private readonly _eventBus: VInternalEventbus;

    constructor(component: T, eventBus: VInternalEventbus) {
        this._component = component;
        this._eventBus = eventBus;
    }

    detectChanges(): void {
        this._eventBus.publish(VInternalEventName.REBUILD);
    }

    get component(): ShadowRoot {
        const options: VComponentOptions = JSON.parse(this._component.vComponentOptions);
        return document.querySelector(options.selector).shadowRoot;
    }

    get styles(): string {
        return this.component.querySelector('head style').innerHTML;
    }

    get html(): string {
        return this.component.querySelector('body').innerHTML;
    }
}
