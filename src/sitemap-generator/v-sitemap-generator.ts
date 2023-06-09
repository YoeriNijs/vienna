import {VSitemapGeneratorConfig} from "./v-sitemap-generator-config";

const HEAD = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`

export class VSitemapGenerator {

    /**
     * Returns an xml string that contains a sitemap for the provided config.
     * @param config
     */
    generate(config: VSitemapGeneratorConfig): string | void {
        return this.createXmlByConfig(config);
    }

    /**
     * Writes a file to the provided output for the provided config.
     * Example output: '/my/location/sitemap.xml'
     * @param config
     * @param output
     */
    generateAndWriteToFile(config: VSitemapGeneratorConfig, output: string): void {
        const xml = this.createXmlByConfig(config);
        const fs = require("fs");
        const writeStream = fs.createWriteStream(output);
        writeStream.write(xml);
        writeStream.end();
    }

    private createXmlByConfig(config: VSitemapGeneratorConfig): string {
        if (this.isEmptyConfig(config)) {
            return `${HEAD}</urlset>`;
        }

        let xml = HEAD;
        if (config.routes) {
            xml = config.routes
                .filter(route => !(route.guards && route.guards.length > 0))
                .reduce((x, route) => {
                    // Since this are root Vienna routes, we assume these routes contain important pages,
                    // such as homepage, information pages and so on. Hence, we add the priority 1.0.
                    // See: https://www.v9digital.com/insights/sitemap-xml-why-changefreq-priority-are-important/
                    x += `<url><loc>${route.path}</loc><priority>1.0</priority></url>`;
                    return x;
                }, xml);
        }

        if (config.manual) {
            xml = config.manual.reduce((x, item) => {
                x += '<url>';
                x += `<loc>${item.location}</loc>`;
                if (item.changefreq) {
                    x += `<changefreq>${item.changefreq}</changefreq>`;
                }
                if (item.priority && item.priority >= 0 && item.priority <= 1) {
                    x += `<priority>${item.priority.toFixed(1)}</priority>`;
                }
                x += '</url>';
                return x;
            }, xml);
        }

        return `${xml}</urlset>`;
    }

    private isEmptyConfig(config: VSitemapGeneratorConfig): boolean {
        return (!config.routes || config.routes.length < 1)
            && (!config.manual || config.manual.length < 1);
    }

}