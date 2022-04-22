export type VComponentType = {
    vInit?: () => void;
    vAfterInit?: () => void;
    vDestroy?: () => void;
    vComponentOptions?: string;
    [name: string]: any;
}
