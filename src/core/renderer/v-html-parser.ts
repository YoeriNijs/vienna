import {VComponentType} from '../router/v-route';
import {VRenderError} from './v-render-error';
import {VRendererUtil} from './v-renderer-util';

export class VHtmlParser {
    private constructor() {
        // Do not instantiate
    }

    public static parse(component: VComponentType, html: string, attributes: NamedNodeMap): string {
        const start = html.indexOf('{{');
        if (start <= 0) {
            return html;
        }
        const end = html.indexOf('}}');
        if (end <= 0) {
            throw new VRenderError('Template parsing error: no closing brackets found');
        }
        const rawVariablePart = html.substring(start + 2, end);
        const templateReference = rawVariablePart.trim();
        if (!templateReference) {
            throw new VRenderError('Template parsing error: unknown variable name');
        }

        // Replace template reference by actual value
        const refWithBrackets = html.substring(start, end + 2);
        const actualValue = VRendererUtil.getValueForTemplateReference(component, templateReference, attributes);
        html = html.replace(refWithBrackets, actualValue);

        return this.parse(component, html, attributes);
    }
}
