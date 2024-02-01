import {vComponentFactory} from "../v-component-factory";
import {VTestComponent} from "../v-test-component";
import {VComponent} from "../../../../core";

@VComponent({
    selector: 'app-component',
    styles: [' :host { margin: 0; padding: 0; }'],
    html: `<span>{{ message }}</span><span>Lorem Ipsum</span>`
})
export class AppComponent {
    message = 'Some text'
}

describe('VComponentFactory', () => {

    let component: VTestComponent<AppComponent>;

    beforeAll(() => jest.useFakeTimers());

    afterAll(() => jest.useRealTimers());

    beforeEach(() => {
        const createComponent = vComponentFactory<AppComponent>({
            component: AppComponent
        });
        component = createComponent();
    });

    it('should be able to test styles', () => {
        expect(component.styles).toEqual('body { padding: 0; margin: 0; } :host { margin: 0; padding: 0; }');
    });

    it('should be able to test html', () => {
        expect(component.html).toEqual('<span>Some text</span><span>Lorem Ipsum</span>');
    });

    it('should be able to query', () => {
        expect(component.query('span').innerHTML).toEqual('Some text');
        expect(component.queryAll('span')).toHaveLength(2);
        expect(component.queryAll('span')[1].innerHTML).toEqual('Lorem Ipsum');
    });
})
