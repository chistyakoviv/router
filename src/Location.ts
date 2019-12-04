import Route from './Route';

export default class Location {
    private path: string;
    private route?: Route;
    private params?: object;
    private query?: string;
    private hash?: string;

    constructor(path: string, route?: Route, params?: object, query?: string, hash?: string) {
        this.path = path;
        this.route = route;
        this.params = params;
        this.query = query;
        this.hash = hash;
    }

    getPath(): string {
        return this.path;
    }

    getRoute(): Route | null {
        return this.route ? this.route : null;
    }

    getHandler(): Function | null {
        const handler = this.route && this.route.getHandler();
        return handler ? handler : null;
    }

    getParams(): object | null {
        return this.params ? this.params : null;
    }

    getName(): string | null {
        const name = this.route && this.route.getName();
        return name ? name : null;
    }

    getQuery(): string | null {
        return this.query ? this.query : null;
    }

    getHash(): string | null {
        return this.hash ? this.hash : null;
    }
};
