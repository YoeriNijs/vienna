export enum VInternalEventName {
    EMIT = 'emit',
    NAVIGATED = 'navigation',
    RENDERING_STARTED = 'rendering-started',
    RENDERING_FINISHED = 'rendering-finished',
    REBUILD = 'rebuild-full-app',
    REBUILD_CHECK = 'rebuild-check',
    REBUILD_PARTIALLY = 'rebuild-partially',
    REVOKE_PROXIES = 'revoke-proxies',
    ROUTE_DATA = 'route-data',
    ROUTE_PARAMS = 'route-params'
}