import {VTemplateRenderException} from "../../../../template-engine/v-template-render-exception";
import {VInternalCheck} from "./v-internal-check";

export class VInternalCheckIf implements VInternalCheck {
    accept(element: Element): boolean {
        return element.attributes.getNamedItem('if') !== null;
    }

    transform(document: Document, checkElement: Element, callInternalMethod: Function): Document {
        const condition = checkElement.attributes.getNamedItem('if').value;
        const trueElements = Array.from(checkElement.children).filter(c => c.tagName === 'TRUE');
        const falseElements = Array.from(checkElement.children).filter(c => c.tagName === 'FALSE');
        if (trueElements.length < 1 && falseElements.length < 1) {
            throw new VTemplateRenderException(`Missing true or false for check element. Add true or false or both.`);
        }
        if (trueElements.length > 1 || falseElements.length > 1) {
            throw new VTemplateRenderException(`Found multiple true or false elements. It is only allowed to create one true and one false element.`);
        }

        const trueElement = trueElements[0];
        const falseElement = falseElements[0];
        const showTrueElement = condition.indexOf('(') !== -1 && condition.indexOf(')') !== -1
            ? callInternalMethod(condition)
            : eval(condition);
        if (showTrueElement && trueElement) {
            this.createTrue(falseElement, checkElement, trueElement);
        } else if (!showTrueElement && falseElement) {
            this.createFalse(trueElement, checkElement, falseElement);
        } else {
            this.createNone(trueElement, checkElement, falseElement);
        }
        return document;
    }

    private createTrue(falseElement: Element, checkElement: Element, trueElement: Element) {
        if (falseElement) {
            checkElement.removeChild(falseElement);
        }
        if (trueElement.children.length < 1) {
            throw new VTemplateRenderException(`True element has no inner html elements. Add an inner element.`);
        }
        Array.from(trueElement.children)
            .forEach(c => checkElement.parentElement.insertBefore(c, checkElement));
        trueElement.parentElement.removeChild(trueElement);
        checkElement.parentElement.removeChild(checkElement);
    }

    private createFalse(trueElement: Element, checkElement: Element, falseElement: Element) {
        if (trueElement) {
            checkElement.removeChild(trueElement);
        }
        if (falseElement.children.length < 1) {
            throw new VTemplateRenderException(`False element has no inner html elements. Add an inner element.`);
        }
        Array.from(falseElement.children)
            .forEach(c => checkElement.parentElement.insertBefore(c, checkElement));
        falseElement.parentElement.removeChild(falseElement);
        checkElement.parentElement.removeChild(checkElement);
    }

    private createNone(trueElement: Element, checkElement: Element, falseElement: Element) {
        if (trueElement) {
            checkElement.removeChild(trueElement);
        }
        if (falseElement) {
            checkElement.removeChild(falseElement);
        }
        checkElement.parentElement.removeChild(checkElement);
    }
}