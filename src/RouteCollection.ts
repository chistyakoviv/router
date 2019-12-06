import Route from './Route';
import RouteMatch from './interfaces/RouteMatch';

export default class RouteCollection {
    private routes: Route[] = [];

    constructor(routes: Route[]) {
        this.routes = routes;console.log(routes);
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
