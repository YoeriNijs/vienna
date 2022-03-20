import {VInternalHtmlTransformer} from "./v-internal-html-transformer";
import {VComponentType} from "../../../component/v-component-type";
import {VInjector} from "../../../injector/v-injector";
import {VDarkMode} from "../../../style/v-dark-mode";

export class VInternalDarkModeTransformer implements VInternalHtmlTransformer {
    transform(html: string, component: VComponentType): string {
        const componentDarkModeClassOverride = component && component.vComponentOptions
            ? JSON.parse(component.vComponentOptions).darkModeClassOverride
            : undefined;

        const darkModeService = VInjector.resolve<VDarkMode>(VDarkMode);
        const appendDarkMode = (element: Element): void => {
            const darkModeClass = componentDarkModeClassOverride
                ? componentDarkModeClassOverride
                : darkModeService.getDarkModeCssClass();
            if (darkModeService.isDarkModeEnabled() && !element.classList.contains(darkModeClass)) {
                element.classList.add(darkModeClass);
            } else if (!darkModeService.isDarkModeEnabled()) {
                element.classList.remove(darkModeClass);
            }
            if (element.hasChildNodes()) {
                Array.from(element.children).forEach(c => appendDarkMode(c));
            }
        }

        const parser = new DOMParser();
        let document = parser.parseFromString(html, 'text/html');
        appendDarkMode(document.body);

        return document.body.outerHTML;
    }
}