import {VInjectable} from '../../core';
import {Role} from "../model/role";

@VInjectable({singleton: true})
export class LoginService {
    private _isLoggedIn = false;

    get isLoggedIn() {
        return this._isLoggedIn;
    }

    private _role: Role;

    get role(): Role {
        return this._role;
    }

    private _username: string;

    get username(): string {
        return this._username;
    }

    login(username: string): void {
        this._username = username;
        this._role = 'user';
        this._isLoggedIn = true;
        alert(`${username} is logged in!`);
    }

    logoff(): void {
        alert(`${this.username} is logged off!`);
        this._username = '';
        this._role = 'visitor';
        this._isLoggedIn = false;
    }
}
