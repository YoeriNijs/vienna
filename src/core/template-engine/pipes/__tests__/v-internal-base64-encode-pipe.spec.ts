import {VInternalBase64EncodePipe} from "../v-internal-base64-encode-pipe";

describe('VInternalBase64EncodePipe', () => {
    const pipe = new VInternalBase64EncodePipe();

    it('should create a json value', () => {
        const result = pipe.transform('Hello World');
        expect(result).toEqual('SGVsbG8gV29ybGQ=');
    });

    it('should have a valid pipe name', () => {
        expect(pipe.name()).toEqual('encodeBase64');
    });
});