export interface VInternalTemplatePipe {
    transform(value: string): string;

    name(): string;

    accept(isTemplateRefAvailable: (templateRef: string) => boolean, templateRef: string): boolean;
}