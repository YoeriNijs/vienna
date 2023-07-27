import {VInternalRawPipe} from "../v-internal-raw-pipe";

describe('VInternalRawPipe', () => {

    const pipe = new VInternalRawPipe();

    it('should return the value as is with the raw pipe', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const result = pipe.transform(html);
        expect(result).toEqual(`<p class="custom-css-class">Some content</p>`);
    });

    it('should have a valid pipe name', () => {
        expect(pipe.name()).toEqual('raw');
    });
});