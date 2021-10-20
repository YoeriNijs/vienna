import {vHostFactory} from "../v-host-factory";
import {VHostComponent} from "../v-host-component";
import {VComponent, VProp} from "../../../../core";

@VComponent({
    selector: 'app-component',
    styles: [' :host { margin: 0; padding: 0; }'],
    html: `<span>{{ message }}</span>`
})
export class AppComponent {
    @VProp() message = 'Some text'
}

describe('VHostFactory', () => {

    let host: VHostComponent;

    beforeEach(() => {
        const createComponent = vHostFactory<AppComponent>({
            component: AppComponent,
            hostHtml: `<app-component message='Message from host'></app-component>`
        });
        host = createComponent();
    });

    it('should have valid styles', () => {
        expect(host.componentStyles).toEqual('body { padding: 0; margin: 0; } :host { margin: 0; padding: 0; }');
    });

    it('should have valid text', () => {
        host.detectChanges();
        expect(host.componentHtml).toEqual('<span>Some text</span>');
    });
})
