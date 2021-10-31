import {VComponent} from "../../component/v-component";
import {VInternalProxyMapper} from "../v-internal-proxy-mapper";
import {VInternalEventbus} from "../../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../../eventbus/v-internal-event-name";

@VComponent({
    selector: 'proxy-mapper-component',
    styles: [],
    html: ``
})
export class ProxyMapperComponent {
    checked = false;
}

describe('VInternalProxyMapper', () => {

    let mapper: VInternalProxyMapper;
    let eventBus: VInternalEventbus;

    beforeEach(() => {
        mapper = new VInternalProxyMapper();
        eventBus = new VInternalEventbus();
    });

    it('should create', () => {
        const proxy = mapper.map(ProxyMapperComponent, eventBus);
        expect(proxy).toBeDefined();
    });

    it('should not rebuild when rendering has finished', () => {
        let rebuild = false;

        eventBus.subscribe(VInternalEventName.REBUILD, () => rebuild = true);
        const proxy = mapper.map(ProxyMapperComponent, eventBus);

        proxy.checked = true;
        expect(rebuild).toBe(false);
    });

    it('should not rebuild when rendering has re-started', () => {
        let rebuild = false;
        eventBus.subscribe(VInternalEventName.REBUILD, () => rebuild = true);

        const proxy = mapper.map(ProxyMapperComponent, eventBus);
        eventBus.publish(VInternalEventName.RENDERING_FINISHED);
        eventBus.publish(VInternalEventName.RENDERING_STARTED);

        proxy.checked = true;
        expect(rebuild).toBe(false);
    });

    it('should rebuild when rendering has finished', () => {
        let rebuild = false;
        eventBus.subscribe(VInternalEventName.REBUILD, () => rebuild = true);

        const proxy = mapper.map(ProxyMapperComponent, eventBus);
        eventBus.publish(VInternalEventName.RENDERING_FINISHED);

        proxy.checked = true;
        expect(rebuild).toBe(true);
    });
});