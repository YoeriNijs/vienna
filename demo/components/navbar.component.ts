import {VComponent, VInit, VProp} from '../../src';
import {LoginService} from "../services/login.service";

@VComponent({
    selector: 'app-navbar',
    styles: [`
		:host {
            background-color: blue;
            color: #fff;
			display: flex;
			justify-content: space-between;
			border: 1px solid black;
			border-radius: 8px;
			padding: 10px;
		}
	`],
    html: `
        <div class="title">{{ title }}</div>
    `
})
export class NavbarComponent implements VInit {
    @VProp() title: string = 'My navbar title';
    isLoggedIn: boolean;

    constructor(private loginService: LoginService) {
    }

    vInit(): void {
        this.isLoggedIn = this.loginService.isLoggedIn;
    }
}
