import {VComponent} from '../../core';

@VComponent({
    selector: 'app-footer',
    styles: [`
		.wrapper {
			border: 1px solid black;
			border-radius: 8px;
			padding: 10px;
		}
	`],
    html: `
		<div class="wrapper">
		    <div class="item">Footer</div>
		<div>
	`,
})
export class FooterComponent {
}
