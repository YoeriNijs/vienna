import {VWeb} from "../v-web";

const createMetaElement = (name: string, content: string): HTMLMetaElement => {
    const element = document.createElement('meta');
    element.name = name;
    element.content = content;
    return element;
}

describe('VWeb', () => {

    let instance: VWeb;

    beforeEach(() => instance = new VWeb());

    describe('slugify', () => {
        it.each([
            {input: 'some string', output: 'some-string'},
            {input: ' foo bar baz ', output: 'foo-bar-baz'},
            {input: '-foo bar baz-', output: 'foo-bar-baz'},
            {input: ' foo bar baz ', output: '-foo-bar-baz-', options: {trim: false}},
            {
                input: '€ = euro, £ = pound, ₨ = rupee, ¥ = yen, 元 = yuan, ฿ = baht, $ = dollar, ₿ = bitcoin, ₽ = ruble',
                output: '-euro-pound-rupee-yen-yuan-baht-dollar-bitcoin-ruble'
            },
            {input: 'FOO BAR BAZ', output: 'foo-bar-baz'},
            {input: 'FOO BAR BAZ', output: 'foo-bar-baz', options: {toLowerCase: true}},
            {input: 'Foo BaR BAZ', output: 'Foo-BaR-BAZ', options: {toLowerCase: false}},
            {input: `foo <script>alert('bar')</script> baz`, output: 'foo-scriptalertbarscript-baz'},
            {input: undefined, output: ''},
            {input: null, output: ''},
            {input: '', output: ''},
            {input: ' ', output: ''},
            {input: ' ', output: '-', options: { trim: false }}
        ])(`should create a slug for '%s'`, scenario => {
            expect(instance.slugify(scenario.input, scenario.options)).toEqual(scenario.output);
        });
    });

    describe('Document tags', () => {
       beforeEach(() => {
           document.title = 'My document title';
           document.head.appendChild(createMetaElement('author', 'Lucky Luke'));
       });

       afterEach(() => {
           document.title = '';
           const children = Array.from(document.head.children);
           children.forEach(c => document.head.removeChild(c));
       })

       it('should override only the title tag', () => {
           instance.overrideTags({ title: 'My new title' });
           expect(document.title).toEqual('My new title');
           expect(document.head.children).toHaveLength(2);
           const [title, tag] = document.head.children;
           expect(title.tagName).toEqual('TITLE');
           expect(title.textContent).toEqual('My new title');
           expect(tag).toEqual(createMetaElement('author', 'Lucky Luke'));
       });

       it('should override only the meta tag', () => {
           instance.overrideTags({ meta: [ { name: 'some meta name', content: 'some meta content'} ] });
           expect(document.title).toEqual('My document title');
           expect(document.head.children).toHaveLength(2);
           const [title, tag] = document.head.children;
           expect(title.tagName).toEqual('TITLE');
           expect(title.textContent).toEqual('My document title');
           expect(tag).toEqual(createMetaElement('some meta name', 'some meta content'));
       });

       it('should override none when empty', () => {
           instance.overrideTags({});
           expect(document.title).toEqual('My document title');
           expect(document.head.children).toHaveLength(2);
           const [title, tag] = document.head.children;
           expect(title.tagName).toEqual('TITLE');
           expect(title.textContent).toEqual('My document title');
           expect(tag).toEqual(createMetaElement('author', 'Lucky Luke'));
       });

        it('should override none when undefined', () => {
            instance.overrideTags(undefined);
            expect(document.title).toEqual('My document title');
            expect(document.head.children).toHaveLength(2);
            const [title, tag] = document.head.children;
            expect(title.tagName).toEqual('TITLE');
            expect(title.textContent).toEqual('My document title');
            expect(tag).toEqual(createMetaElement('author', 'Lucky Luke'));
        });

    });
});
