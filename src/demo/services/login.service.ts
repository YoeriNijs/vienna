import { VInjectable } from '../../core';
import {SESSION_STORAGE_ROLE_KEY} from "../model/session-storage-keys";

@VInjectable()
export class LoginService {
	private _isLoggedIn = false;

	get isLoggedIn() {
		return this._isLoggedIn;
	}

	login(username: string): void {
		sessionStorage.setItem(SESSION_STORAGE_ROLE_KEY, 'user');
		this._isLoggedIn = true;
		alert(`${username} is logged in!`);
	}

	logoff(username: string): void {
		sessionStorage.removeItem(SESSION_STORAGE_ROLE_KEY);
		this._isLoggedIn = false;
		alert(`${username} is logged off!`);
	}
}
