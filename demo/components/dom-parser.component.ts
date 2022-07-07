import {VComponent} from "../../src";

interface Person {
    name: string;
    age: number;
    active: boolean;
}

@VComponent({
    selector: 'dom-parser',
    styles: [`
        li {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
        }
        
        li div:hover {
            background-color: red;
            color: white;
        }
    `],
    html: `
        <ul>
            <v-repeat let="{{ person }}" for="{{ persons }}">
                <li>
                    <div @click="click({{ person.name }}, {{ person.age }})" class="name">{{ person.name }}</div>
                    <div @click="click({{ person.age }})" class="age">{{ person.age }}</div>
                    <div @click="click({{ person.active }})" class="active">{{ person.active }}</div>
                </li>
            </v-repeat>
        </ul>
    `
})
export class DomParserComponent {
    persons: Person[] = [
        { name: 'Ernie', age: 30, active: true },
        { name: 'Bert', age: 33, active: false }
    ];

    click(value: any): void {
        console.log(value);
    }
}