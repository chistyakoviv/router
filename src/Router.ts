import RouterInterface from './interfaces/RouterInterface';
import HistoryApi from './interfaces/HistoryApi';

import RouteCollection from './RouteCollection';
import RouteConfig from './interfaces/RouteConfig';
import Location from './Location';

import HTML5History from './history/HTML5History';

export default class Router implements RouterInterface {
    private history: HistoryApi;
    private routes: RouteCollection;

    constructor(routes: Array<RouteConfig>, history: HistoryApi = new HTML5History()) {
        this.history = history;
        this.routes = new RouteCollection(routes);

        this.init();
    }

    private init(): void {

    }

    async push(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const match = this.routes.match(path);
            const routePath = match ? match.path : path;
            const route = match ? match.route : undefined;
            const params = match ? match.params : undefined;
            const location = new Location(routePath, route, params);

            try {
                this.history.push(location);
                resolve(location);
            } catch (err) {
                reject(err);
            }
        });
    }
};
