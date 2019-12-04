import Route from './Route';
import RouteConfig from './interfaces/RouteConfig';
import RouteMatch from './interfaces/RouteMatch';

export default class RouteCollection {
    private routes: Route[] = [];

    constructor(routes: RouteConfig[]) {
        for (let i = 0; i < routes.length; i++) {
            this.routes.push(new Route(routes[i].path, routes[i].handler, routes[i].name));
        }
    }

    match(path: string): RouteMatch {
        for (let i = 0; i < this.routes.length; i++) {
            const match = this.routes[i].match(path);

            if (match) return match;
        }

        return {};
    }

    find(name: string): Route | null {
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].getName() === name)
                return this.routes[i];
        }

        return null;
    }
};
