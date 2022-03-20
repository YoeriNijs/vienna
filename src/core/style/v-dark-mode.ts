import {VInjectable} from "../injector/v-injectable-decorator";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";

const V_INTERNAL_DARK_MODE_CLASS = 'v-dark';

@VInjectable({ singleton: true })
export class VDarkMode {

    private _isDarkModeEnabled = false;
    private _darkModeClass = V_INTERNAL_DARK_MODE_CLASS;

    constructor(private _eventBus: VInternalEventbus) {}

    isDarkModeEnabled(): boolean {
        return this._isDarkModeEnabled;
    }

    enableDarkMode(): void {
        this._isDarkModeEnabled = true;
        this.pushChange();
    }

    disableDarkMode(): void {
        this._isDarkModeEnabled = false;
        this.pushChange();
    }

    overrideGlobalDarkModeClass(cssClass: string): void {
        this._darkModeClass = cssClass;
    }

    getDarkModeCssClass(): string {
        return this._darkModeClass;
    }

    private pushChange(): void {
        this._eventBus.publish(VInternalEventName.REBUILD);
    }
}