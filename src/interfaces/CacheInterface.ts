export default interface CacheInterface<T> {
    get(key: string, value: Function): T;
    set(key: string, value: T): void;
};
