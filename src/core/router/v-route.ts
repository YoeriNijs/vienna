import {VRouteData} from "./v-route-data";
import {VRouteGuard} from "./v-route-guard";
import {Type} from "../injector/v-injector";
import {VWebDocTags} from "../misc/web";

export type VRouteDocTags = VWebDocTags;

export interface VRoute {
    path: string;
    component: object;
    docTags?: VRouteDocTags;
    data?: VRouteData;
    guards?: Type<VRouteGuard>[];
    children?: VRoute[];
}
