import {VInjectable} from "../../injector/v-injectable-decorator";
import {VPipeTransform} from "../../pipe/v-pipe-transform";
import {VInternalTemplatePipe} from "./v-internal-template-pipe";
import {VPipeOptions} from "../../pipe/v-pipe-options";

@VInjectable({singleton: true})
export class VInternalCustomPipes {
    private _pipes: VPipeTransform[] = [];

    register(pipes: VPipeTransform[]) {
        this._pipes.push(...pipes);
    }

    toTemplatePipes(): VInternalTemplatePipe[] {
        return this._pipes.map(p => {
            return {
                transform(value: string): string {
                    return p.transform(value);
                },
                name(): string {
                    const options: VPipeOptions = (p as any).vPipeOptions;
                    return options.name;
                },
                accept(segment: string, pipeName: string, _: string): boolean {
                    return segment === pipeName;
                }
            }
        })
    }
}