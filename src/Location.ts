import Route from './Route';

export default class Location {
    private path: string;
    private normalizedPath: string;
    private route?: Route;
    private params?: object;
    private query?: string;
    private hash?: string;
    private parsedQuery?: { [key: string]: string };

    constructor(path: string, normalizedPath: string, route?: Route, params?: object, query?: string, hash?: string) {
        this.path = path;
        this.normalizedPath = normalizedPath;
        this.route = route;
        this.params = params;
        this.query = query;
        this.hash = hash;
    }

    getPath(): string {
        return this.path;
    }

    getNormalizedPath(): string {
        return this.normalizedPath;
    }

    getRoute(): Route | null {
        return this.route ? this.route : null;
    }

    apply(): void {
        const handler = this.route && this.route.getHandler();
        handler && handler(this);
    }

    getParams(): object | null {
        return this.params ? this.params : null;
    }

    getName(): string | null {
        const name = this.route && this.route.getName();
        return name ? name : null;
    }

    getQuery(): object {
        if (this.parsedQuery)
            return this.parsedQuery;

        const query: { [key: string]: string } = {};

        if (this.query) {
            this.query.split('&').forEach(param => {
                const parts = param.split('=');
                query[parts[0]] = parts[1];
            });
        }

        return this.parsedQuery = query;
    }

    getHash(): string | null {
        return this.hash ? this.hash : null;
    }

    static createDefault(): Location {
        return new Location('/', '/');
    }
};
