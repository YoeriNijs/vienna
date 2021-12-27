import {V_INTERNAL_COMPONENT_ID, VComponentOptions, VComponentType} from "../../../core";
import {VInternalEventbus} from "../../../core/eventbus/v-internal-eventbus";
import {VInternalEventName} from "../../../core/eventbus/v-internal-event-name";
import {VInternalApplicationSelectors} from "../../../core/application/v-internal-application-selectors";

export class VTestComponent<T extends VComponentType> {
    private readonly _component: T;
    private readonly _eventBus: VInternalEventbus;

    constructor(component: T, eventBus: VInternalEventbus) {
        this._component = component;
        this._eventBus = eventBus;
    }

    get component(): ShadowRoot {
        const options: VComponentOptions = JSON.parse(this._component.vComponentOptions);
        const shadowRoot = document.querySelector(options.selector).shadowRoot;
        Array.from(shadowRoot.children).forEach(c => this.removeUniqueId(c));
        return shadowRoot;
    }

    get styles(): string {
        const styles = this.component.querySelectorAll('style');
        return Array.from(styles).reduce((prev, current) => prev + current.innerHTML, '');
    }

    get html(): string {
        return this.component.innerHTML
            .replace('<style>', '')
            .replace('</style>', '')
            .replace(this.styles, '')
            .replace(`<${VInternalApplicationSelectors.V_COMPONENT_WRAPPER}>`, '')
            .replace(`</${VInternalApplicationSelectors.V_COMPONENT_WRAPPER}>`, '')
    }

    detectChanges(): void {
        this._eventBus.publish(VInternalEventName.REBUILD);
    }

    query(selector: string): HTMLElement {
        return this.component.querySelector(selector);
    }

    queryAll(selector: string): HTMLElement[] {
        return Array.from(this.component.querySelectorAll(selector)).map(node => node as HTMLElement);
    }

    private removeUniqueId(element: Element): Element {
        element.removeAttribute(V_INTERNAL_COMPONENT_ID);
        if (element.hasChildNodes()) {
            Array.from(element.children).forEach(c => this.removeUniqueId(c));
        }
        return element;
    }
}
