import {VRenderError} from './v-render-error';
import {VSanitizer} from './v-sanitizer';
import 'reflect-metadata';
import { VComponentType } from '../component/v-component-type';

export class VRendererUtil {
    private constructor() {
        // Util class
    }

    public static getValueForTemplateReference(component: VComponentType, templateReference: string, attributes: NamedNodeMap) {
        // First, check for binded attributes since they have a higher weight than object keys
        const attributeValue = this.getValueFromAttribute(attributes, component, templateReference);
        if (attributeValue) {
            return attributeValue;
        }

        // If we do not have binded properties, check available object keys
        const objectKey = Object.keys(component).find((key) => templateReference.startsWith(key));
        if (objectKey) {
            return this.getValueFromObject(component, objectKey, templateReference);
        } else {
            throw new VRenderError(`Template parsing error: cannot find value for template reference '${templateReference}'`);
        }
    }

    private static getValueFromAttribute(attributes: NamedNodeMap, component: VComponentType, templateReference: string) {
        const bindedProperty = Array.from(attributes)
            .filter(attr => Object.getPrototypeOf(component)[`vProp:${attr.name}`] === 'binded')
            .find(attr => {
                const name = attr.name.replace('vProp:', '');
                return name === templateReference;
            });
        if (bindedProperty) {
            const value = bindedProperty.value;
            return typeof value === 'string' ? VSanitizer.sanitizeHtml(value) : value;
        } else {
            return undefined;
        }
    }

    private static getValueFromObject(component: VComponentType, key: string, templateReference: string) {
        let value = (component as any)[key];
        if (templateReference.indexOf('.') !== -1 && typeof value === 'object') {
            const prop = templateReference.substring(templateReference.indexOf('.') + 1, templateReference.length);
            prop.split('.').forEach((nestedProp) => value = value[nestedProp]); // To the nested prop we go
        }
        return typeof value === 'string' ? VSanitizer.sanitizeHtml(value) : value;
    }
}
