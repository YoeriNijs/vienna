import {VComponent} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'style-inner-component',
    style: `div { background-color: red; color: white; padding: 10px; }`,
    html: `<div class="red">Red background, white text</div>`
})
export class StyleInnerComponent {}
