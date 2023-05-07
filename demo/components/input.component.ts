import {VComponent} from "../../src";

@VComponent({
    selector: 'input-component',
    styles: [],
    html: `
        <input-host-component items="{{ customItems }}"></input-host-component>
    `
})
export class InputComponent {
    customItems = [
        { a: "property A of object 1"},
        { b: "property B of object 2"},
    ];
}