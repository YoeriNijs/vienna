import {VInternalTemplate} from "./v-internal-template";
import {VInternalTemplateEngine} from "./v-internal-template-engine";
import {VTemplateRenderException} from "./v-template-render-exception";

describe('VInternalTemplateEngine', () => {

    const engine = new VInternalTemplateEngine();
    const createTemplate = (template: string): VInternalTemplate => new VInternalTemplate(template);

   it('should render without interpolations', () => {
       const template = createTemplate('Hello, my name is Ernie');
       const result = engine.render(template, {});
       expect(result).toEqual('Hello, my name is Ernie');
   });

    it('should render with interpolation and corresponding data', () => {
        const template = createTemplate('Hello, my name is {{ name }}');
        const result = engine.render(template, { name: 'Bert' });
        expect(result).toEqual('Hello, my name is Bert');
    });

    it('should render with interpolations and corresponding data', () => {
        const template = createTemplate('Hello, my name is {{ name }} and my age is {{ age }}');
        const result = engine.render(template, { name: 'Bert', age: 30 });
        expect(result).toEqual('Hello, my name is Bert and my age is 30');
    });

    it('should render with interpolation and nested object property', () => {
        const template = createTemplate('Hello, my name is {{ nested.name }}');
        const result = engine.render(template, { nested: { name: 'Bert' }});
        expect(result).toEqual('Hello, my name is Bert');
    });

    it('should render object string when interpolation and object data', () => {
        const template = createTemplate('Hello, my name is {{ nested }}');
        const result = engine.render(template, { nested: { name: 'Bert' }});
        expect(result).toEqual('Hello, my name is [object Object]');
    });

    it('should render object string when interpolation and no corresponding data', () => {
        const template = createTemplate('Hello, my name is {{ name }}');
        const result = engine.render(template, { age: 30 });
        expect(result).toEqual('Hello, my name is [object Object]');
    });

    describe('Missing template', () => {
       it.each([undefined, null, ''])('should render when template is %s', (value) =>  {
           const template = createTemplate(value);
           const result = engine.render(template, {});
           expect(result).toEqual('');
       });
    });

    describe('Missing data', () => {
        it.each([{}, undefined])('should throw a render exception when there is a interpolation and data is %s', (data) => {
            const template = createTemplate('Hello, my name is {{ name }}');
            const render = () => engine.render(template, data);
            expect(render).toThrow(new VTemplateRenderException('Cannot find value for template reference \'{{ name }}\''));
        });
    });
});
