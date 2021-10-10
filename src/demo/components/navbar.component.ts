import {VComponent} from '../../core';

@VComponent({
    selector: 'app-navbar',
    styles: [`
		.header {
			display: flex;
			justify-content: space-between;
			border: 1px solid black;
			border-radius: 8px;
			padding: 10px;
		}
	`],
    html: `
		<section class="header">
			<div class="title">My App</div>
		</section>
	`,
})
export class NavbarComponent {
}
