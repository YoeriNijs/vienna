import {VCanActivateGuard, VInjectable, VRoute} from "../../core";
import {RouteData} from "../model/route-data";
import {LoginService} from "../services/login.service";

@VInjectable({ singleton: true })
export class CanActivatePersonalGuard implements VCanActivateGuard {

    constructor(protected loginService: LoginService) {}

    canActivate(route: VRoute): boolean {
        const userRole = this.loginService.role;
        const authorizedForRole = (route.data as RouteData).authorizedForRole;
        return userRole && authorizedForRole && userRole === authorizedForRole
    }
}
