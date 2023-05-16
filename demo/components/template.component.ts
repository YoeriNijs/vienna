import {VComponent} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'repeat-check-component',
    styles: [],
    html: `
        <v-repeat let="{{ i }}" for="{{ items }}">>
            <v-check if="isTwo({{ i }})">
                <true><span>True: {{ i }}</span></true>
                <false><span>False: {{ stringOutsideRepeat }}</span></false>
            </v-check>
            <br />
        </v-repeat>
    `
})
export class TemplateComponent {
    items = [1, 2, 3];
    condition = true;
    stringOutsideRepeat = 'other';

    isTwo(value: string): boolean {
        return value === '2';
    }
}