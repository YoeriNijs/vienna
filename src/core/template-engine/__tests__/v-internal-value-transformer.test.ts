import {VInternalValueTransformer} from "../v-internal-value-transformer";
import {VInternalAntiXssPipe} from "../pipes/v-internal-anti-xss-pipe";
import {VInternalRawPipe} from "../pipes/v-internal-raw-pipe";
import {VInternalJsonPipe} from "../pipes/v-internal-json-pipe";
import {VInternalBase64EncodePipe} from "../pipes/v-internal-base64-encode-pipe";
import {VInternalBase64DecodePipe} from "../pipes/v-internal-base64-decode-pipe";

describe('VInternalValueTransformer', () => {

    const transformer: VInternalValueTransformer = new VInternalValueTransformer();

    it('should have valid pipes', () => {
        const pipes = transformer.getInternalPipes();
        expect(pipes).toEqual([
            new VInternalAntiXssPipe(),
            new VInternalRawPipe(),
            new VInternalJsonPipe(),
            new VInternalBase64EncodePipe(),
            new VInternalBase64DecodePipe()
        ]);
    });

    it('should not return the raw value when the raw pipe is missing', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const templateRef = '{{ html }}';
        const result = transformer.transform(html, templateRef);
        expect(result).toEqual(`<p>Some content</p>`);
    });

    it('should not return the raw value when an unsupported pipe is provided', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const templateRef = '{{ html | unsupported }}';
        const result = transformer.transform(html, templateRef);
        expect(result).toEqual(`<p>Some content</p>`);
    });

    it('should return the raw value when the raw pipe is provided after unsupported one', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const templateRef = '{{ html | unsupported | raw }}';
        const result = transformer.transform(html, templateRef);
        expect(result).toEqual(`<p class="custom-css-class">Some content</p>`);
    });

    it('should return the raw value when the raw pipe is provided before unsupported one', () => {
        const html = `<p class="custom-css-class">Some content</p>`;
        const templateRef = '{{ html | raw | unsupported }}';
        const result = transformer.transform(html, templateRef);
        expect(result).toEqual(`<p class="custom-css-class">Some content</p>`);
    });

    it('should chain pipes', () => {
        const customJson = `{ 'first': 1, 'second': 2 }`;
        const templateRef = '{{ customJson | json | encodeBase64 }}';
        const result = transformer.transform(customJson, templateRef);
        expect(result).toEqual(`InsgJ2ZpcnN0JzogMSwgJ3NlY29uZCc6IDIgfSI=`);
    });
});