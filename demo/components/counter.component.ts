import {VComponent, VDestroy, VInit} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'counter-component',
    styles: [`
        .wrapper {
            display: flex;
            flex-direction: column;
            margin: 10px 0;
        }        
    `],
    html: `
        <app-navbar title="My fancy app :: Settings"></app-navbar>
        <div class="wrapper">
            <span>Demonstration of partial component rendering:</span>
            <span>{{count}}</span>
            <br />
            <input id="textInput" placeholder="Some text" type="text" @bind="textInput" />
            <button @click="showAlert()">Show alert</button>
        </div>
        <app-footer>Footer from component</app-footer>
    `
})
export class CounterComponent implements VInit, VDestroy {

    textInput: HTMLInputElement;
    count: number = 0;

    private countInterval: any;

    vInit(): void {
        this.countInterval = setInterval(() => this.count += 1, 2000);
    }

    vDestroy(): void {
        clearInterval(this.countInterval);
    }

    showAlert(): void {
        alert(`Actual value in text input: '${this.textInput.value}'`);
    }
}