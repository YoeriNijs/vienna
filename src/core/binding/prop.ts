export function Prop() {
    return (target: any, propertyKey: string) => {
        const getter = (): any => 'binded';
        const setter = (): void => {};
        Object.defineProperty(target, `vProp:${propertyKey}`, {
            get: getter,
            set: setter
        });
    }
}
