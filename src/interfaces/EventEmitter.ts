export default interface EventEmitter {
    on(name: string, callback: (...args: any) => void): void;
    off(name: string, callback: (...args: any) => void): void;
}
