import {VInternalDefaultPipeImpl} from "./v-internal-template-pipe";

export class VInternalBase64DecodePipe extends VInternalDefaultPipeImpl {

    name(): string {
        return "decodeBase64";
    }

    transform(value: string): string {
        return window.atob(value);
    }
}