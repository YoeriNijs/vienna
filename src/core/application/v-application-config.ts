import {VComponentType} from '../component/v-component-type';
import {Type} from '../injector/v-injector';
import {VRoute} from '../router/v-route';
import {VGlobalStyles} from "./v-global-styles";
import {VApplicationPlugins} from "./v-application-plugins";
import {VPipeTransform} from "../pipe/v-pipe-transform";
import {VI18nConfig} from "./v-i18n-config";
import {VDarkModeOptions} from "./v-dark-mode-options";
import {VRouteStrategy} from "../router/v-route-strategy";

export interface VApplicationConfig {
    declarations: Type<VComponentType>[];
    routes: VRoute[];
    routeNotFoundStrategy?: VRouteStrategy;
    rootElementSelector?: string;
    globalStyles?: VGlobalStyles;
    darkMode?: VDarkModeOptions;
    plugins?: VApplicationPlugins;
    pipes?: Type<VPipeTransform>[];
    i18n?: VI18nConfig;
}
