export type VComponentType = {
    vInit?: () => void;
    vDestroy?: () => void;
    vComponentOptions?: string;
    [name: string]: any;
}
