import {GenericClassDecorator, Type} from './v-injector';

export interface VInjectableOptions {
    singleton?: boolean;
}

export const V_INTERNAL_INJECTABLE_OPTIONS_KEY = 'vInternalInjectableOptions';

/**
 * Service decorator for dependency injection.
 */
export const VInjectable = (options: VInjectableOptions = { singleton: true }): GenericClassDecorator<Type<any>> => (target: Type<any>) => {
    const getter = (): VInjectableOptions => options;
    const setter = (): void => {};
    Object.defineProperty(target, V_INTERNAL_INJECTABLE_OPTIONS_KEY, {
        get: getter,
        set: setter
    });
};
