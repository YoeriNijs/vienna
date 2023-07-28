import {VInternalDefaultPipeImpl} from "./v-internal-template-pipe";

export class VInternalRawPipe extends VInternalDefaultPipeImpl {

    name(): string {
        return "raw";
    }

    transform(value: string): string {
        return value;
    }
}