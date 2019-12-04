import { match } from 'path-to-regexp';
import RouteMatch from './interfaces/RouteMatch';

export default class Route {
    private path: string;
    private matcher: Function;
    private name?: string;
    private handler?: Function;

    constructor(path: string, handler?: Function, name?: string) {
        this.path = path;
        this.name = name;
        this.handler = handler;
        this.matcher = match(this.path, { decode: decodeURIComponent });
    }

    match(path: string): RouteMatch | null {
        const matched = this.matcher(path);

        if (!matched) return null;

        return { path: matched.path, route: this, params: matched.params };
    }

    getName(): string | null {
        return this.name ? this.name : null;
    }

    getHandler(): Function | null {
        return this.handler ? this.handler : null;
    }
};
