import {VComponent} from "../../src";

@VComponent({
    selector: 'test-component',
    styles: [],
    html: `
                <v-repeat let="{{todo}}" for="{{todoList}}">
            <div>{{todo}}</div>
        </v-repeat>
        <input value="{{currentTodo}}" @change="change('someValue')" /> 
        <button @click="addTodo">Add Todo</button>
    `
})
export class TestComponent {
    currentTodo = 'todo4';
    todoList = ['todo1', 'todo2', 'todo3'];

    change(e: any) {
        console.log(e);
    }
}