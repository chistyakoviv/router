export default interface EventEmitter {
    on(name: string, callback: Function): void;
    off(name: string, callback: Function): void;
};
