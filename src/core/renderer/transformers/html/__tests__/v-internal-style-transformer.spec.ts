import {VComponentType} from "../../../../component/v-component-type";
import {VComponentOptions} from "../../../../component/v-component-options";
import {VInternalStyleTransformer} from "../v-internal-style-transformer";

const HTML = '<span>text</span>';

describe('VInternalStyleTransformer', () => {

    const createComponentType = (options: VComponentOptions): VComponentType => {
        return { vComponentOptions: JSON.stringify(options) };
    }

    const createOptions = (options: Partial<VComponentOptions>): VComponentOptions => {
        const defaultOptions = { selector: 'selector', html: HTML };
        return { ...defaultOptions, ...options };
    }

    let transformer: VInternalStyleTransformer;

    beforeEach(() => transformer = new VInternalStyleTransformer());

    it('should add one style', () => {
        const options: VComponentOptions = createOptions({ style: 'span { background-color: red; }'});
        const componentType: VComponentType = createComponentType(options);
        const html = transformer.transform(HTML, componentType);
        expect(html).toEqual('<style>body { padding: 0; margin: 0; }span { background-color: red; }</style><span>text</span>');
    });

    it('should add multiple styles', () => {
        const options: VComponentOptions = createOptions({ styles: ['span { background-color: red; }', 'span:hover { background-color: blue; }']});
        const componentType: VComponentType = createComponentType(options);
        const html = transformer.transform(HTML, componentType);
        expect(html).toEqual('<style>body { padding: 0; margin: 0; }span { background-color: red; }span:hover { background-color: blue; }</style><span>text</span>');
    });

    it('should add multiple styles by styles and style', () => {
        const options: VComponentOptions = createOptions({
            styles: ['span { background-color: red; }'],
            style: 'span:hover { background-color: blue; }'
        });
        const componentType: VComponentType = createComponentType(options);
        const html = transformer.transform(HTML, componentType);
        expect(html).toEqual('<style>body { padding: 0; margin: 0; }span { background-color: red; }span:hover { background-color: blue; }</style><span>text</span>');
    });

    it('should render without styles', () => {
        const options: VComponentOptions = createOptions({});
        const componentType: VComponentType = createComponentType(options);
        const html = transformer.transform(HTML, componentType);
        expect(html).toEqual('<style>body { padding: 0; margin: 0; }</style><span>text</span>');
    });
});