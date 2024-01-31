import {ViennaStandardRoutes} from "../../src/core/router/v-route-home";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
export const handleRouteNotFound = () => {
    // Just a simple implementation for testing purposes,
    // do not use this in real world scenarios as redirects are unsafe! (YN)
    const search = '?redirectTo=';
    if (window.location.href.includes(search)) {
        const index = window.location.href.indexOf(search);
        const start = index + search.length;
        const end = window.location.href.length;
        console.log(window.location.href.substring(start, end));
        return window.location.href.substring(start, end);
    }

    return ViennaStandardRoutes.HOME;
}