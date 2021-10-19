import {VActivatedRoute, VComponent, VInit} from "../../core";
import {RouteData} from "../model/route-data";

@VComponent({
    selector: 'app-settings',
    styles: [' .settings { margin: 10px 0; padding: 10px; } '],
    html: `
        <app-navbar title="My fancy app :: Settings"></app-navbar>
        <div class="settings">Settings... <a href="#/">back</a></div>
        <app-footer>{{ footerText }}</app-footer>
    `
})
export class SettingsComponent {
    footerText: string;

    constructor(private activatedRoute: VActivatedRoute) {
        this.activatedRoute.data((data: RouteData) => this.footerText = data.footerText);
    }
}
