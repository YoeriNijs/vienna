import {VComponentType} from "../component/v-component-type";
import {Type, VInjector} from "../injector/v-injector";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VComponentOptions} from "../component/v-component-options";
import {VInternalTemplate} from "../template-engine/v-internal-template";
import {VInternalTemplateEngine} from "../template-engine/v-internal-template-engine";
import {VInternalEventRebuildData} from "../eventbus/v-internal-event-rebuild-data";
import {V_INTERNAL_COMPONENT_ID} from "../component/v-component";

/**
 * Responsible for creating proxy zones. These zones hold traps that are set to detect component changes. By using traps,
 * it is not needed to do change detection by just diffing various template stamps, which is very expensive.
 */
export class VInternalProxyMapper {

    constructor() {
        // Util class
    }

    map(componentType: Type<VComponentType>, eventBus: VInternalEventbus): VComponentType {
        const component = VInjector.resolve<VComponentType>(componentType, {singleton: false});
        const proxyZone = this.createProxyZone(eventBus);
        return new Proxy(Object.assign(component), proxyZone);
    }

    private createProxyZone(eventBus: VInternalEventbus) {
        this.initRenderHooks(eventBus);

        return {
            set: (component: VComponentType, prop: any, newValue: any) => {
                const oldValue = component[prop];
                if (oldValue === newValue) {
                    return true; // Just indicate that the value is okay
                }

                // We have a change detected. First, write the new value.
                component[prop] = newValue;

                // Next, check exactly which element we need to re-render
                let data = this.createDataWithDirtyHtmlElementIds(component);
                if (data.dirtyElementIds.length > 0) {
                    // View is dirty. Re-render dirty elements.
                    eventBus.publish(VInternalEventName.REBUILD_CHECK, data);
                } else {
                    // View is pristine, but controller is dirty. Re-render entire component by upper v-id.
                    const options: VComponentOptions = JSON.parse(data.component.vComponentOptions);
                    const parser = new DOMParser();
                    const document = parser.parseFromString(options.html, 'text/html');
                    if (document.body && document.body.children.length > 0) {
                        const componentId = document.body.children[0].attributes.getNamedItem(V_INTERNAL_COMPONENT_ID);
                        if (componentId && componentId.value) {
                            data = {...data, dirtyElementIds: [componentId.value] };
                        }
                    }
                    eventBus.publish(VInternalEventName.REBUILD_CHECK, data);
                }

                return true; // Just indicate that the value has been set
            }
        };
    }

    private createDataWithDirtyHtmlElementIds(component: VComponentType): VInternalEventRebuildData {
        const dirtyElementIds: string[] = [];

        const findElementIds = (element: HTMLElement): void => {
            const innerTextWithoutChildNodes = [].reduce.call(element.childNodes, (a: any, b: any) =>
                a + (b.nodeType === 3 ? b.textContent : ''), '');

            if (innerTextWithoutChildNodes.indexOf('{{') !== -1) {
                const template = new VInternalTemplate(element.innerText);
                const rendered = VInternalTemplateEngine.render(template, component);
                const vComponentId = element.attributes.getNamedItem(V_INTERNAL_COMPONENT_ID);
                if (rendered.indexOf('{{') === -1 && vComponentId) {
                    const dirtyElementId = vComponentId.value;
                    if (!dirtyElementIds.includes(dirtyElementId)) {
                        dirtyElementIds.push(dirtyElementId);
                    }
                }
            }
            if (element.hasChildNodes()) {
                Array.from(element.children).forEach((el: HTMLElement) => findElementIds(el));
            }
        }

        const options: VComponentOptions = JSON.parse(component.vComponentOptions);
        const parser = new DOMParser();
        const document = parser.parseFromString(options.html, 'text/html');
        Array.from(document.children).forEach((el: HTMLElement) => findElementIds(el));

        return {component, dirtyElementIds};
    }

    private initRenderHooks(eventBus: VInternalEventbus): void {
        let isRenderingFinished = false;
        eventBus.resubscribe(VInternalEventName.RENDERING_STARTED, () => isRenderingFinished = false);
        eventBus.resubscribe(VInternalEventName.RENDERING_FINISHED, () => isRenderingFinished = true);
        eventBus.resubscribe(VInternalEventName.REBUILD_CHECK, (data: VInternalEventRebuildData) => {
            if (isRenderingFinished) {
                // Only rebuild the app when rendering is finished, otherwise this results in a indefinite loop. Not
                // sure if this is the way to go, but it works for now (YN).
                if (data.dirtyElementIds.length < 1) {
                    eventBus.publish(VInternalEventName.REBUILD);
                } else {
                    eventBus.publish(VInternalEventName.REBUILD_PARTIALLY, data);
                }
            }
        });
    }
}