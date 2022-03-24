import {VLog} from "./v-log";
import {VInternalLogType} from "./v-internal-log-type";
import {VInjectable} from "../injector/v-injectable-decorator";
import {VInternalLogSender} from "./v-internal-log-sender";

@VInjectable({ singleton: true })
export class VLogger {

    constructor(private _sender: VInternalLogSender) {}

    debug(...msg: string[]): void {
        this.process('debug', msg);
    }

    info(...msg: string[]): void {
        this.process('info', msg);
    }

    warning(...msg: string[]): void {
        this.process('warning', msg);
    }

    error(...msg: string[]): void {
        this.process('error', msg);
    }

    private process(type: VInternalLogType, msg: string[]) {
        const messages: VLog[] = msg.map(m => ({type, msg: m}));
        this._sender.process(messages);
    }
}