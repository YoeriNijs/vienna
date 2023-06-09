import {VSitemapGenerator} from "../v-sitemap-generator";
import {VSitemapGeneratorConfig} from "../v-sitemap-generator-config";

describe('VSitemapGenerator', () => {

    let generator: VSitemapGenerator;

    beforeEach(() => generator = new VSitemapGenerator());

    describe('Empty', () => {
        it('should generate nothing when config is empty', () => {
            const xml = generator.generate({});
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"></urlset>');
        });

        it('should generate nothing when there are no Vienna routes provided', () => {
            const xml = generator.generate({routes: []});
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"></urlset>');
        });

        it('should generate nothing when there are no manual items provided', () => {
            const xml = generator.generate({manual: []});
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"></urlset>');
        });
    });


    describe('Vienna route', () => {
        it('should generate with priority 1.0', () => {
            const config: VSitemapGeneratorConfig = {
                routes: [
                    {path: '/a', component: {}}
                ]
            }
            const xml = generator.generate(config);
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"><url><loc>/a</loc><priority>1.0</priority></url></urlset>');
        });

        it('should not generate it when the route has a guard', () => {
            const config: VSitemapGeneratorConfig = {
                routes: [
                    {path: '/a', component: {}, guards: [jest.fn()]}
                ]
            }
            const xml = generator.generate(config);
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"></urlset>');
        });
    });

    describe('Manual', () => {
        it('should generate', () => {
            const config: VSitemapGeneratorConfig = {
                manual: [
                    {location: '/b'}
                ]
            }
            const xml = generator.generate(config);
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"><url><loc>/b</loc></url></urlset>');
        });

        it('should add changefreq', () => {
            const config: VSitemapGeneratorConfig = {
                manual: [
                    {location: '/b', changefreq: 'always'}
                ]
            }
            const xml = generator.generate(config);
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"><url><loc>/b</loc><changefreq>always</changefreq></url></urlset>');
        });

        it('should add priority', () => {
            const config: VSitemapGeneratorConfig = {
                manual: [
                    {location: '/b', priority: 0.5}
                ]
            }
            const xml = generator.generate(config);
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"><url><loc>/b</loc><priority>0.5</priority></url></urlset>');
        });

        it.each([-0.1, 1.1, -10, 10, null, undefined])('should not add priority when value is %s', (priority) => {
            const config: VSitemapGeneratorConfig = {
                manual: [
                    {location: '/b', priority}
                ]
            }
            const xml = generator.generate(config);
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"><url><loc>/b</loc></url></urlset>');
        });
    });


});