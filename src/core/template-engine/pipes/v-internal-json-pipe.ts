import {VInternalDefaultPipeImpl} from "./v-internal-template-pipe";

export class VInternalJsonPipe extends VInternalDefaultPipeImpl {

    name(): string {
        return "json";
    }
    
    transform(value: string): string {
        return JSON.stringify(value);
    }
}