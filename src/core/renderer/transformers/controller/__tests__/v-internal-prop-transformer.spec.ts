import {vComponentFactory, VTestComponent} from "../../../../../testing";
import {VComponent} from "../../../../component/v-component";
import {VInternalPropTransformer} from "../v-internal-prop-transformer";

@VComponent({
    selector: 'my-component',
    styles: [],
    html: ``
})
class MyComponent {
    custom: any = undefined;
}

describe('VInternalPropTransformer', () => {

    const transformer: VInternalPropTransformer = new VInternalPropTransformer();

    beforeAll(() => {
        window.customElements.define('html-element', HTMLElement);
        jest.useFakeTimers()
    });

    afterAll(() => jest.useRealTimers());

    const createAttribute = (attributeName: string, attributeValue: string = null): NamedNodeMap => {
        const element = new HTMLElement();
        const attribute = document.createAttribute(attributeName);
        attribute.value = attributeValue;
        element.setAttributeNode(attribute);
        return element.attributes;
    }

    const createComponent = (attributeName: string, attributeValue: string): VTestComponent<MyComponent> => {
        const createComponent = vComponentFactory<MyComponent>({
            component: MyComponent
        });
        const component = createComponent();
        Object.getPrototypeOf(component)[attributeName] = attributeValue;
        return component;
    }

    describe('#accept', () => {
        it('should return true when there is a valid attribute name and valid attribute value', () => {
            const component = createComponent("vProp:customattributename", "binded");
            const attributes = createAttribute("customAttributeName");
            const isAccepted = transformer.accept(component, attributes);
            expect(isAccepted).toBe(true);
        });

        it('should return false when there is an invalid attribute name and valid attribute value', () => {
            const component = createComponent("vProp:attributename", "binded");
            const attributes = createAttribute("anotherAttributeName");
            const isAccepted = transformer.accept(component, attributes);
            expect(isAccepted).toBe(false);
        });

        it('should return true when there is a valid attribute name and invalid attribute value', () => {
            const component = createComponent("vProp:customattributename", "invalid");
            const attributes = createAttribute("customAttributeName");
            const isAccepted = transformer.accept(component, attributes);
            expect(isAccepted).toBe(false);
        });
    });

    describe("#transform", () => {
        it('should return the binded value when attribute exists', () => {
            const component = createComponent("vProp:custom", "binded");
            const attributes = createAttribute("custom", "bindedValue");
            const transformedComponent = transformer.transform(component, attributes);
            expect(transformedComponent["custom"]).toEqual("bindedValue")
        });

        it('should not return the binded value when attribute does not exist', () => {
            const component = createComponent("vProp:custom1", "binded");
            const attributes = createAttribute("custom1", "bindedValue");
            const transformedComponent = transformer.transform(component, attributes);
            expect(transformedComponent["custom2"]).toBeUndefined();
        });

        it('should not return the binded value when attribute value is not binded', () => {
            const component = createComponent("vProp:custom1", "something else");
            const attributes = createAttribute("custom1", "bindedValue");
            const transformedComponent = transformer.transform(component, attributes);
            expect(transformedComponent["custom2"]).toBeUndefined();
        });

        it('should return an array when the value is a base64 encoded array', () => {
            const data = window.btoa('[1, 2, 3]');
            const component = createComponent("vProp:custom", "binded");
            const attributes = createAttribute("custom", data);
            const transformedComponent = transformer.transform(component, attributes);
            expect(transformedComponent["custom"]).toEqual([1, 2, 3]);
        });

        it('should return an object when the value is a base64 encoded object', () => {
            const object = {
                field1: "value1",
                field2: [1, 2, 3]
            };
            const data = window.btoa(JSON.stringify(object));
            const component = createComponent("vProp:custom", "binded");
            const attributes = createAttribute("custom", data);
            const transformedComponent = transformer.transform(component, attributes);
            expect(transformedComponent["custom"]).toEqual({"field1": "value1", "field2": [1, 2, 3]});
        });
    });
});