import {VRoute} from "./v-route";

export interface VCanActivateGuard {
    canActivate: (vRoute?: VRoute) => boolean | Promise<boolean>;
}
