import {VComponent, VProp} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'input-host-component',
    styles: [],
    html: `
        <v-repeat let="{{ i }}" for="{{ items }}">
            <span>{{ i }}</span>
            <br />
        </v-repeat>
    `
})
export class InputHostComponent {
    @VProp() items: any[] = []
}