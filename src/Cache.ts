import CacheInterface from "./interfaces/CacheInterface";

export default class Cache<T> implements CacheInterface<T> {
    private items: {
        [key: string]: T
    } = {};

    get(key: string, value: Function): T {
        if (this.items[key])
            return this.items[key];

        this.set(key, value());

        return this.items[key];
    }

    set(key: string, value: T): void {
        this.items[key] = value;
    }
};
