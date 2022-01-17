import {VActivatedRoute, VComponent, VInit, VRouteData, VRouteParam} from "../../src";
import {RouteData} from "../model/route-data";
import {RouteParams} from "../model/route-params";

@VComponent({
    selector: 'app-settings',
    styles: [' .settings { margin: 10px 0; padding: 10px; } '],
    html: `
        <app-navbar title="My fancy app :: Settings"></app-navbar>
        <div class="settings">{{ message }} <a href="#/">back</a></div>
        <app-footer>{{ footerText }}</app-footer>
    `
})
export class SettingsComponent implements VInit {
    message: string;
    footerText: string;

    constructor(private activatedRoute: VActivatedRoute) {
    }

    vInit(): void {
        this.activatedRoute.queryParams((params: RouteParams) => this.message = params.message);
        this.activatedRoute.data((data: RouteData) => this.footerText = data.footerText);
    }
}
