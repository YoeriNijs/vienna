import {VComponent} from '../../src';
import {VEmitter} from "../../src/core/binding/v-emitter";
import {VEmit} from "../../src/core/binding/v-emit";

@VComponent({
    selector: 'app-dashboard',
    styles: [`
        ul { 
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
        <br />
        <button @click="changeTitle()">Change title</button>
	`
})
export class DashboardComponent {
    @VEmit('titleChange')
    titleChange: VEmitter<string> = new VEmitter<string>();

    menuItems = [
        {name: 'personal', link: '#/personal'},
        {name: 'settings', link: '#/settings?message=Settings with param from navigation'},
        {name: 'counter', link: '#/counter'}
    ];

    changeTitle(): void {
        this.titleChange.emit('New title from dashboard');
    }
}
