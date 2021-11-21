import {VComponent, VInit} from "../../src";

@VComponent({
    selector: 'test-component',
    styles: [`
        .wrapper {
            display: flex;
            flex-direction: column;
        }        
    `],
    html: `
        <div class="wrapper">
            <span>Only re-render specific code blocks:</span>
            <span>{{count}}</span>
            <input id="textInput" type="text" @bind="textInput" />
            <button @click="showAlert()">Show alert</button>
        </div>
    `
})
export class CounterComponent implements VInit {
    textInput: HTMLInputElement;
    count: number = 0;

    vInit(): void {
        setInterval(() => this.count += 1);
    }

    showAlert(): void {
        alert(`Actual value in text input: '${this.textInput.value}'`);
    }
}