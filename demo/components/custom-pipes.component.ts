import {VComponent} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'custom-pipes',
    styles: [],
    html: `
        <p>Should be: 'Hallo, wereld!' and is: '{{ myGreeting | greeting | translate }}'</p>
        <p>Should be: 'Hello, world!' and is: '{{ myGreeting | translate | greeting }}'</p>
    `
})
export class CustomPipesComponent {
    myGreeting = 'Hello';
}