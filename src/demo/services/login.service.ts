import { VInjectable } from '../../core';
import {Role} from "../model/role";

@VInjectable({ singleton: true})
export class LoginService {
	private _isLoggedIn = false;
	private _role: Role;
	private _username: string;

	get isLoggedIn() {
		return this._isLoggedIn;
	}

	get role(): Role {
		return this._role;
	}

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
		this._username = '';
		this._role = 'visitor';
		this._isLoggedIn = false;
		alert(`${this._username} is logged off!`);
	}
}
