import {VRouteData} from "./v-route-data";
import {VCanActivateGuard} from "./v-can-activate-guard";
import {Type} from "../injector/v-injector";

export interface VRoute {
    path: string;
    component: object;
    data?: VRouteData;
    canActivate?: Type<VCanActivateGuard>[]
}
