import {VActivatedRoute, VComponent} from "../../src";
import {RouteData} from "../model/route-data";

@VComponent({
    selector: 'app-settings',
    styles: [' .settings { margin: 10px 0; padding: 10px; } '],
    html: `
        <app-navbar title="My fancy app :: Settings"></app-navbar>
        <div class="settings">{{ message }} <a href="#/">back</a></div>
        <app-footer>{{ footerText }}</app-footer>
    `
})
export class SettingsComponent {
    message: string;
    footerText: string;

    constructor(private activatedRoute: VActivatedRoute) {
        this.activatedRoute.data((data: RouteData) => this.footerText = data.footerText);
        this.activatedRoute.params((params => this.message = params.message));
    }
}
