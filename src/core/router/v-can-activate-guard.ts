import {Observable} from "rxjs";
import {VRoute} from "./v-route";

export interface VCanActivateGuard {
    canActivate: (vRoute?: VRoute) => boolean | Observable<boolean>;
}
