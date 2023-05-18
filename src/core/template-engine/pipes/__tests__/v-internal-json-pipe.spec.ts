import {VInternalJsonPipe} from "../v-internal-json-pipe";

describe('VInternalJsonPipe', () => {

    const pipe = new VInternalJsonPipe();

    it('should create a json value when pipe is provided', () => {
        const html = `<a href="https://www.google.com">Google</a>`;
        const templateRef = '{{ html | json }}';
        const result = pipe.transform(html, templateRef);
        expect(result).toEqual("\"<a href=\\\"https://www.google.com\\\">Google</a>\"");
    });

    it('should not create a json value when pipe is not provided', () => {
        const html = `<a href="https://www.google.com">Google</a>`;
        const templateRef = '{{ html }}';
        const result = pipe.transform(html, templateRef);
        expect(result).toEqual(`<a href="https://www.google.com">Google</a>`);
    });
});