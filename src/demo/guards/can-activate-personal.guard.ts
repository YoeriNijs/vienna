import {VInjectable, VRoute, VRouteGuard} from "../../core";
import {RouteData} from "../model/route-data";
import {LoginService} from "../services/login.service";

@VInjectable({singleton: true})
export class CanActivatePersonalGuard implements VRouteGuard {

    constructor(protected loginService: LoginService) {
    }

    guard(route: VRoute): boolean {
        const userRole = this.loginService.role;
        const authorizedForRole = (route.data as RouteData).authorizedForRole;
        return userRole && authorizedForRole && userRole === authorizedForRole
    }
}
