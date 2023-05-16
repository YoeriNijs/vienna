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

@VComponent({
    selector: 'switch-check-component',
    styles: [],
    html: `
        <v-switch condition="{{ condition }}">
            <v-case-default>
                <v-check if="{{ anotherCondition }}">
                    <true><span>True</span></true>
                </v-check>
            </v-case-default>
        </v-switch>
    `
})
export class SwitchCheckComponent {
    condition = true;
    anotherCondition = true;
}

@VComponent({
    selector: 'repeat-check-component',
    styles: [],
    html: `
        <v-repeat let="{{ i }}" for="{{ items }}">>
            <v-check if="isTwo({{ i }})">
                <true><span>True: {{ i }}</span></true>
                <false><span>False: {{ stringOutsideRepeat }}</span></false>
            </v-check>
        </v-repeat>
    `
})
export class RepeatCheckComponent {
    items = [1, 2, 3];
    condition = true;
    stringOutsideRepeat = 'other';

    isTwo(value: string): boolean {
        return value === '2';
    }
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

    it('should render check inside switch', () => {
        const createComponent = vComponentFactory<SwitchCheckComponent>({
            component: SwitchCheckComponent
        });
        const component: VTestComponent<SwitchCheckComponent> = createComponent();
        expect(component.html.trim()).toEqual('<span>True</span>');
    });

    it('should render check inside repeat', () => {
        const createComponent = vComponentFactory<RepeatCheckComponent>({
            component: RepeatCheckComponent
        });
        const component: VTestComponent<RepeatCheckComponent> = createComponent();
        expect(component.html.trim()).toEqual('<span>False: other</span><span>True: 2</span><span>False: other</span>');
    });
});