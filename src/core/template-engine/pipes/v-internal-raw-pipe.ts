import {VInternalTemplatePipe} from "./v-internal-template-pipe";
import {filterXSS} from "xss";

const PIPE = '| raw';

export class VInternalRawPipe implements VInternalTemplatePipe {
    transform(value: string, templateReference: string): string {
        if (templateReference.indexOf(PIPE) === -1) {
            return filterXSS(value);
        } else {
            return value;
        }
    }

}