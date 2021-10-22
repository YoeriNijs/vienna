export class VInternalInjectableSingletons {

    private static _singletons: any[] = [];

    public static add(singleton: object): void {
        this._singletons.push(singleton);
    }

    public static get<T>(instance: T): T | undefined {
        const instanceProto = Object.getPrototypeOf(instance);
        return this._singletons.find(s => Object.getPrototypeOf(s) === instanceProto);
    }

    public static exists<T>(instance: T): boolean {
        const instanceProto = Object.getPrototypeOf(instance);
        return this._singletons.some(s => Object.getPrototypeOf(s) === instanceProto);
    }
}
