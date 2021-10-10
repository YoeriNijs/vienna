import {GenericClassDecorator, Type} from './v-component-injector';

/**
 * Service decorator for dependency injection.
 */
export const VInjectable = (): GenericClassDecorator<Type<any>> => () => {
};
