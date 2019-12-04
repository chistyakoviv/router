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
    private location: Location;

    constructor(routes: RouteConfig[], history: HistoryApi = new HTML5History(), resolver: ResolverInterface = new Resolver()) {
        this.history = history;
        this.resolver = resolver;
        this.routes = new RouteCollection(routes);
        this.location = this.ensureLocation();

        this.history.on(HistoryEvents.POPSTATE, this.onLocationChange);
        this.location.apply();
    }

    private onLocationChange: (destination: RawLocation) => void = (destination: RawLocation) => {
        const location = this.ensureLocation(destination);
        this.transitionTo(location);
    }

    private ensureLocation(destination?: RawLocation): Location {
        if (!destination)
            return this.resolve({ path: UrlHelper.getLocation() }) || Location.createDefault();

        return this.resolve(destination) || Location.createDefault();
    }

    private transitionTo(location: Location): void {
        this.location = location;
        this.location.apply();
    }

    private resolve(destination: RawLocation): Location | null {
        if (destination.name) {
            const route = this.routes.find(destination.name);

            if (!route) return null;

            destination.path = this.resolver.resolve(route.getPath(), destination.params);
        }

        if (!destination.path) return null;

        const { path, query, hash } = UrlHelper.parsePath(destination.path);
        const { matchedPath, route, params } = this.routes.match(path);

        return new Location(destination.path, path, route, params, query, hash);
    }

    async push(destination: RawLocation): Promise<any> {
        return new Promise((resolve, reject) => {
            const location = this.resolve(destination);

            if (!location) {
                return reject(new Error('Impossible to push location: incorrect params.'));
            }

            try {
                this.history.push(location.getPath());
                this.transitionTo(location);
                resolve(location);
            } catch (err) {
                reject(err);
            }
        });
    }

    getLocation(): Location {
        return this.location;
    }
};
