import {VInternalRawPipe} from "../v-internal-raw-pipe";

describe('VInternalRawPipe', () => {

    const pipe = new VInternalRawPipe();

    it('should return the value as is with the raw pipe', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const templateRef = '{{ html | raw }}';
        const result = pipe.transform(html, templateRef);
        expect(result).toEqual(`<p class="custom-css-class">Some content</p>`);
    });

    it('should not return the raw value when the raw pipe is missing', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const templateRef = '{{ html }}';
        const result = pipe.transform(html, templateRef);
        expect(result).toEqual(`<p>Some content</p>`);
    });

    it('should not return the raw value when an unsupported pipe is provided', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const templateRef = '{{ html | unsupported }}';
        const result = pipe.transform(html, templateRef);
        expect(result).toEqual(`<p>Some content</p>`);
    });

    it('should return the raw value when the raw pipe is provided after unsupported one', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const templateRef = '{{ html | unsupported | raw }}';
        const result = pipe.transform(html, templateRef);
        expect(result).toEqual(`<p class="custom-css-class">Some content</p>`);
    });

    it('should return the raw value when the raw pipe is provided before unsupported one', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const templateRef = '{{ html | raw | unsupported }}';
        const result = pipe.transform(html, templateRef);
        expect(result).toEqual(`<p class="custom-css-class">Some content</p>`);
    });
});