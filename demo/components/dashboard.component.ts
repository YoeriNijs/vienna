import {VComponent} from '../../src';

@VComponent({
    selector: 'app-dashboard',
    styles: [`
        :host { 
            display: flex; 
            flex-direction: column;
        }
        
        div.menu { 
            font-weight: bold;
            margin-top: 4px;
        } 
    `],
    html: `
        <div class="menu">Menu</div>
        <ul>
            <v-repeat let="{{ item }}" for="{{ menuItems }}">
                <li>
                    <a href="{{ item.link }}">{{ item.name }}</a>
                </li>
            </v-repeat>
        </ul>
	`,
})
export class DashboardComponent {
    menuItems = [
        {name: 'personal', link: '#/personal'},
        {name: 'settings', link: '#/settings?message=Settings with param from navigation'}
    ];
}
