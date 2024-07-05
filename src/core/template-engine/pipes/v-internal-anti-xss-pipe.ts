import {VInternalDefaultPipeImpl} from "./v-internal-template-pipe";
import {filterXSS} from "xss";

export class VInternalAntiXssPipe extends VInternalDefaultPipeImpl {

    name(): string {
        return "safe";
    }

    transform(value: string): string {
        return filterXSS(value);
    }

    accept(_a: string, _b: string, templateRef: string): boolean {
        return templateRef.indexOf(this.name()) === -1;
    }
}