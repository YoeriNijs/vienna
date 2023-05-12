import {VComponent} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'switch-component',
    styles: [],
    html: `
        <div>Not switch related</div>
        <v-switch condition="{{ value }}">
            <v-case if="First">
                First
            </v-case>
            <v-case if="Second">
                Second
            </v-case>
            <v-case-default>
                Invalid value
            </v-case-default>
        </v-switch>
    `
})
export class SwitchComponent {
    value = 'Second';
}