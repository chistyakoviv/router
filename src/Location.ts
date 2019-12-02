import Route from './Route';

export default class Location {
    private path: string;
    private route: Route;
    private params?: object;

    constructor(path: string, route: Route, params?: object) {
        this.path = path;
        this.route = route;
        this.params = params;
    }

    public getPath(): string {
        return this.path;
    }

    public getRoute(): Route {
        return this.route;
    }

    public getComponent(): Function | undefined {
        return this.route.getComponent();
    }

    public getParams(): object | undefined {
        return this.params;
    }

    public getName(): string | undefined {
        return this.route.getName();
    }
};
