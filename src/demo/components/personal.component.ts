import {VComponent, VInit} from '../../core';
import {LoginService} from "./login.service";

@VComponent({
    selector: 'app-personal',
    styles: [],
    html: `
        <app-navbar title="My fancy app :: Personal"></app-navbar>
 
		<div class="container">
			<div class="msg">Welcome in my personal world</div>
            <button data-v-click="navigateBack()"><< back</button>
		</div>
		
		<app-footer></app-footer>
	`,
})
export class PersonalComponent implements VInit {

    constructor(private loginService: LoginService) {
    }

    vInit(): void {
        console.log('Is logged in according to service?', this.loginService.isLoggedIn);
    }

    navigateBack(): void {
        window.history.back();
    }
}
