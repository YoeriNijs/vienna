import {VComponent, VDestroy, VInit} from "../../src";

@VComponent({
    selector: 'counter-component',
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
export class CounterComponent implements VInit, VDestroy {
    textInput: HTMLInputElement;
    count: number = 0;

    private interval: any;

    vInit(): void {
        this.interval = setInterval(() => this.count += 1, 2000);
    }

    vDestroy(): void {
        clearInterval(this.interval);
    }

    showAlert(): void {
        alert(`Actual value in text input: '${this.textInput.value}'`);
    }
}