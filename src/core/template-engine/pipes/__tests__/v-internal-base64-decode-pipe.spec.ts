import {VInternalBase64DecodePipe} from "../v-internal-base64-decode-pipe";

describe('VInternalBase64DecodePipe', () => {
    const pipe = new VInternalBase64DecodePipe();

    it('should create a json value', () => {
        const result = pipe.transform('SGVsbG8gV29ybGQ=');
        expect(result).toEqual('Hello World');
    });

    it('should have a valid pipe name', () => {
        expect(pipe.name()).toEqual('decodeBase64');
    });
});