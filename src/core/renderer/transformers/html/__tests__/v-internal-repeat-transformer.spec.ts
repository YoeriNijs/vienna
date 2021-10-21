import {VComponent} from "../../../../component/v-component";
import {VInternalRepeatTransformer} from "../v-internal-repeat-transformer";

@VComponent({
    selector: 'app-component',
    styles: [],
    html: ''
})
export class RepeatTestComponent {
    stringArr = ['Aap', 'Noot', 'Mies'];
    numberArr = [3, 2, 1];
    booleanArr = [true, false, true];
}

describe('VInternalRepeatTransformer', () => {

    const transformer = new VInternalRepeatTransformer();
    const component = new RepeatTestComponent();
    const transform = (html: string): string => transformer.transform(html, component);

    describe('Inner array', () => {
        it('should work with numeric value', () => {
            const html = `
            <v-repeat for="{i} of [1, 0, 2]">
                <span>{i}</span>
            </v-repeat>
        `;
            const result = transform(html);
            expect(result).toEqual('<span>1</span><span>0</span><span>2</span>');
        });

        it('should work with strings', () => {
            const html = `
            <v-repeat for="{i} of ['aap', 'noot', 'mies']">
                <span>{i}</span>
            </v-repeat>
        `;
            const result = transform(html);
            expect(result).toEqual('<span>aap</span><span>noot</span><span>mies</span>');
        });

        it('should work with booleans', () => {
            const html = `
            <v-repeat for="{i} of [true, false]">
                <span>{i}</span>
            </v-repeat>
        `;
            const result = transform(html);
            expect(result).toEqual('<span>true</span><span>false</span>');
        });
    });

    describe('template array', () => {
        it('should work with numeric values', () => {
            const html = `
                <v-repeat for="{i} of {{ numberArr }}">
                    <span>{i}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>3</span><span>2</span><span>1</span>');
        });

        it('should work with string values', () => {
            const html = `
                <v-repeat for="{i} of {{ stringArr }}">
                    <span>{i}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>Aap</span><span>Noot</span><span>Mies</span>');
        });

        it('should work with boolean values', () => {
            const html = `
                <v-repeat for="{i} of {{ booleanArr }}">
                    <span>{i}</span>
                </v-repeat>
            `;
            const result = transform(html);
            expect(result).toEqual('<span>true</span><span>false</span><span>true</span>');
        });
    });

})