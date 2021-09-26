export enum VRouterEvents {
	NAVIGATED = 'v-router-navigated'
}

export interface VRouterEvent<T> {
	detail?: T
}

export type VRouterNavigatedEvent<T> = CustomEvent & VRouterEvent<T>;
