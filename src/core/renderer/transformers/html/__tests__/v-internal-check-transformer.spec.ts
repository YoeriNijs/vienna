import {VComponent} from "../../../../component/v-component";
import {VInternalCheckTransformer} from "../v-internal-check-transformer";
import {VRenderError} from "../../../v-render-error";

@VComponent({
    selector: 'check-component',
    styles: [],
    html: ''
})
export class CheckTestComponent {
    trueValue(): boolean {
        return true;
    }

    falseValue(): boolean {
        return true;
    }
}

describe('VInternalCheckTransformer', () => {

    const transformer = new VInternalCheckTransformer();
    const component = new CheckTestComponent();
    const transform = (html: string): string => transformer.transform(html, component);

    it('should render only true', () => {
        const html = `
            <v-check if="true">
                <true><span>True rendered</span></true>
            </v-check>
        `;
        const result = transform(html);
        expect(result).toEqual('<span>True rendered</span>');
    });

    it('should render only false', () => {
        const html = `
            <v-check if="false">
                <false><span>False rendered</span></false>
            </v-check>
        `;
        const result = transform(html);
        expect(result).toEqual('<span>False rendered</span>');
    });

    it('should render true and not false when check is true', () => {
        const html = `
            <v-check if="true">
                <true><span>True rendered</span></true>
                <false><span>False rendered</span></false>
            </v-check>
        `;
        const result = transform(html);
        expect(result).toEqual('<span>True rendered</span>');
    });

    it('should render false and not true when check is false', () => {
        const html = `
            <v-check if="false">
                <true><span>True rendered</span></true>
                <false><span>False rendered</span></false>
            </v-check>
        `;
        const result = transform(html);
        expect(result).toEqual('<span>False rendered</span>');
    });

    it('should throw exception when multiple true elements exist', () => {
        const html = `
            <v-check if="true">
                <true><span>True 1 rendered</span></true>
                <true><span>True 2 rendered</span></true>
            </v-check>
        `;
        const render = () => transform(html);
        expect(render).toThrow(new VRenderError(`Found multiple true or false elements. It is only allowed to create one true and one false element.`));
    });

    it('should throw exception when multiple false elements exist', () => {
        const html = `
            <v-check if="false">
                <false><span>False 1 rendered</span></false>
                <false><span>False 2 rendered</span></false>
            </v-check>
        `;
        const render = () => transform(html);
        expect(render).toThrow(new VRenderError(`Found multiple true or false elements. It is only allowed to create one true and one false element.`));
    });

    it('should render nothing when condition is true and only false exist', () => {
        const html = `
            <v-check if="true">
                <false><span>False rendered</span></false>
            </v-check>
        `;
        const result = transform(html);
        expect(result).toEqual('');
    });

    it('should render nothing when condition is false and only true exist', () => {
        const html = `
            <v-check if="false">
                <true><span>True rendered</span></true>
            </v-check>
        `;
        const result = transform(html);
        expect(result).toEqual('');
    });

    it('should throw exception when no true and no false exist', () => {
        const html = `<v-check if="true"></v-check>`;
        const render = () => transform(html);
        expect(render).toThrow(new VRenderError(`Missing true or false for check element. Add true or false or both.`));
    });

    it('should throw exception when if does not exist', () => {
        const html = `<v-check><true><span>True</span></true></v-check>`;
        const render = () => transform(html);
        expect(render).toThrow(new VRenderError(`Invalid check element found: missing required attribute(s).`));
    });

    it('should throw exception when no inner element found for true', () => {
        const html = `<v-check if="true"><true>True</true></v-check>`;
        const render = () => transform(html);
        expect(render).toThrow(new VRenderError(`True element has no inner html elements. Add an inner element.`));
    });

    it('should throw exception when no inner element found for false', () => {
        const html = `<v-check if="false"><false>False</false></v-check>`;
        const render = () => transform(html);
        expect(render).toThrow(new VRenderError(`False element has no inner html elements. Add an inner element.`));
    });

    it('should call method when method is used as if and method returns true', () => {
        const html = `
            <v-check if="trueValue()">
                <true><span>True rendered</span></true>
            </v-check>
        `;
        const result = transform(html);
        expect(result).toEqual('<span>True rendered</span>');
    });

    it('should call method when method is used as if and method returns true', () => {
        const html = `
            <v-check if="falseValue()">
                <true><span>False rendered</span></true>
            </v-check>
        `;
        const result = transform(html);
        expect(result).toEqual('<span>False rendered</span>');
    });
});