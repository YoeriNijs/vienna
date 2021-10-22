import {VRoute} from "./v-route";

export interface VRouteGuard {
    guard: (vRoute?: VRoute) => boolean | Promise<boolean>;
}
