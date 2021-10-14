import {VInternalControllerTransformer} from "./v-internal-controller-transformer";
import {VComponentType} from "../../../component/v-component-type";
import {V_INTERNAL_PROP_PREFIX} from "../../../binding/prop";

export class VInternalAttributeTransformer implements VInternalControllerTransformer {
    transform(component: VComponentType, attributes: NamedNodeMap | undefined): VComponentType {
        const inputs = Array.from(attributes)
            .filter(attr => Object.getPrototypeOf(component)[`${V_INTERNAL_PROP_PREFIX}${attr.name}`] === 'binded')
            .reduce((prevValue, attr) => this.add(attr, prevValue), {});
        const updated = Object.keys(inputs).reduce((obj: any, key: string) => {
            obj[key] = inputs[key];
            return obj;
        }, {});

        return Object.assign(component, updated);
    }

    private add(attr: Attr, prevValue: {}) {
        const key = attr.name.replace(V_INTERNAL_PROP_PREFIX, '');
        const value = attr.value;

        let obj: any = {};
        obj[key] = value;

        return {...prevValue, ...obj};
    }
}