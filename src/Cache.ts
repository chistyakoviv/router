export default class Cache<T> {
    private items: {
        [key: string]: T;
    } = {};

    public get(key: string, value?: () => T): T {
        if (this.items[key]) return this.items[key];

        if (value) this.set(key, value());

        return this.items[key];
    }

    public set(key: string, value: T): void {
        this.items[key] = value;
    }
}
