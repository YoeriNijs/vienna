import {VCanActivateGuard, VInjectable, VRoute} from "../../core";
import {SESSION_STORAGE_ROLE_KEY} from "../model/session-storage-keys";
import {RouteData} from "../model/route-data";

@VInjectable()
export class CanActivatePersonalGuard implements VCanActivateGuard {

    canActivate(route: VRoute): boolean {
        const userRole = sessionStorage.getItem(SESSION_STORAGE_ROLE_KEY);
        const authorizedForRole = (route.data as RouteData).authorizedForRole;
        return userRole && authorizedForRole && userRole === authorizedForRole
    }
}
