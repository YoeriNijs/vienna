import {VActivatedRoute, VAfterInit, VComponent, VInit, VWeb} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
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
export class AboutMoreComponent implements VInit, VAfterInit {

    routeParam = '';
    routeParamSet = false;

    constructor(private _activatedRoute: VActivatedRoute,
                private _web: VWeb) {}

    vInit(): void {
        this._web.overrideTags({
            title: 'My custom title initialized from the component itself'
        })
        this._activatedRoute.params(p => {
            setTimeout(() => {
                this.routeParam = p.find(v => v.id === 'name').value;
                this.routeParamSet = true;
            }, 5000)
        });
    }

    vAfterInit(): void {
        this._web.overrideTags({
            title: 'About more page title'
        });
    }


}
