import {VComponent, VInit} from "../../src";
import {VDarkMode} from "../../src/core/style/v-dark-mode";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'dark-mode-component',
    html: `
        <div class='background'>
            <h2>Some title</h2>
            
            <v-check if="{{ isDarkModeEnabled }}">
                <true>
                    <button @click="disableDarkMode()">Disable dark mode</button>
                </true>
                <false>
                    <button @click="enableDarkMode()">Enable dark mode</button>
                </false>
            </v-check>
        </div>`,
    styles: [`
        .v-dark {
            background-color: #000;
            color: #fff;
        }
    `]
})
export class DarkModeComponent implements VInit {

    isDarkModeEnabled = false;

    constructor(private darkMode: VDarkMode) {}

    vInit(): void {
        this.isDarkModeEnabled = this.darkMode.isDarkModeEnabled();
    }

    enableDarkMode(): void {
        this.darkMode.enableDarkMode();
    }

    disableDarkMode(): void {
        this.darkMode.disableDarkMode();
    }
}