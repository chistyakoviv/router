export default class Cache<T> {
    private items;
    get(key: string, value: Function): T;
    set(key: string, value: T): void;
}
