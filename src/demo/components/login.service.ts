import { VInjectable } from "../../core";

@VInjectable()
export class LoginService {

	private _isLoggedIn = false;

	get isLoggedIn() {
		return this._isLoggedIn;
	}

	login(username: string): void {
		this._isLoggedIn = true;
		alert(`${username} is logged in!`);
	}

	logoff(username: string): void {
		this._isLoggedIn = false;
		alert(`${username} is logged off!`);
	}
}
