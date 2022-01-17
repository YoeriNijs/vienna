import {VInjectable} from "../injector/v-injectable-decorator";
import {VRoute} from "./v-route";

@VInjectable({singleton: true})
export class VInternalRoutes {
    get routes(): VRoute[] {
        return this._routes;
    }

    set routes(value: VRoute[]) {
        this._routes = value;
    }
    
    private _routes: VRoute[] = [];
}
