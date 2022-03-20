import {VActivatedRoute, VComponent, VInit} from "../../src";

@VComponent({
    selector: 'app-about-more',
    styles: [],
    html: `
        <v-check if="{{ routeParamSet }}">
            <true><span>Route param is set and value is {{ routeParam }}</span></true>
            <false><span>Route param is not set yet (should change after 5 seconds)</span></false>
        </v-check>
    `
})
export class AboutMoreComponent implements VInit {

    routeParam = '';
    routeParamSet = false;

    constructor(private activatedRoute: VActivatedRoute) {}

    vInit(): void {
        this.activatedRoute.params(p => {
            setTimeout(() => {
                this.routeParam = p.find(v => v.id === 'name').value;
                this.routeParamSet = true;
            }, 5000)
        });
    }


}
