export class VInternalTemplate {

    private readonly _template: string;

    constructor(template: string) {
        this._template = template ? template : '';
    }

    get(): string {
        return this._template;
    }
}
