import {VComponent} from '../../core';

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
