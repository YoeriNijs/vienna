import {VComponent} from '../../src';
import {VEmitter} from "../../src/core/binding/v-emitter";
import {VEmit} from "../../src/core/binding/v-emit";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
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
        <button @click="changeTitle('New title from dashboard')">Change title</button>
        <button @click="changeTitle('Another new title from dashboard')">Change title</button>
	`
})
export class DashboardComponent {
    @VEmit('titleChange')
    titleChange: VEmitter<string> = new VEmitter<string>();

    menuItems = [
        {name: 'personal', link: '#/personal'},
        {name: 'settings', link: '#/settings?message=Settings with param from navigation'},
        {name: 'counter', link: '#/counter'},
        {name: 'does not exist', link: '#/does-not-exist'}
    ];

    changeTitle(title: string): void {
        this.titleChange.emit(title);
    }
}
