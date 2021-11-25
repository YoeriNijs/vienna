export interface VInternalRevocableProxy<T> {
    proxy: T;
    revoke: () => void;
}