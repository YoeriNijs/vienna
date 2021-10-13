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
            margin: 10px 0;
        }
        
        section {
            padding: 10px;
            border: 1px solid black;
            margin: 10px 0;
        }
        
        form {
            border: 1px solid black;
            padding: 10px;
        }
        
        .btn-menu {
            margin-top: 4px;
        }
    `],
    html: `
        <app-navbar title="{{ navbarTitle }}"></app-navbar>
        
<!--        <v-check if="{{ a ===  b }}">-->
<!--            <true>-->
<!--                 &lt;!&ndash; true &ndash;&gt;   -->
<!--            </true>-->
<!--            <false>-->
<!--                &lt;!&ndash; false &ndash;&gt;-->
<!--            </false>-->
<!--        </v-check>-->
        
<!--        <v-loop for="{{ let i; i < var; i++ }}">-->
<!--            <span>{{ var[i] }}</span>-->
<!--        </v-loop>-->
        
		<section data-v-if="isLoggedIn()">
			<div class="member-area">
				<span>Hi there, {{ user.name }}!</span>
				
				<app-dashboard></app-dashboard>
				
				<div class="btn-menu">
                    <button data-v-click="logoff(user.name)">Log off</button>
				</div>
			</div>
		</section>
		
		<section data-v-if-not="isLoggedIn()">
		    <div class="public-area">
		        <span>Hi there, please log in first.</span>
		        <form>
                    <input data-v-bind="username" id="username" type="text" placeholder="Username" minlength="1"/>
                    <input data-v-bind="password" id="password" type="password" placeholder="Password" minlength="1"/>
                    <div class="btn-menu">
                        <button data-v-click="login">Login</button>
                    </div>
                </form>
            </div>
        </section>
		
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

    constructor(protected loginService: LoginService) {
    }

    vInit(): void {
        console.log('In init lifecycle hook');
    }

    login(): void {
        if (this.username.value === this.user.name && this.password.value == this.user.password) {
            this.loginService.login(this.user.name);
        } else {
            alert('Invalid credentials');
        }
    }

    logoff(name: string): void {
        this.loginService.logoff(name);
    }

    isLoggedIn(): boolean {
        return this.loginService.isLoggedIn;
    }
}
