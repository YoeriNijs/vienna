import {VComponent, VInit} from '../../src';
import {LoginService} from "../services/login.service";
import {UserService} from "../services/user.service";
import {User} from "../model/user";

@VComponent({
    selector: 'app-home',
    styles: [`
        .member-area,
        .public-area {
            display: flex;
            flex-direction: column;
            padding: 10px;
            border: 1px solid black;
            margin: 10px 0;
        }
        
        .btn-menu {
            margin-top: 4px;
        }
    `],
    html: `
        <app-navbar title="{{ navbarTitle }}"></app-navbar>
        
        <v-check if="{{ isLoggedIn }}">
            <true>
                <div class="member-area">
                    <span>Hi there, {{ userName }}!</span>
                    <app-dashboard></app-dashboard>
                    <div class="btn-menu">
                        <button data-v-click="logoff()">Log off</button>
                    </div>
                </div>
            </true>

            <false>
                <div class="public-area">
                    <span>Hi there, please log in first.</span>
                    <form>
                        <input data-v-bind="usernameLogin" id="usernameLogin" type="text" placeholder="Username" minlength="1"/>
                        <input data-v-bind="passwordLogin" id="passwordLogin" type="password" placeholder="Password" minlength="1"/>
                        <div class="btn-menu">
                            <button type="submit" data-v-click="login">Login</button>
                        </div>
                    </form>
                    
                    <hr />
                    
                    <span>Register</span>
                    <form>
                        <input data-v-bind="usernameRegister" id="usernameRegister" type="text" placeholder="Username" minlength="1"/>
                        <input data-v-bind="passwordRegister" id="passwordRegister" type="password" placeholder="Password" minlength="1"/>
                        <input data-v-bind="emailRegister" id="emailRegister" type="email" placeholder="E-mail" minlength="1"/>
                        <div class="btn-menu">
                            <button type="submit" data-v-click="register">Register</button>
                        </div>
                    </form>
                </div>
            </false>
        </v-check>
		
		<app-footer>Footer from homepage</app-footer>
	`
})
export class HomeComponent implements VInit {
    navbarTitle = 'My fancy app :: Home';
    isLoggedIn = false;

    userName: string;

    usernameLogin: HTMLInputElement;
    passwordLogin: HTMLInputElement;
    usernameRegister: HTMLInputElement;
    passwordRegister: HTMLInputElement;
    emailRegister: HTMLInputElement;

    constructor(protected loginService: LoginService, protected userService: UserService) {
    }

    vInit(): void {
        this.usernameLogin.focus();
    }

    login(): void {
        if (this.userService.isRegistered(this.usernameLogin.value, this.passwordLogin.value)) {
            this.loginService.login(this.usernameLogin.value);
            this.userName = this.loginService.username;
            this.isLoggedIn = true;
        } else {
            alert('Invalid credentials!');
        }
    }

    register(): void {
        const name = this.usernameRegister.value;
        if (!name || name.trim().length < 1) {
            alert('Fill in a valid name!');
            return;
        }
        const password = this.passwordRegister.value;
        if (!password || password.trim().length < 1) {
            alert('Fill in a valid password!');
            return;
        }
        const email = this.emailRegister.value;
        if (!email || email.trim().length < 1) {
            alert('Fill in a valid email!');
            return;
        }

        const user: User = {name, password, contact: {email}};
        this.userService.register(user);
        alert('User created!');
    }

    logoff(): void {
        this.loginService.logoff();
        this.isLoggedIn = false;
    }
}
