import {VInjectable} from "../../injector/v-injectable-decorator";
import {VPipe} from "../../application/v-pipe";
import {VInternalTemplatePipe} from "./v-internal-template-pipe";

@VInjectable({ singleton: true })
export class VCustomPipes {
    private _pipes: VPipe[] = [];

    register(pipes: VPipe[]) {
        this._pipes.push(...pipes);
    }

    toTemplatePipes(): VInternalTemplatePipe[] {
        return this._pipes.map(p => {
            return Object.assign({
                accept(_a: (templateRef: string) => boolean, _b: string) {
                    return true; // Custom pipes are always acceptable
                }
            }, p);
        })
    }
}