import Route from './Route';
import RouteConfig from './interfaces/RouteConfig';
import Location from './Location';

export default class RouteCollection {
    private routes: Array<Route> = [];

    constructor(routes: Array<RouteConfig>) {
        for (let i = 0; i < routes.length; i++) {
            this.routes.push(new Route(routes[i].path));
        }
    }

    public match(path: string): Location | null {
        for (let i = 0; i < this.routes.length; i++) {
            const location = this.routes[i].match(path);

            if (location) return location;
        }

        return null;
    }
};
