import {VInternalTemplatePipe} from "./v-internal-template-pipe";
import {filterXSS} from "xss";

export class VInternalAntiXssPipe implements VInternalTemplatePipe {

    name(): string {
        return "raw";
    }

    accept(isTemplateRefAvailable: (templateRef: string) => boolean, templateRef: string): boolean {
        return !isTemplateRefAvailable(templateRef); // If there is no raw pipe, we should check for xss attacks
    }

    transform(value: string): string {
        return filterXSS(value);
    }
}