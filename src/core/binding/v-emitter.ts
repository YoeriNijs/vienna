import {VInjector} from "../injector/v-injector";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VInternalEmitterData} from "./v-internal-emitter-data";
import {v_INTERNAL_EMITTER_CALLER_NAME} from "./v-emit";

export class VEmitter<D> {
    private readonly _eventBus = VInjector.resolve<VInternalEventbus>(VInternalEventbus);

    publish(data?: D) {
        const callerName = (this as any)[v_INTERNAL_EMITTER_CALLER_NAME];
        const internalEmitterData: VInternalEmitterData<D> = {callerName, data};
        this._eventBus.publish <VInternalEmitterData<D>>(VInternalEventName.EMIT, internalEmitterData);
    }
}