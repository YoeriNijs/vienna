import {VInternalSwitchTransformer} from "../v-internal-switch-transformer";
import {VRenderError} from "../../../v-render-error";

describe('VInternalSwitchTransformer', () => {

    const transformer = new VInternalSwitchTransformer();
    const transform = (html: string): string => transformer.transform(html);

    it('should render value', () => {
        const html = `
            <v-switch condition="Ernie">
                <v-case if="Bert">Bert</v-case>
                <v-case if="Ernie">Ernie</v-case>
                <v-case-default>Unknown</v-case-default>
            </v-switch>
        `;
        const result = transform(html);
        expect(result).toEqual('Ernie');
    });

    it('should render default value', () => {
        const html = `
            <v-switch condition="Big bird">
                <v-case if="Bert">Bert</v-case>
                <v-case if="Ernie">Ernie</v-case>
                <v-case-default>Unknown</v-case-default>
            </v-switch>
        `;
        const result = transform(html);
        expect(result).toEqual('Unknown');
    });

    it('should render nested value', () => {
        const html = `
            <v-switch condition="OuterA">
                <v-case if="OuterA">
                    <v-switch condition="Inner B">
                        <v-case if="Inner A">Outer A - Inner A</v-case>
                        <v-case if="Inner B">Outer A - Inner B</v-case>
                    </v-switch>
                </v-case>
                <v-case if="OuterB">Outer B</v-case>
                <v-case-default>Unknown</v-case-default>
            </v-switch>
        `;
        const result = transform(html);
        expect(result).toEqual('Outer A - Inner B');
    });

    it('should throw an exception when there is no valid value', () => {
        const html = `
            <v-switch condition="Valid">
                <v-case if="Invalid">Invalid</v-case>
            </v-switch>
        `;
        const render = () => transform(html);
        expect(render).toThrow(new VRenderError(`No matched case and no default case found!`));
    });

    it('should not throw an exception when there is a default case', () => {
        const html = `
            <v-switch condition="Invalid">
                <v-case-default>Valid</v-case-default>
            </v-switch>
        `;
        const result = transform(html);
        expect(result).toEqual('Valid');
    });
});