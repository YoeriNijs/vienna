import {VComponent, VInit} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'counter-in-check-component',
    styles: [`span { display: flex; margin: 10px 0; }`],
    html: `
        <v-check if="{{ check }}">
            <true><span>{{ text }}</span></true>
        </v-check>
        
        <v-check if="{{ check }}">
            <true><span>{{ count }}</span></true>
        </v-check>
        
        <button @click="changeText()">Change text</button>
    `
})
export class CounterInCheckComponent implements VInit {
    check = true;
    count = 0;
    text = "";

    constructor() {
        this.text = "Initial text";
    }

    vInit(): void {
        setInterval(() => {
            ++this.count;
        }, 1000);
    }

    changeText(): void {
        this.text = "Updated text with button";
    }
}