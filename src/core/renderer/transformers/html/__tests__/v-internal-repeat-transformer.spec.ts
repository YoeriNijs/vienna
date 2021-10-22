import {VComponent} from "../../../../component/v-component";
import {VInternalRepeatTransformer} from "../v-internal-repeat-transformer";
import {VRenderError} from "../../../v-render-error";

@VComponent({
    selector: 'app-component',
    styles: [],
    html: ''
})
export class RepeatTestComponent {
    stringArr = ['Aap', 'Noot', 'Mies'];
    numberArr = [3, 2, 1];
    booleanArr = [true, false, true];
    objectArr = [{name: 'Bert', age: 30}, {name: 'Ernie', age: 60}];
    noArr = 'no array';
}

describe('VInternalRepeatTransformer', () => {

    const transformer = new VInternalRepeatTransformer();
    const component = new RepeatTestComponent();
    const transform = (html: string): string => transformer.transform(html, component);

    describe('Let attribute', () => {
        it.each([
            null, undefined, '', ' ', '{ i }', '{i}', '{{i}', '{i}}', '{{ i }', '{ i }}'
        ])('should throw invalid let value error when value is \'%s\'', (value) => {
            const html = `
                <v-repeat let="${value}" for="[1, 0, 2]">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const render = () => transform(html);
            expect(render).toThrow(new VRenderError(`Invalid let attribute '${value}': should start with {{ and end with }}.`));
        });

        it.each([
            '{{}}', '{{ }}', '{{  }}', '{{   }}'
        ])('should throw undefined template reference error when let value is \'%s\'', (value) => {
            const html = `
                <v-repeat let="${value}" for="[1, 0, 2]">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const render = () => transform(html);
            expect(render).toThrow(new VRenderError(`Invalid let attribute '${value}': undefined template reference.`));
        });
    });

    describe('For attribute', () => {
        it.each(['', ' '])('should throw invalid repeat value error when value is \'%s\'', (value) => {
            const html = `
                <v-repeat let="{{ i }}" for="${value}">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const render = () => transform(html);
            expect(render).toThrow(new VRenderError(`Invalid for attribute '${value}': undefined value.`));
        });

        it.each([
            null, undefined, '{{ noArr }}'
        ])('should throw invalid repeat error when value is \'%s\'', (value) => {
            const html = `
                <v-repeat let="{{ i }}" for="${value}">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const render = () => transform(html);
            expect(render).toThrow(new VRenderError(`Repeat value is no array!`));
        });
    });

    describe('Inner array', () => {
        it('should work with numeric value', () => {
            const html = `
                <v-repeat let="{{ i }}" for="[1, 0, 2]">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>1</span><span>0</span><span>2</span>');
        });

        it('should work with strings', () => {
            const html = `
                <v-repeat let="{{ i }}" for="['aap', 'noot', 'mies']">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>aap</span><span>noot</span><span>mies</span>');
        });

        it('should work with booleans', () => {
            const html = `
                <v-repeat let="{{ i }}" for="[true, false]">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>true</span><span>false</span>');
        });
    });

    describe('template array', () => {
        it('should work with numeric values', () => {
            const html = `
                <v-repeat let="{{ i }}" for="{{ numberArr }}">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>3</span><span>2</span><span>1</span>');
        });

        it('should work with string values', () => {
            const html = `
                <v-repeat let="{{ i }}" for="{{ stringArr }}">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>Aap</span><span>Noot</span><span>Mies</span>');
        });

        it('should work with boolean values', () => {
            const html = `
                <v-repeat let="{{ i }}" for="{{ booleanArr }}">
                    <span>{{ i }}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>true</span><span>false</span><span>true</span>');
        });

        it('should work with nested object values', () => {
            const html = `
                <v-repeat let="{{ i }}" for="{{ objectArr }}">
                    <span>{{ i.name }}</span>
                    <span>{{ i.age }}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>Bert</span><span>30</span><span>Ernie</span><span>60</span>');
        });
    });

})