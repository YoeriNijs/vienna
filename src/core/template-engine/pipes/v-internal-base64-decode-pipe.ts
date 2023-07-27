import {VInternalTemplatePipe} from "./v-internal-template-pipe";

export class VInternalBase64DecodePipe implements VInternalTemplatePipe {

    name(): string {
        return "decodeBase64";
    }

    accept(isTemplateRefAvailable: (templateRef: string) => boolean, templateRef: string): boolean {
        return isTemplateRefAvailable(templateRef);
    }

    transform(value: string): string {
        return window.atob(value);
    }
}