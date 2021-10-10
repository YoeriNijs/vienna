import {VComponent} from '../../core';

@VComponent({
    selector: 'app-dashboard',
    styles: [],
    html: `
        <ul>
            <li data-v-for="calculateMenuItems()">
                <a href="#/personal">menu item</a>
            </li>
        </ul>
	`,
})
export class DashboardComponent {
    calculateMenuItems() {
        return 2;
    }
}
