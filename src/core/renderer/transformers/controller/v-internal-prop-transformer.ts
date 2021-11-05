import {VComponentType} from "../../../component/v-component-type";
import {V_INTERNAL_PROP_PLACEHOLDER, V_INTERNAL_PROP_PREFIX} from "../../../binding/v-prop";
import {VInternalControllerTransformer} from "./v-internal-controller-transformer";

export class VInternalPropTransformer implements VInternalControllerTransformer {
    accept(component: VComponentType, attributes: NamedNodeMap | undefined): boolean {
        return Array.from(attributes)
            .some(attr => {
                const value = Object.getPrototypeOf(component)[`${V_INTERNAL_PROP_PREFIX}${attr.name}`];
                return value === V_INTERNAL_PROP_PLACEHOLDER
            });
    }

    transform(component: VComponentType, attributes: NamedNodeMap | undefined): VComponentType {
        const actual = Array.from(attributes)
            .filter(attr => {
                const value = Object.getPrototypeOf(component)[`${V_INTERNAL_PROP_PREFIX}${attr.name}`];
                return value === V_INTERNAL_PROP_PLACEHOLDER
            })
            .reduce((prevValue, attr) => this.addActualValue(attr, prevValue), {});
        const overrides = Object.keys(actual).reduce((obj: any, key: string) => {
            obj[key] = actual[key];
            return obj;
        }, {});

        return Object.assign(component, overrides);
    }

    private addActualValue(attr: Attr, prevValue: {}) {
        const key = attr.name.replace(V_INTERNAL_PROP_PREFIX, '');
        const value = attr.value;

        let obj: any = {};
        obj[key] = value;

        return {...prevValue, ...obj};
    }
}