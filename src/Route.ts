import { match } from 'path-to-regexp';
import Location from './Location';

export default class Route {
    private path: string;
    private matcher: Function;
    private name?: string;
    private component?: Function;
    private beforeRequest?: Function;
    private afterRequest?: Function;

    constructor(path: string) {
        this.path = path;
        this.matcher = match(this.path, { decode: decodeURIComponent });
    }

    public match(path: string): Location | null {
        const matched = this.matcher(path);

        if (!matched) return null;

        return new Location(matched.path, this, matched.params);
    }

    public getName(): string | undefined {
        return this.name;
    }

    public getComponent(): Function | undefined {
        return this.component;
    }

    public getBeforeRequest(): Function | undefined {
        return this.beforeRequest;
    }

    public getAfterRequest(): Function | undefined {
        return this.afterRequest;
    }
};
