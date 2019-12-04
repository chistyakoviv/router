import Route from './Route';

export default class Location {
    private path: string;
    private route?: Route;
    private params?: object;

    constructor(path: string, route?: Route, params?: object) {
        this.path = path;
        this.route = route;
        this.params = params;
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
};
