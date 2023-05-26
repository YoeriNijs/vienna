import {VInternalTemplate} from "../v-internal-template";
import {VInternalTemplateEngine} from "../v-internal-template-engine";
import {VInternalRawPipe} from "../pipes/v-internal-raw-pipe";
import {VInternalJsonPipe} from "../pipes/v-internal-json-pipe";

describe('VInternalTemplateEngine', () => {

    const createTemplate = (template: string): VInternalTemplate => new VInternalTemplate(template);

    it('should render without interpolations', () => {
        const template = createTemplate('Hello, my name is Ernie');
        const result = VInternalTemplateEngine.render(template, {});
        expect(result).toEqual('Hello, my name is Ernie');
    });

    it('should render with interpolation and corresponding data', () => {
        const template = createTemplate('Hello, my name is {{ name }}');
        const result = VInternalTemplateEngine.render(template, {name: 'Bert'});
        expect(result).toEqual('Hello, my name is Bert');
    });

    it.each([
        ['{{', '}}'], ['{', '}'], ['[[', ']]'], ['[', ']'], ['[[', ']'], ['[', ']]'], ['%', '>']
    ])('should render with template prefix \'%s\' and suffix \'%s\'', (prefix, suffix) => {
        const template = createTemplate(`Hello, my name is ${prefix} name ${suffix}`);
        const result = VInternalTemplateEngine.render(template, {name: 'Bert'}, prefix, suffix);
        expect(result).toEqual('Hello, my name is Bert');
    });

    it('should render with interpolations and corresponding data', () => {
        const template = createTemplate('Hello, my name is {{ name }} and my age is {{ age }}');
        const result = VInternalTemplateEngine.render(template, {name: 'Bert', age: 30});
        expect(result).toEqual('Hello, my name is Bert and my age is 30');
    });

    it('should render with interpolation and nested object property', () => {
        const template = createTemplate('Hello, my name is {{ nested.name }}');
        const result = VInternalTemplateEngine.render(template, {nested: {name: 'Bert'}});
        expect(result).toEqual('Hello, my name is Bert');
    });

    it('should not render object string when interpolation and object data', () => {
        const template = createTemplate('Hello, my name is {{ nested }}');
        const result = VInternalTemplateEngine.render(template, {nested: {name: 'Bert'}});
        expect(result).toEqual('Hello, my name is ');
    });

    it('should render object string when interpolation and no corresponding data', () => {
        const template = createTemplate('Hello, my age is {{ age }}');
        const result = VInternalTemplateEngine.render(template, {age: 30});
        expect(result).toEqual('Hello, my age is 30');
    });

    it('should render array data as base64 encoded', () => {
        const template = createTemplate('I have the following coins: {{ coins }}');
        const result = VInternalTemplateEngine.render(template, {
            coins: [
                {name: 'dollar', type: 1},
                {name: 'euro', type: 2}
            ]
        });
        expect(result).toEqual('I have the following coins: W3sibmFtZSI6ImRvbGxhciIsInR5cGUiOjF9LHsibmFtZSI6ImV1cm8iLCJ0eXBlIjoyfV0=');
    });

    describe('Missing template', () => {
        it.each([undefined, null, ''])('should render when template is %s', (value) => {
            const template = createTemplate(value);
            const result = VInternalTemplateEngine.render(template, {});
            expect(result).toEqual('');
        });
    });

    describe('Missing data', () => {
        it.each([{}, undefined])('should return empty string when there is a interpolation and data is %s', (data) => {
            const template = createTemplate('Hello, my name is {{ name }}');
            const result = VInternalTemplateEngine.render(template, data);
            expect(result).toEqual('Hello, my name is ');
        });
    });

    describe('Xss', () => {
        it('should not sanitize the template itself', () => {
            const good = createTemplate('Normal text and <script>alert(\'wanted behaviour\');</script>');
            const result = VInternalTemplateEngine.render(good, {});
            expect(result).toEqual('Normal text and <script>alert(\'wanted behaviour\');</script>');
        });

        it('should sanitize the template against xss attacks', () => {
            const evil = createTemplate('Normal text and {{ script }}');
            const result = VInternalTemplateEngine.render(evil, {script: '<script>alert(\'evil script\');</script>'});
            expect(result).toEqual('Normal text and &lt;script&gt;alert(\'evil script\');&lt;/script&gt;');
        });
    });

    describe('Pipes', () => {
        it('It should have valid pipes', () => {
            const actualPipes = VInternalTemplateEngine.pipes;
            expect(actualPipes).toEqual([
                new VInternalRawPipe(),
                new VInternalJsonPipe()
            ]);
        });
    });
});
