import {VInternalHtmlTransformer} from "./v-internal-html-transformer";
import {VComponentType} from "../../../component/v-component-type";
import {VInternalCheckFactory} from "./check/v-internal-check-factory";

export class VInternalCheckTransformer implements VInternalHtmlTransformer {
    transform(html: string, component: VComponentType, attributes: NamedNodeMap): string {
        const parser = new DOMParser();
        let document = parser.parseFromString(html, 'text/html');

        const elements = document.getElementsByTagName('v-check');
        for (let element of elements) {
            new VInternalCheckFactory(element).transform((impl) => {
                document = impl.transform(document, element, this.callInternalMethod(component), component, attributes);
            });
        }

        return document.head.innerHTML + document.body.innerHTML;
    }

    private callInternalMethod(component: VComponentType): Function {
        return (method: string): void => {
            const componentPrototype = Object.getPrototypeOf(component) || {};
            const componentPrototypePrototype = Object.getPrototypeOf(componentPrototype) || {};
            const methods = Object.getOwnPropertyNames(componentPrototypePrototype);
            if (!methods || methods.length < 1) {
                return;
            }

            const args: any[] = [];
            const indexOfLastOpenParenthesis = method.lastIndexOf('(');
            const indexOfLastCloseParenthesis = method.lastIndexOf(')');
            if (indexOfLastOpenParenthesis !== -1 && indexOfLastCloseParenthesis !== -1) {
                // First, we aggregate the actual values
                method.substring(indexOfLastOpenParenthesis + 1, indexOfLastCloseParenthesis)
                    .split(',')
                    .filter(v => v.length > 0)
                    .map(v => v.replace(/["']/g, ""))
                    .forEach((value) => args.push(value));

                // Then, just replace the method without arguments
                method = method.substring(0, indexOfLastOpenParenthesis);
            }

            const caller = () => "{ return " + method + " };"
            const fn = new Function(caller());
            return fn.call(null).call(null, ...args)
        }
    }
}