import {VComponent, VInit, VLogger} from '../../src';
import {LoginService} from "../services/login.service";
import {UserService} from "../services/user.service";
import {User} from "../model/user";
import {VAudit} from "../../src/core/audit/v-audit";

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
                    <app-dashboard @emit="titleChange => changeNavbarTitle(title)"></app-dashboard>
                    <div class="btn-menu">
                        <button @click="logoff()">Log off</button>
                    </div>
                </div>
            </true>

            <false>
                <div class="public-area">
                    <span>Hi there, please log in first.</span>
                    <form>
                        <input @bind="usernameLogin" id="usernameLogin" type="text" placeholder="Username" minlength="1"/>
                        <input @bind="passwordLogin" id="passwordLogin" type="password" placeholder="Password" minlength="1"/>
                        <div class="btn-menu">
                            <button type="submit" @click="login">Login</button>
                        </div>
                    </form>
                    
                    <hr />
                    
                    <span>Register</span>
                    <form>
                        <input @bind="usernameRegister" id="usernameRegister" type="text" placeholder="Username" minlength="1"/>
                        <input @bind="passwordRegister" id="passwordRegister" type="password" placeholder="Password" minlength="1"/>
                        <input @bind="emailRegister" id="emailRegister" type="email" placeholder="E-mail" minlength="1"/>
                        <div class="btn-menu">
                            <button type="submit" @click="register">Register</button>
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

    constructor(protected loginService: LoginService,
                protected userService: UserService,
                private _logger: VLogger,
                private _audit: VAudit) {
    }

    vInit(): void {
        this.updateLoginStatus();
        if (!this.isLoggedIn) {
            this.usernameLogin.focus();
        }

        this._logger.debug('HomeComponent initialized', 'Another log');
    }

    login(): void {
        if (this.userService.isRegistered(this.usernameLogin.value, this.passwordLogin.value)) {
            this.loginService.login(this.usernameLogin.value);
            this.updateLoginStatus();
        } else {
            alert('Invalid credentials!');
        }
    }

    logoff(): void {
        this.loginService.logoff();
        this.updateLoginStatus();
    }

    register(): void {
        const name = this.usernameRegister.value;
        if (this._audit.isBlank(name)) {
            alert('Fill in a valid name!');
            return;
        }
        const password = this.passwordRegister.value;
        if (this._audit.isBlank(password)) {
            alert('Fill in a valid password!');
            return;
        }
        const email = this.emailRegister.value;
        if (this._audit.isValidEmail(email)) {
            alert('Fill in a valid email!');
            return;
        }

        const user: User = {name, password, contact: {email}};
        this.userService.register(user);
        alert('User created!');
    }

    changeNavbarTitle(newTitle: string) {
        this.navbarTitle = newTitle;
    }

    private updateLoginStatus(): void {
        this.isLoggedIn = this.loginService.isLoggedIn;
        this.userName = this.loginService.username;
    }
}
