import {VComponent} from "../../src";

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