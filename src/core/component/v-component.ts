import {VComponentOptions} from "./v-component-options";

export function VComponent(options: VComponentOptions) {
	function override<T extends new (...arg: any[]) => any>(target: T) {
		return class extends target {
			constructor(...args: any[]){
				super(...args);
				Object.defineProperty(this, 'vComponentOptions', {
					value: JSON.stringify(options),
					configurable: false,
					writable: false
				});
			}
		};
	}
	return override;
}
