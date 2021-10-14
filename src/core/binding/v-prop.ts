export const V_INTERNAL_PROP_PREFIX = 'vProp:';
export const V_INTERNAL_PROP_PLACEHOLDER = 'binded';

export function VProp() {
    return (target: any, propertyKey: string) => {
        const getter = (): any => V_INTERNAL_PROP_PLACEHOLDER;
        const setter = (): void => {
        };
        Object.defineProperty(target, `${V_INTERNAL_PROP_PREFIX}${propertyKey}`, {
            get: getter,
            set: setter
        });
    }
}
