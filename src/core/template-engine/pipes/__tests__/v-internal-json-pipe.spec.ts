import {VInternalJsonPipe} from "../v-internal-json-pipe";

describe('VInternalJsonPipe', () => {

    const pipe = new VInternalJsonPipe();

    it('should create a json value', () => {
        const html = `<a href="https://www.google.com">Google</a>`;
        const result = pipe.transform(html);
        expect(result).toEqual("\"<a href=\\\"https://www.google.com\\\">Google</a>\"");
    });

    it('should have a valid pipe name', () => {
        expect(pipe.name()).toEqual('json');
    });
});