/**
 * A path to navigate to when a route is not found. Can be configured
 * as strategy on application level. A path should start with '/'.
 */
export interface VRouteNotFoundRedirect {
    path: string;
}