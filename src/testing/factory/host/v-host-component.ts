import {VInternalEventbus} from "../../../core/eventbus/v-internal-eventbus";
import {VInternalEventName} from "../../../core/eventbus/v-internal-event-name";

export class VHostComponent {
    private readonly _eventBus: VInternalEventbus;

    constructor(eventBus: VInternalEventbus) {
        this._eventBus = eventBus;
    }

    detectChanges(): void {
        this._eventBus.publish(VInternalEventName.REBUILD);
    }

    get host(): ShadowRoot {
        return document.querySelector('v-host').shadowRoot;
    }

    get hostHtml(): string {
        return this.host.innerHTML;
    }

    get component(): ShadowRoot {
        return this.host.querySelector('body').children[0].shadowRoot;
    }

    get componentStyles(): string {
        return this.component.querySelector('head style').innerHTML;
    }

    get componentHtml(): string {
        return this.component.querySelector('body').innerHTML;
    }

    queryHost(selector: string): HTMLElement {
        return this.host.querySelector(selector);
    }

    queryHostAll(selector: string): HTMLElement[] {
        return Array.from(this.host.querySelectorAll(selector)).map(node => node as HTMLElement);
    }

    queryComponent(selector: string): HTMLElement {
        return this.component.querySelector(selector);
    }

    queryComponentAll(selector: string): HTMLElement[] {
        return Array.from(this.component.querySelectorAll(selector)).map(node => node as HTMLElement);
    }
}
