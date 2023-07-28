import {VInternalRenderer} from '../renderer/v-internal-renderer';
import {VRoute, VRouteDocTags} from '../router/v-route';
import {VApplicationConfig} from './v-application-config';
import {Type, VInjector} from '../injector/v-injector';
import {VRenderError} from "../renderer/v-render-error";
import {VComponentType} from '../component/v-component-type';
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VInternalApplicationSelectors} from "./v-internal-application-selectors";
import {VInternalRouter} from "../router/v-internal-router";
import {VDarkMode} from "../style/v-dark-mode";
import {VActivatedRoute} from "../router/v-activated-route";
import {VInternalLogSender} from "../logger/v-internal-log-sender";
import {VWeb, VWebDocTags} from "../misc/web";
import {getCurrentDocTags} from "../util/v-internal-document-util";
import {VInternalCustomPipes} from "../template-engine/pipes/v-internal-custom-pipes";
import {VPipe} from "./v-pipe";
import {VDuplicatePipeException} from "./v-duplicate-pipe-exception";

import * as pincet from 'pincet';

export function VApplication(config: VApplicationConfig) {
    function override<T extends new(...arg: any[]) => any>(target: T) {
        class InternalVApplication {
            private readonly _mainRenderer: VInternalRenderer;
            private readonly _declarationTypes: Type<VComponentType>[];
            private readonly _routes: VRoute[];
            private readonly _initialTags: VWebDocTags;

            constructor(private _eventBus: VInternalEventbus,
                        private _activatedRoute: VActivatedRoute,
                        private _darkModeService: VDarkMode,
                        private _web: VWeb,
                        private _pipes: VInternalCustomPipes) {
                this._mainRenderer = new VInternalRenderer({
                    selector: VInternalApplicationSelectors.V_APP_RENDERER,
                    eventBus: this._eventBus,
                    rootElementSelector: config.rootElementSelector,
                    globalStyles: config.globalStyles
                });
                this._declarationTypes = config.declarations;
                this._routes = config.routes;
                this._initialTags = getCurrentDocTags();

                this._eventBus.subscribe<VRoute>(VInternalEventName.NAVIGATED, (route: VRoute) => {
                    this.renderComponentForRoute(route);
                    this._eventBus.publish(VInternalEventName.NAVIGATION_ENDED, route);
                });

                this.initializePipes();
                this.initializePlugins();
                this.initializeDarkMode();
                this.initializeActivatedRoute();
                this.initializeRouter();
            }

            private initializeActivatedRoute(): void {
                this._activatedRoute.initialize(this._routes);
            }

            private async initializeRouter() {
                const router = new VInternalRouter({
                    eventBus: this._eventBus,
                    routes: this._routes,
                    routeNotFoundStrategy: config.routeNotFoundStrategy
                });
                await router.start();
            }

            private renderComponentForRoute(route: VRoute): void {
                const rootNode = this._declarationTypes.find(declaration => declaration === route.component);
                if (rootNode) {
                    this._mainRenderer.renderAllFromRootNode(rootNode, this._declarationTypes);
                    this._eventBus.unsubscribe(VInternalEventName.REBUILD);
                    this._eventBus.subscribe(VInternalEventName.REBUILD, () => {
                        this._mainRenderer.renderAllFromRootNode(rootNode, this._declarationTypes)
                    });
                    this.updateDocumentTags(route);
                } else {
                    throw new VRenderError(`Cannot find declaration for path '${route.path}'. Declare a class for this path in your Vienna application configuration.`);
                }
            }

            private updateDocumentTags(route: VRoute): void {
                if (route.docTags) {
                    this._web.overrideTags(route.docTags);
                } else {
                    const parentDocTags = this.findParentWithDocTags(route);
                    this._web.overrideTags(parentDocTags || this._initialTags);
                }
            }

            private findParentWithDocTags(route: VRoute): VRouteDocTags | undefined {
                const parent = this._routes.find(r => r.children && r.children.some(c => c === route));
                if (parent && parent.docTags) {
                    return parent.docTags;
                } else if (parent) {
                    return this.findParentWithDocTags(parent);
                } else {
                    return undefined; // No parent with tags found
                }
            }

            private initializeDarkMode(): void {
                const isDarkModeEnabledInConfig = config.darkModeEnabled ? config.darkModeEnabled() : false;
                if (isDarkModeEnabledInConfig) {
                    this._darkModeService.enableDarkMode();
                } else {
                    this._darkModeService.disableDarkMode();
                }

                const darkModeClassOverride = config.darkModeClassOverride;
                if (darkModeClassOverride) {
                    this._darkModeService.overrideGlobalDarkModeClass(darkModeClassOverride);
                }
            }

            private initializePipes(): void {
                if (config.pipes) {
                    const pipes = config.pipes.map<VPipe>(pipeType => VInjector.resolve(pipeType));
                    const pipeNames = pipes.map(p => p.name());
                    const uniquePipeNames = pincet.unique<string>(pipeNames);
                    if (uniquePipeNames.length === pipes.length) {
                        this._pipes.register(pipes);
                    } else {
                        const pipeNames = pipes.map(p => p.name()).toString();
                        throw new VDuplicatePipeException(`Duplicate pipe names found: ${pipeNames}. Vienna only accepts unique pipe names!`);
                    }
                }
            }

            private initializePlugins(): void {
                if (config.plugins) {
                    const logger = config.plugins.logger;
                    if (logger) {
                        const logSender = VInjector.resolve<VInternalLogSender>(VInternalLogSender);
                        logSender.registerSettings({process: logger.process});
                    }
                }
            }
        }

        return class extends target {
            constructor(...args: any[]) {
                super(...args);

                const eventBus = VInjector.resolve<VInternalEventbus>(VInternalEventbus);
                const activatedRoute = VInjector.resolve<VActivatedRoute>(VActivatedRoute);
                const darkMode = VInjector.resolve<VDarkMode>(VDarkMode);
                const web = VInjector.resolve<VWeb>(VWeb);
                const pipes = VInjector.resolve<VInternalCustomPipes>(VInternalCustomPipes);
                new InternalVApplication(eventBus, activatedRoute, darkMode, web, pipes);
            }
        };
    }

    return override;
}
