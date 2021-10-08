import {VInternalComponent} from "./v-internal-component";

export class VLogger {
	public static debug(obj: any, ...msg: any[]) {
		msg.map(v => this.createLog(obj, v))
			.forEach(v => console.log(v));
	}

	public static info(obj: any, ...msg: any[]) {
		msg.map(v => this.createLog(obj, v))
			.forEach(v => console.info(v));
	}

	public static warning(obj: any, ...msg: any[]) {
		msg.map(v => this.createLog(obj, v))
			.forEach(v => console.warn(v));
	}

	public static error(obj: any, ...msg: any[]) {
		msg.map(v => this.createLog(obj, v))
			.forEach(v => console.error(v));
	}

	private static createLog(obj: any, ...msg: any[]) {
		return msg.map(m => obj.vInternalName
			? `${obj.vInternalName}: ${m}`
			: m
		);
	}

	private constructor() {
		// Do not instantiate
	}
}
