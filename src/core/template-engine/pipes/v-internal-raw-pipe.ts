import {VInternalTemplatePipe} from "./v-internal-template-pipe";
import {filterXSS} from "xss";

const PIPE = '|';

export class VInternalRawPipe implements VInternalTemplatePipe {
    transform(value: string, templateReference: string): string {
        const rawPipe = `${PIPE} raw`;
        if (templateReference.indexOf(rawPipe) !== -1) {
            return value;
        } else {
            return filterXSS(value);
        }
    }

}