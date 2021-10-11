import {VComponent} from '../../core';

@VComponent({
    selector: 'app-footer',
    styles: [`
		.wrapper {
			border: 1px solid black;
			padding: 10px;
		}
	`],
    html: `
		<div class="wrapper">
		    <div class="item">
		        <slot></slot>
            </div>
		<div>
	`,
})
export class FooterComponent {
}
