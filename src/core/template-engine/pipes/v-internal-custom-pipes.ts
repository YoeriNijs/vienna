import {VInjectable} from "../../injector/v-injectable-decorator";
import {VPipe} from "../../application/v-pipe";
import {VInternalTemplatePipe} from "./v-internal-template-pipe";

@VInjectable({singleton: true})
export class VInternalCustomPipes {
    private _pipes: VPipe[] = [];

    register(pipes: VPipe[]) {
        this._pipes.push(...pipes);
    }

    toTemplatePipes(): VInternalTemplatePipe[] {
        return this._pipes.map(p => {
            return {
                transform(value: string): string {
                    return p.transform(value);
                },
                name(): string {
                    return p.name();
                },
                accept(segment: string, pipeName: string, _: string): boolean {
                    return segment === pipeName;
                }
            }
        })
    }
}