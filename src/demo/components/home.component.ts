import {VComponent, VInit} from '../../core';
import {LoginService} from './login.service';

interface ContactInformation {
    email: string;
}

interface User {
    name: string;
    password: string;
    contact: ContactInformation;
}

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
                    <span>Hi there, {{ user.name }}!</span>
                    <app-dashboard></app-dashboard>
                    <div class="btn-menu">
                        <button data-v-click="logoff(user.name)">Log off</button>
                    </div>
                </div>
            </true>

            <false>
                <div class="public-area">
                    <span>Hi there, please log in first.</span>
                    <form>
                        <input data-v-bind="username" id="username" type="text" placeholder="Username" minlength="1"/>
                        <input data-v-bind="password" id="password" type="password" placeholder="Password" minlength="1"/>
                        <div class="btn-menu">
                            <button type="submit" data-v-click="login">Login</button>
                        </div>
                    </form>
                </div>
            </false>
        </v-check>
        
<!--        <v-loop for="{{ let i; i < var; i++ }}">-->
<!--            <span>{{ var[i] }}</span>-->
<!--        </v-loop>-->
		
		<app-footer>Footer from homepage</app-footer>
	`
})
export class HomeComponent implements VInit {
    navbarTitle = 'My fancy app :: Home';
    user: User = {
        name: 'user',
        password: 'password',
        contact: {
            email: 'young@padawan.com',
        },
    };
    username: HTMLInputElement;
    password: HTMLInputElement;
    isLoggedIn = false;

    constructor(protected loginService: LoginService) {
    }

    vInit(): void {
        console.log('Init lifecycle hook...');
    }

    login(): void {
        if (this.username.value === this.user.name && this.password.value == this.user.password) {
            this.loginService.login(this.user.name);
            this.isLoggedIn = true;
        } else {
            alert('Invalid credentials');
        }
    }

    logoff(name: string): void {
        this.loginService.logoff(name);
        this.isLoggedIn = false;
    }
}
