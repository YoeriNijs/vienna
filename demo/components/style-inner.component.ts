import {VComponent} from "../../src";

@VComponent({
    selector: 'style-inner-component',
    style: `div { background-color: red; color: white; padding: 10px; }`,
    html: `<div class="red">Red background, white text</div>`
})
export class StyleInnerComponent {}