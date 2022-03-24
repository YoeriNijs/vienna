import {VLogSenderSettings} from "./v-log-sender-settings";
import {VLog} from "./v-log";
import {VInjectable} from "../injector/v-injectable-decorator";

@VInjectable({ singleton: true })
export class VInternalLogSender {

    private _settings: VLogSenderSettings;

    registerSettings(settings: VLogSenderSettings): void {
        this._settings = settings;
    }

    process(logs: VLog[]): void {
        if (this._settings) {
            this._settings.process(logs);
        }
    }
}