import Route from './Route';
import RouteConfig from './interfaces/RouteConfig';
import RouteMatch from './interfaces/RouteMatch';

export default class RouteCollection {
    private routes: Array<Route> = [];

    constructor(routes: Array<RouteConfig>) {
        for (let i = 0; i < routes.length; i++) {
            this.routes.push(new Route(routes[i].path));
        }
    }

    match(path: string): RouteMatch | null {
        for (let i = 0; i < this.routes.length; i++) {
            const match = this.routes[i].match(path);

            if (match) return match;
        }

        return null;
    }
};
