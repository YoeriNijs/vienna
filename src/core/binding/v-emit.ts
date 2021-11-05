export const v_INTERNAL_EMITTER_CALLER_NAME = 'vInternalEmitterCallerName';

export function VEmit(name: string) {
    return (target: any, _: string) => {
        const getter = (): any => name;
        const setter = (): void => {
        };
        const proto = Object.getPrototypeOf(target);
        Object.defineProperty(proto, v_INTERNAL_EMITTER_CALLER_NAME, {
            get: getter,
            set: setter
        });
    }
}
