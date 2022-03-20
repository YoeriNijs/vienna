import {VComponent} from "../../../../component/v-component";
import {VInternalDarkModeTransformer} from "../v-internal-dark-mode-transformer";
import {VInjector} from "../../../../injector/v-injector";
import {VDarkMode} from "../../../../style/v-dark-mode";
import {VComponentType} from "../../../../component/v-component-type";

const HTML = `<div class='wrapper'><span>Nested span</span></div>`;

@VComponent({
    selector: 'dark-mode-component',
    html: HTML,
    styles: [],
    darkModeClassOverride: 'custom-dark-mode-class'
})
class CustomDarkModeComponent {}

@VComponent({
    selector: 'dark-mode-component',
    html: HTML,
    styles: []
})
class DefaultDarkModeComponent {}

describe('VInternalDarkModeTransformer', () => {

    let transformer: VInternalDarkModeTransformer;
    let darkModeService: VDarkMode;

    beforeEach(() => {
        transformer = new VInternalDarkModeTransformer();
        darkModeService = VInjector.resolve<VDarkMode>(VDarkMode);
    });

    describe('Dark mode override', () => {
        it('should apply override if dark mode is enabled', () => {
            darkModeService.enableDarkMode();
            const component = VInjector.resolve<VComponentType>(CustomDarkModeComponent, {singleton: false});
            const result = transformer.transform(HTML, component);
            expect(result).toEqual(`<body class="custom-dark-mode-class"><div class="wrapper custom-dark-mode-class"><span class="custom-dark-mode-class">Nested span</span></div></body>`);
        });

        it('should not apply override if dark mode is disabled', () => {
            darkModeService.disableDarkMode();
            const component = VInjector.resolve<VComponentType>(CustomDarkModeComponent, {singleton: false});
            const result = transformer.transform(HTML, component);
            expect(result).toEqual(`<body><div class="wrapper"><span>Nested span</span></div></body>`);
        });
    });

    describe('Without dark mode override', () => {
        it('should apply override if dark mode is enabled', () => {
            darkModeService.enableDarkMode();
            const component = VInjector.resolve<VComponentType>(DefaultDarkModeComponent, {singleton: false});
            const result = transformer.transform(HTML, component);
            expect(result).toEqual(`<body class="v-dark"><div class="wrapper v-dark"><span class="v-dark">Nested span</span></div></body>`);
        });

        it('should not apply override if dark mode is disabled', () => {
            darkModeService.disableDarkMode();
            const component = VInjector.resolve<VComponentType>(DefaultDarkModeComponent, {singleton: false});
            const result = transformer.transform(HTML, component);
            expect(result).toEqual(`<body><div class="wrapper"><span>Nested span</span></div></body>`);
        });
    });
});