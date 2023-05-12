import {VComponent} from "../../src";

@VComponent({
    selector: 'input-component',
    styles: [
        `
            .container {
                display: flex;
                flex-direction: column;
            }
            
            input-host-component {
                margin-bottom: 16px;
            }
        `
    ],
    html: `
        <div class="container">
            <strong>With object</strong>
            <input-host-component items="{{ objectItems }}"></input-host-component>
            <strong>With list</strong>
            <input-host-component items="{{ listItems }}"></input-host-component>
        </div>
        
    `
})
export class InputComponent {
    objectItems = [
        { a: "property A of object 1"},
        { b: "property B of object 2"},
        { c: '<a href="https://www.google.com" target="_blank">Go to link</a>' }
    ];

    listItems = ['first', 'second', 'third'];
}