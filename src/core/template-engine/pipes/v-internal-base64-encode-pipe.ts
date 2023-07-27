import {VInternalTemplatePipe} from "./v-internal-template-pipe";

export class VInternalBase64EncodePipe implements VInternalTemplatePipe {

    name(): string {
        return "encodeBase64";
    }

    accept(isTemplateRefAvailable: (templateRef: string) => boolean, templateRef: string): boolean {
        return isTemplateRefAvailable(templateRef);
    }

    transform(value: string): string {
        return window.btoa(value);
    }
}