import {VInternalHtmlTransformer} from "./v-internal-html-transformer";
import {flatten} from "pincet";
import {VComponentType} from "../../../component/v-component-type";
import {getNestedPropertyByStringPath} from "../../../util/v-internal-object-util";
import {VRenderError} from "../../v-render-error";
import {VInternalTemplate} from "../../../template-engine/v-internal-template";
import {VInternalTemplateEngine} from "../../../template-engine/v-internal-template-engine";

const REGEX_REFERENCE_WITHOUT_BRACKETS = /{{|}}/;

interface RepeatElementWithChildNodes {
    element: Element;
    childNodes: Node[];
}

export class VInternalRepeatTransformer implements VInternalHtmlTransformer {
    transform(html: string, component: VComponentType): string {
        const parser = new DOMParser();
        let document = parser.parseFromString(html, 'text/html');

        const repeatElementWithChildNodes: RepeatElementWithChildNodes[] = [];
        const repeatElements = document.getElementsByTagName('v-repeat');
        for (let repeatElement of repeatElements) {
            const letValue = this.extractLetValueFromElement(repeatElement);
            const forValue = this.extractForValueFromElement(repeatElement);
            if (forValue.startsWith('[') && forValue.endsWith(']')) {
                const iterationValues = forValue
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.appendNewChildren(repeatElement, iterationValues, letValue);
            } else {
                const templateReference = forValue.split(REGEX_REFERENCE_WITHOUT_BRACKETS)
                    .filter(v => v)[0]
                    .trim();
                const iterationValues = getNestedPropertyByStringPath(component, templateReference);
                if (!Array.isArray(iterationValues)) {
                    throw new VRenderError('Repeat value is no array!');
                }
                this.appendNewChildren(repeatElement, iterationValues, letValue);
            }

            const repeatChildNodes: Node[] = Array.from(repeatElement.children).map(c => c.cloneNode(true));
            repeatElementWithChildNodes.push({element: repeatElement, childNodes: repeatChildNodes});
        }

        repeatElementWithChildNodes.forEach(e => e.element.replaceWith(...e.childNodes));

        return document.head.innerHTML.trim() + document.body.innerHTML.trim();
    }

    private extractForValueFromElement(repeatElement: Element): string {
        const forAttribute = repeatElement.attributes.getNamedItem('for');
        if (forAttribute === null) {
            throw new VRenderError(`Invalid repeat element. Add for attribute.`)
        }
        const forValue = forAttribute.value;
        if (forValue.trim().length < 1) {
            throw new VRenderError(`Invalid for attribute '${forValue}': undefined value.`);
        }
        return forValue;
    }

    private extractLetValueFromElement(repeatElement: Element): string {
        const letAttribute = repeatElement.attributes.getNamedItem('let');
        if (letAttribute === null) {
            throw new VRenderError(`Invalid repeat element. Add let attribute.`)
        }
        const letValue = letAttribute.value;
        if (letValue.length < 1 || !letValue.startsWith('{{') || !letValue.endsWith('}}')) {
            throw new VRenderError(`Invalid let attribute '${letValue}': should start with {{ and end with }}.`);
        }
        const variableName = letValue.replace('{{', '').replace('}}', '');
        if (variableName.trim().length < 1) {
            throw new VRenderError(`Invalid let attribute '${letValue}': undefined template reference.`);
        }
        return letValue;
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
            .forEach(attr => attr.value = attr.value.replace(templateRef, iterationValue).trim());
        c.innerHTML = this.replaceTemplateRefByValue(c.innerHTML, iterationValue);
    }

    private replaceForObject(c: HTMLElement, iterationValue: object): void {
        Array.from(c.attributes || [])
            .filter(attr => attr && attr.value)
            .forEach(attr => attr.value = this.replaceTemplateRefByValue(attr.value, iterationValue).trim());
        c.innerHTML = this.replaceTemplateRefByValue(c.innerHTML, iterationValue);
    }

    private replaceTemplateRefByValue(attr: string, iterationValue: any) {
        if (typeof iterationValue === 'string') {
            iterationValue = iterationValue.replace(/['"]+/g, '');
        }
        const template = new VInternalTemplate(attr);
        return VInternalTemplateEngine.render(template, iterationValue);
    }
}