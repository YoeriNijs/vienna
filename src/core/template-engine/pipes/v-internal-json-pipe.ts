import {VInternalTemplatePipe} from "./v-internal-template-pipe";

const PIPE = '| json';

export class VInternalJsonPipe implements VInternalTemplatePipe {
    transform(value: string, templateReference: string): string {
        if (templateReference.indexOf(PIPE) === -1) {
            return value;
        } else {
            return JSON.stringify(value);
        }
    }

}