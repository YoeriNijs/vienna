import {VInjectable} from "../injector/v-injectable-decorator";
import {VInvalidRouteException} from "./v-invalid-route-exception";

type Target = '_blank' | '_self';

@VInjectable({singleton: true})
export class VRouteRedirect {

    public redirectTo(path: string, newWindow = false): void {
        const target = newWindow ? '_blank' : '_self';
        if (path && path.startsWith('#')) {
            this.navigateToInternalRoute(path, target);
        } else {
            window.open(path, target);
        }
    }

    public redirectToRoot(): void {
        this.navigateToInternalRoute('#', '_self');
    }

    private navigateToInternalRoute(path: string, target: Target): void {
        const rootIndex = window.location.href.indexOf('#');
        if (rootIndex === -1) {
            throw new VInvalidRouteException('No Vienna route');
        } else {
            window.open(path, target);
        }
    }
}