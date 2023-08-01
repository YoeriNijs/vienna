import {VComponentType} from '../component/v-component-type';
import {Type} from '../injector/v-injector';
import {VRoute} from '../router/v-route';
import {VRouteNotFoundStrategy} from '../router/v-route-not-found-strategy';
import {VRouteNotFoundRedirect} from "../router/v-route-not-found-redirect";
import {VGlobalStyles} from "./v-global-styles";
import {VApplicationPlugins} from "./v-application-plugins";
import {VPipeTransform} from "../pipe/v-pipe-transform";
import {VI18nConfig} from "./v-i18n-config";

export interface VApplicationConfig {
    declarations: Type<VComponentType>[];
    routes: VRoute[];
    routeNotFoundStrategy?: VRouteNotFoundStrategy | VRouteNotFoundRedirect;
    rootElementSelector?: string;
    globalStyles?: VGlobalStyles;
    darkModeEnabled?: () => boolean;
    darkModeClassOverride?: string;
    plugins?: VApplicationPlugins;
    pipes?: Type<VPipeTransform>[];
    i18n?: VI18nConfig;
}
