import {VComponent} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VComponent({
    selector: 'app-about',
    styles: [],
    html: 'Vienna is just a small tiny framework to speed up development :) <a href="#/about/more">More</a>'
})
export class AboutComponent {
}
