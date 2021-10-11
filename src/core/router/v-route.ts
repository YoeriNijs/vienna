export type VComponentType = {
    vInit?: () => void;
    vDestroy?: () => void;
    vComponentOptions?: string;
}

export interface VRoute {
    path: string;
    component: object;
}
