import {VInjectable, VRoute, VRouteGuard} from "../../src";
import {RouteData} from "../model/route-data";
import {LoginService} from "../services/login.service";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
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
