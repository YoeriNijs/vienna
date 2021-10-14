import {VTemplateRenderException} from "../../../../template-engine/v-template-render-exception";
import {VInternalCheck} from "./v-internal-check";

export class VInternalCheckIf implements VInternalCheck {
    accept(element: Element): boolean {
        return element.attributes.getNamedItem('if') !== null;
    }

    transform(document: Document, checkElement: Element, callInternalMethod: Function): Document {
        const condition = checkElement.attributes.getNamedItem('if').value;
        const trueElement = Array.from(checkElement.children).find(c => c.tagName === 'TRUE');
        const falseElement = Array.from(checkElement.children).find(c => c.tagName === 'FALSE');
        if (!trueElement && !falseElement) {
            throw new VTemplateRenderException(`Missing true or false for check element. Add true or false or both.`);
        }

        const showTrueElement = condition.indexOf('(') !== -1 && condition.indexOf(')') !== -1
            ? callInternalMethod(condition)
            : eval(condition);
        if (showTrueElement && trueElement) {
            this.createTrue(falseElement, checkElement, trueElement);
        } else if (falseElement) {
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
        Array.from(trueElement.children)
            .forEach(c => checkElement.parentElement.insertBefore(c, checkElement));
        trueElement.parentElement.removeChild(trueElement);
        checkElement.parentElement.removeChild(checkElement);
    }

    private createFalse(trueElement: Element, checkElement: Element, falseElement: Element) {
        if (trueElement) {
            checkElement.removeChild(trueElement);
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