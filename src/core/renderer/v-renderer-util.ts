import {VComponentType} from '../router/v-route';
import {VRenderError} from './v-render-error';
import {VSanitizer} from './v-sanitizer';

export class VRendererUtil {
    private constructor() {
        // Util class
    }

    public static getObjectValueForTemplateReference(component: unknown & VComponentType, templateReference: string) {
        const key = Object.keys(component).find((key) => templateReference.startsWith(key));
        if (!key) {
            throw new VRenderError(`Template parsing error: cannot find value for template reference '${templateReference}'`);
        }

        // Find actual value for reference
        let value = (component as any)[key];
        if (templateReference.indexOf('.') !== -1 && typeof value === 'object') {
            const prop = templateReference.substring(templateReference.indexOf('.') + 1, templateReference.length);
            prop.split('.').forEach((nestedProp) => value = value[nestedProp]); // To the nested prop we go
        }

        return typeof value === 'string' ? VSanitizer.sanitizeHtml(value) : value;
    }
}
