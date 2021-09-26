export interface VInternalComponentOptions {
	name: string;
}

export function VInternalComponent(options: VInternalComponentOptions) {
	function override<T extends new (...arg: any[]) => any>(target: T) {
		return class extends target {
			constructor(...args: any[]){
				super(...args);
				Object.defineProperty(this, 'vInternalName', {
					value: options.name,
					configurable: false,
					writable: false
				});
			}
		};
	}
	return override;
}

