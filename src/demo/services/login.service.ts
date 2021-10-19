import { VInjectable } from '../../core';
import {Role} from "../model/role";

@VInjectable({ singleton: true})
export class LoginService {
	private _isLoggedIn = false;
	private _role: Role;

	get isLoggedIn() {
		return this._isLoggedIn;
	}

	get role(): Role {
		return this._role;
	}

	login(username: string): void {
		this._role = 'user';
		this._isLoggedIn = true;
		alert(`${username} is logged in!`);
	}

	logoff(username: string): void {
		this._role = 'visitor';
		this._isLoggedIn = false;
		alert(`${username} is logged off!`);
	}
}
