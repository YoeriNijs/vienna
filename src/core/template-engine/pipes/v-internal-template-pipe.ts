class VInternalPipeNameException extends Error {
}

export class VInternalDefaultPipeImpl implements VInternalTemplatePipe {

    name(): string {
        throw new VInternalPipeNameException("Pipe name is not implemented!");
    }

    accept(segment: string, pipeName: string, _: string): boolean {
        return segment === pipeName;
    }

    transform(value: string): string {
        return value;
    }
}

export interface VInternalTemplatePipe {
    transform(value: string): string;

    name(): string;

    accept(segment: string, pipeName: string, templateRef: string): boolean;
}