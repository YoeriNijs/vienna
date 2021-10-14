export const V_INTERNAL_PROP_PREFIX = 'vProp:';

export function Prop() {
    return (target: any, propertyKey: string) => {
        const getter = (): any => 'binded';
        const setter = (): void => {
        };
        Object.defineProperty(target, `${V_INTERNAL_PROP_PREFIX}${propertyKey}`, {
            get: getter,
            set: setter
        });
    }
}
