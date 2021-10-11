import {Prop, VComponent} from '../../core';

@VComponent({
    selector: 'app-navbar',
    styles: [`
		.header {
            background-color: blue;
            color: #fff;
			display: flex;
			justify-content: space-between;
			border: 1px solid black;
			border-radius: 8px;
			padding: 10px;
		}
	`],
    html: `
		<section class="header">
			<div class="title">{{ title }}</div>
		</section>
	`,
})
export class NavbarComponent {
    @Prop() title: string = 'My navbar title';
}
