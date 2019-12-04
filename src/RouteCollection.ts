import Route from './Route';
import RouteConfig from './interfaces/RouteConfig';
import RouteMatch from './interfaces/RouteMatch';
import UrlHelper from './helpers/UrlHelper';

export default class RouteCollection {
    private routes: Array<Route> = [];

    constructor(routes: Array<RouteConfig>) {
        for (let i = 0; i < routes.length; i++) {
            this.routes.push(new Route(routes[i].path, routes[i].handler, routes[i].name));
        }
    }

    match(path: string): RouteMatch | null {
        for (let i = 0; i < this.routes.length; i++) {
            const match = this.routes[i].match(path);

            if (match) return match;
        }

        return null;
    }

    find(name: string): Route | null {
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].getName() === name)
                return this.routes[i];
        }

        return null;
    }
};
