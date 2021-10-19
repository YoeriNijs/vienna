import {VInternalEventbus} from "../v-internal-eventbus";
import {VInternalEventName} from "../v-internal-event-name";

describe('InternalEventBus', () => {

    let eventBus: VInternalEventbus;

    beforeEach(() => eventBus = new VInternalEventbus());

    it.each(Object.values(VInternalEventName))('should be able to publish and subscribe event with name %s', (eventName) => {
        let value;
        eventBus.subscribe<string>(eventName, (v) => value = v);
        eventBus.publish(eventName, 'event data');
        expect(value).toEqual('event data');
    });

    it('should be able to subscribe two events', () => {
        const values: string[] = [];
        eventBus.subscribe<string>(VInternalEventName.REBUILD, (v) => values.push(`${v}_a`));
        eventBus.subscribe<string>(VInternalEventName.REBUILD, (v) => values.push(`${v}_b`));
        eventBus.publish(VInternalEventName.REBUILD, 'data');
        expect(values).toEqual(['data_a', 'data_b']);
    });

    it('should be able to publish two different values', () => {
        const values: string[] = [];
        eventBus.subscribe<string>(VInternalEventName.REBUILD, (v) => values.push(v));
        eventBus.publish(VInternalEventName.REBUILD, 'data_a');
        eventBus.publish(VInternalEventName.REBUILD, 'data_b');
        expect(values).toEqual(['data_a', 'data_b']);
    });
});
