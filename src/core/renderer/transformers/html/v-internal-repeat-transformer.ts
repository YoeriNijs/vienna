import {VInternalHtmlTransformer} from "./v-internal-html-transformer";
import {flatten} from "pincet";
import {VComponentType} from "../../../component/v-component-type";
import {getNestedPropertyByStringPath} from "../../../util/v-internal-object-util";
import {VRenderError} from "../../v-render-error";
import {VInternalTemplate} from "../../../template-engine/v-internal-template";
import {VInternalTemplateEngine} from "../../../template-engine/v-internal-template-engine";

const REGEX_REFERENCE_WITHOUT_BRACKETS = /{{|}}/;

export class VInternalRepeatTransformer implements VInternalHtmlTransformer {
    transform(html: string, component: VComponentType): string {
        const parser = new DOMParser();
        let document = parser.parseFromString(html, 'text/html');

        const repeatElements = document.getElementsByTagName('v-repeat');
        for (let repeatElement of repeatElements) {
            const forCondition = repeatElement.attributes.getNamedItem('for');
            if (forCondition === null || forCondition.value.length < 1) {
                repeatElement.parentElement.removeChild(repeatElement);
                continue;
            }
            const forValue = forCondition.value;
            const ofString = ' of ';
            const ofIndex = forValue.indexOf(ofString);
            if (ofIndex === -1) {
                repeatElement.parentElement.removeChild(repeatElement);
                continue;
            }
            const first = forValue.substring(0, ofIndex).trim();
            const second = forValue.substring(ofIndex + ofString.length, forValue.length).trim();
            if (!first || !second) {
                repeatElement.parentElement.removeChild(repeatElement);
                continue;
            }

            if (second.startsWith('[') && second.endsWith(']')) {
                const iterationValues = second
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.appendNewChildren(repeatElement, iterationValues, first);
            } else {
                const templateReference = second.split(REGEX_REFERENCE_WITHOUT_BRACKETS)
                    .filter(v => v)[0]
                    .trim();
                const iterationValues = getNestedPropertyByStringPath(component, templateReference);
                if (!Array.isArray(iterationValues)) {
                    throw new VRenderError('Repeat value is no array!');
                }
                this.appendNewChildren(repeatElement, iterationValues, first);
            }

            Array.from(repeatElement.children).forEach(c => repeatElement.parentElement.append(c));
            repeatElement.parentElement.removeChild(repeatElement);
        }

        return document.head.innerHTML + document.body.innerHTML;
    }

    private appendNewChildren(root: Element, iterationValues: string[], templateRef: string): void {
        const initialChildren = Array.from(root.childNodes);
        const newChildren = iterationValues
            .map(value => typeof value === 'string' ? value.trim() : value)
            .map(value => this.createChildrenWithReplacedTemplateRef(root, templateRef, value));
        const flattenedChildren = flatten<Node>(newChildren, Infinity);
        flattenedChildren
            .filter(c => c.nodeValue !== 'V-REPEAT')
            .forEach(c => root.append(c));

        initialChildren.forEach(c => root.removeChild(c));
    }

    private createChildrenWithReplacedTemplateRef(root: Element, templateRef: string, iterationValue: string) {
        return Array.from(root.childNodes)
            .map(c => c.cloneNode(true))
            .map((c: HTMLElement) => {
                if (typeof iterationValue === 'object') {
                    this.replaceForObject(c, iterationValue);
                } else {
                    this.replaceForString(c, templateRef, iterationValue);
                }
                return c;
            });
    }

    private replaceForString(c: HTMLElement, templateRef: string, iterationValue: any): void {
        Array.from(c.attributes || [])
            .filter(attr => attr && attr.value)
            .forEach(attr => attr.value = attr.value.replace(templateRef, iterationValue));
        c.innerHTML = this.replaceTemplateRefByValue(c.innerHTML, iterationValue);
    }

    private replaceForObject(c: HTMLElement, iterationValue: object): void {
        Array.from(c.attributes || [])
            .filter(attr => attr && attr.value)
            .forEach(attr => attr.value = this.replaceTemplateRefByValue(attr.value, iterationValue));
        c.innerHTML = this.replaceTemplateRefByValue(c.innerHTML, iterationValue);
    }

    private replaceTemplateRefByValue(attr: string, iterationValue: object) {
        const template = new VInternalTemplate(attr);
        return VInternalTemplateEngine.render(template, iterationValue, '{', '}');
    }
}