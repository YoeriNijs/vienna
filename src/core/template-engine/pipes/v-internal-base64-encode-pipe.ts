import {VInternalDefaultPipeImpl} from "./v-internal-template-pipe";

export class VInternalBase64EncodePipe extends VInternalDefaultPipeImpl {

    name(): string {
        return "encodeBase64";
    }

    transform(value: string): string {
        return window.btoa(value);
    }
}