import {VInjectable} from "../../src";
import {User} from "../model/user";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VInjectable()
export class UserService {
    private _users: User[] = [{
        name: 'user',
        password: 'password',
        contact: {
            email: 'young@padawan.com'
        }
    }];

    register(user: User): void {
        this._users.push(user);
        console.log('users in store', this._users);
    }

    isRegistered(name: string, password: string): boolean {
        return this._users.some(u => u.name === name && u.password === password);
    }
}
