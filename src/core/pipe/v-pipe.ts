import {VPipeOptions} from "./v-pipe-options";

export function VPipe(options: VPipeOptions) {
    function override<T extends new(...arg: any[]) => any>(target: T) {
        return class extends target {
            constructor(...args: any[]) {
                super(...args);
                Object.defineProperty(this, 'vPipeOptions', {
                    value: options,
                    configurable: false,
                    writable: false
                });
            }
        };
    }

    return override;
}