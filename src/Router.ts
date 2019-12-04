import RouterInterface from './interfaces/RouterInterface';
import ResolverInterface from './interfaces/ResolverInterface';
import HistoryApi, { HistoryEvents } from './interfaces/HistoryApi';

import Resolver from './Resolver';
import RouteCollection from './RouteCollection';
import RouteConfig from './interfaces/RouteConfig';
import RawLocation from './interfaces/RawLocation';
import Location from './Location';

import HTML5History from './history/HTML5History';
import UrlHelper from './helpers/UrlHelper';

export default class Router implements RouterInterface {
    private history: HistoryApi;
    private resolver: ResolverInterface;
    private routes: RouteCollection;
    private location?: Location;

    constructor(routes: Array<RouteConfig>, history: HistoryApi = new HTML5History()) {
        this.history = history;
        this.resolver = new Resolver();
        this.routes = new RouteCollection(routes);

        this.history.on(HistoryEvents.POPSTATE, this.onLocationChange);
    }

    private onLocationChange: (destination: RawLocation) => void = (destination: RawLocation) => {
        const location = this.resolve(destination);
    }

    private resolve(destination: RawLocation): Location | null {
        if (destination.name) {
            const route = this.routes.find(destination.name);

            if (!route) return null;

            destination.path = this.resolver.resolve(route.getPath(), destination.params);
        }

        if (!destination.path) return null;

        const { path, query, hash } = UrlHelper.parsePath(destination.path);
        const match = this.routes.match(path);
        const route = match ? match.route : undefined;
        const params = match ? match.params : undefined;

        return new Location(path, route, params, query, hash);
    }

    async push(destination: RawLocation): Promise<any> {
        return new Promise((resolve, reject) => {
            const location = this.resolve(destination);

            if (!location) {
                return reject(new Error('Impossible to push location: incorrect params.'));
            }

            try {
                this.history.push(location.getPath());
                this.location = location;
                resolve(location);
            } catch (err) {
                reject(err);
            }
        });
    }
};
