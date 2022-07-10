import {VComponent} from "../../component/v-component";
import {vComponentFactory, VTestComponent} from "../../../testing";

@VComponent({
    selector: 'check-component',
    styles: [],
    html: `<v-check if="isTrue()">
            <true><span>{{ trueValue }}</span></true>
            <false><span>{{ undefinedValue }}</span></false>
        </v-check>`
})
export class CheckComponent {

    trueValue = "True";
    undefinedValue: string = undefined;

    isTrue(): boolean {
        return true;
    }
}

@VComponent({
    selector: 'switch-component',
    styles: [],
    html: `<v-switch condition="{{ myCondition }}">
    <v-case if="someCondition"><span>True</span></v-case>
    <v-case-default><span>False</span></v-case-default>
</v-switch>`
})
export class SwitchComponent {
    myCondition = 'someCondition';
}

describe('VInternalRenderer', () => {

    it('should render true value while false is undefined', () => {
        const createComponent = vComponentFactory<CheckComponent>({
            component: CheckComponent
        });
        const component: VTestComponent<CheckComponent> = createComponent();
        expect(component.html).toEqual('<span>True</span>');
    });

    it('should render case with template ref', () => {
        const createComponent = vComponentFactory<SwitchComponent>({
            component: SwitchComponent
        });
        const component: VTestComponent<SwitchComponent> = createComponent();
        expect(component.html).toEqual('<span>True</span>');
    });
});