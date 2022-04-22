import {VComponent} from '../../src';

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'app-footer',
    styles: [`
        :host {
            margin: 0;
            padding: 0;
        }
        
		.item {
			border: 1px solid black;
			padding: 10px;
		}
	`],
    html: `
        <div class="item">
            <slot></slot>
        </div>`,
})
export class FooterComponent {
}
