import 'reflect-metadata';
import { VComponentType } from '../component/v-component-type';
import {VCanActivateGuard} from "../router/v-can-activate-guard";

export interface Type<T> {
    new(...args: any[]): T;
}

export type GenericClassDecorator<T> = (target: T) => void;

export const VComponentInjector = new class {
    resolve<T>(target: Type<T>): T {
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: any) => VComponentInjector.resolve<any>(token));
        return new target(...injections) as any & T;
    }
}();
