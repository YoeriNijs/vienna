import {VRouteData} from "./v-route-data";
import {VRouteGuard} from "./v-route-guard";
import {Type} from "../injector/v-injector";

export interface VRoute {
    path: string;
    component: object;
    data?: VRouteData;
    guards?: Type<VRouteGuard>[];
    children?: VRoute[];
}
