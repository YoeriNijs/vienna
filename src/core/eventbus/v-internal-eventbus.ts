import {VInternalEventName} from "./v-internal-event-name";
import {VInjectable} from "../injector/v-injectable-decorator";

@VInjectable({singleton: true})
export class VInternalEventbus {

    private _subscribers: { [eventName: string]: any } = [];

    publish<T>(eventName: VInternalEventName, data?: T): void {
        if (this._subscribers[eventName]) {
            this._subscribers[eventName].forEach((callback: any) => callback(data));
        }
    }

    subscribe<T>(eventName: VInternalEventName, callback: (data?: T) => void): void {
        if (this._subscribers[eventName]) {
            this._subscribers[eventName].push(callback);
        } else {
            this._subscribers[eventName] = [callback];
        }
    }
}
