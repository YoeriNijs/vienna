import {VComponent, VProp} from '../../core';

@VComponent({
    selector: 'app-navbar',
    styles: [`
		:host {
            background-color: blue;
            color: #fff;
			display: flex;
			justify-content: space-between;
			border: 1px solid black;
			border-radius: 8px;
			padding: 10px;
		}
	`],
    html: `<div class="title">{{ title }}</div>`
})
export class NavbarComponent {
    @VProp() title: string = 'My navbar title';
}
