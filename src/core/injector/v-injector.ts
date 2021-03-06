import 'reflect-metadata';
import {V_INTERNAL_INJECTABLE_OPTIONS_KEY, VInjectableOptions} from "./v-injectable-decorator";
import {VInternalInjectableSingletons} from "./v-internal-injectable-singletons";

export interface Type<T> {
    new(...args: any[]): T;
}

export type GenericClassDecorator<T> = (target: T) => void;

export const VInjector = new class {
    resolve<T>(target: Type<T>, overrideOptions?: Partial<VInjectableOptions>): T {
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: any) => VInjector.resolve<any>(token));
        const instance = new target(...injections) as any & T;

        const injectableOptionsField = Object.getOwnPropertyDescriptors(target)[V_INTERNAL_INJECTABLE_OPTIONS_KEY];
        if (!injectableOptionsField) {
            return instance;
        }

        const injectableOptions: VInjectableOptions = injectableOptionsField.get();
        if (overrideOptions && overrideOptions.singleton || !overrideOptions && injectableOptions.singleton) {
            if (VInternalInjectableSingletons.exists(instance)) {
                return VInternalInjectableSingletons.get(instance);
            } else {
                VInternalInjectableSingletons.add(instance);
                return instance;
            }
        } else {
            return instance;
        }
    }
}();
