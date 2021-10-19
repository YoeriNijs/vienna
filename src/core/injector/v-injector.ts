import 'reflect-metadata';
import {V_INTERNAL_INJECTABLE_OPTIONS_KEY, VInjectableOptions} from "./v-injectable-decorator";
import {VInternalSingletons} from "./v-internal-singletons";

export interface Type<T> {
    new(...args: any[]): T;
}

export type GenericClassDecorator<T> = (target: T) => void;

export const VInjector = new class {
    resolve<T>(target: Type<T>): T {

        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: any) => VInjector.resolve<any>(token));
        const instance = new target(...injections) as any & T;

        const injectableOptionsField = Object.getOwnPropertyDescriptors(target)[V_INTERNAL_INJECTABLE_OPTIONS_KEY];
        if (!injectableOptionsField) {
            return instance;
        }

        const injectableOptions: VInjectableOptions = injectableOptionsField.get();
        if (injectableOptions.singleton) {
            if (VInternalSingletons.exists(instance)) {
                return VInternalSingletons.get(instance);
            } else {
                VInternalSingletons.add(instance);
                return instance;
            }
        }
    }
}();
