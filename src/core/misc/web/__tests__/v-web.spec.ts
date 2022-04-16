import {VWeb} from "../v-web";

describe('VWeb', () => {

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
            const instance = new VWeb();
            expect(instance.slugify(scenario.input, scenario.options)).toEqual(scenario.output);
        });
    });
});
