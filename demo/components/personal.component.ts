import {VComponent} from '../../src';

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'app-personal',
    styles: [`
        .container {
            margin: 10px 0;
        }
    `],
    html: `
        <app-navbar title="My fancy app :: Personal"></app-navbar>
 
		<div class="container">
			<div class="msg">Welcome in my personal world</div>
            <button @click="navigateBack()"><< back</button>
		</div>
		
		<app-footer>Footer from personal</app-footer>
	`,
})
export class PersonalComponent {

    navigateBack(): void {
        window.history.back();
    }
}
