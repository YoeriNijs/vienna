import {VInternalTemplatePipe} from "./v-internal-template-pipe";

export class VInternalRawPipe implements VInternalTemplatePipe {

    name(): string {
        return "raw";
    }

    accept(isTemplateRefAvailable: (templateRef: string) => boolean, templateRef: string): boolean {
        return isTemplateRefAvailable(templateRef);
    }

    transform(value: string): string {
        return value;
    }
}