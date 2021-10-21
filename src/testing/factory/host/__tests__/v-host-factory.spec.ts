import {vHostFactory} from "../v-host-factory";
import {VHostComponent} from "../v-host-component";
import {VComponent, VProp} from "../../../../core";

@VComponent({
    selector: 'app-component',
    styles: [' :host { margin: 0; padding: 0; }'],
    html: `<span>{{ message }}</span><span>Some other text</span>`
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

    it('should be able to test component styles', () => {
        expect(host.componentStyles).toEqual('body { padding: 0; margin: 0; } :host { margin: 0; padding: 0; }');
    });

    it('should be able to test component html', () => {
        expect(host.componentHtml).toEqual('<span>Some text</span><span>Some other text</span>');
    });

    it('should be able to test host html', () => {
        expect(host.hostHtml).toEqual('<head><style>body { padding: 0; margin: 0; }</style></head>' +
            '<body><app-component message="Message from host"></app-component></body>');
    });

    it('should be able to query one selector on host', () => {
        expect(host.queryHost('app-component')).toBeDefined();
        expect(host.queryHostAll('app-component')).toHaveLength(1);
    });

    it('should be able to query one selector on component', () => {
        expect(host.queryComponent('span').innerHTML).toEqual('Some text');
        expect(host.queryComponentAll('span')).toHaveLength(2);
    });
})
