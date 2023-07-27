import {VInternalTemplatePipe} from "./v-internal-template-pipe";

export class VInternalJsonPipe implements VInternalTemplatePipe {

    name(): string {
        return "json";
    }

    accept(isTemplateRefAvailable: (templateRef: string) => boolean, templateRef: string): boolean {
        return isTemplateRefAvailable(templateRef);
    }

    transform(value: string): string {
        return JSON.stringify(value);
    }
}