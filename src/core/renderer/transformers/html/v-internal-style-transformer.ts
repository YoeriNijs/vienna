import {VInternalHtmlTransformer} from "./v-internal-html-transformer";
import {VComponentType} from "../../../component/v-component-type";
import {VComponentOptions} from "../../../component/v-component-options";

export class VInternalStyleTransformer implements VInternalHtmlTransformer {
    transform(html: string, component: VComponentType): string {
        const options: VComponentOptions = JSON.parse(component.vComponentOptions);
        const componentCss = this.createComponentCss(options);
        const bodyCss = `body { padding: 0; margin: 0; }`;
        const style = `<style>${bodyCss}${componentCss}</style>`;
        const cleanedStyle = style.replace(/\s\s+/g, ' '); // To remove redundant whitespaces
        return `${cleanedStyle}${html}`;
    }

    private createComponentCss(options: VComponentOptions): string {
        let styles = '';
        if (options.styles) {
            styles = options.styles.reduce((prev, curr) => prev + curr, styles);
        }
        if (options.style) {
            styles += options.style;
        }
        return styles;
    }
}