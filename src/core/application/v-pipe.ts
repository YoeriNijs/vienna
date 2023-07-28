export interface VPipe {
    transform(value: string): string;

    name(): string;
}