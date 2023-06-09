import {VRoute} from "../core";
import {VSitemapManualItem} from "./v-sitemap-manual-item";

export interface VSitemapGeneratorConfig {
    routes?: VRoute[];
    manual?: VSitemapManualItem[]
}