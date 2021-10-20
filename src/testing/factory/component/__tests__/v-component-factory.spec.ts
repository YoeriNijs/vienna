import {vComponentFactory} from "../v-component-factory";
import {VTestComponent} from "../v-test-component";
import {VComponent} from "../../../../core";

@VComponent({
    selector: 'app-component',
    styles: [' :host { margin: 0; padding: 0; }'],
    html: `<span>{{ message }}</span>`
})
export class AppComponent {
    message = 'Some text'
}

describe('VComponentFactory', () => {

    let component: VTestComponent<AppComponent>;

    beforeEach(() => {
        const createComponent = vComponentFactory<AppComponent>({
            component: AppComponent,
        });
        component = createComponent();
    });

    it('should have valid styles', () => {
        expect(component.styles).toEqual('body { padding: 0; margin: 0; } :host { margin: 0; padding: 0; }');
    });

    it('should have valid text', () => {
        expect(component.html).toEqual('<span>Some text</span>');
    });
})
