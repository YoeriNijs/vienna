import {VSitemapChangefreq} from "./v-sitemap-changefreq";

export interface VSitemapManualItem {
    location: string;
    changefreq?: VSitemapChangefreq;
    priority?: number;
}