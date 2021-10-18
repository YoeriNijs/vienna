import {VComponent} from '../../core';

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
            <button data-v-click="navigateBack()"><< back</button>
		</div>
		
		<app-footer>Footer from personal</app-footer>
	`,
})
export class PersonalComponent {

    navigateBack(): void {
        window.history.back();
    }
}
