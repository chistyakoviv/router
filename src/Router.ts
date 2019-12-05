import RouterInterface from './interfaces/RouterInterface';
import ResolverInterface from './interfaces/ResolverInterface';
import HistoryApi, { HistoryEvents } from './interfaces/HistoryApi';
import RouteConfig from './interfaces/RouteConfig';
import RawLocation from './interfaces/RawLocation';
import UrlHelper from './helpers/UrlHelper';
import Resolver from './Resolver';
import RouteCollection from './RouteCollection';
import Location from './Location';
import HTML5History from './history/HTML5History';

/*!
 * @author Chistyakov Ilya <ichistyakovv@gmail.com>
 */
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
            return this.resolve({ path: UrlHelper.getPath() }) || Location.createDefault();

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

    match(destination: RawLocation): boolean {
        return !!this.resolve(destination);
    }

    push(destination: RawLocation): void {
        const location = this.resolve(destination);

        if (!location) {
            throw new Error(`Can't push location: Invalid params.`);
        }

        this.history.push(location.getPath());
        this.transitionTo(location);
    }

    replace(destination: RawLocation): void {
        const location = this.resolve(destination);

        if (!location) {
            throw new Error(`Can't replace location: Invalid params.`);
        }

        this.history.replace(location.getPath());
        this.transitionTo(location);
    }

    go(n: number): void {
        this.history.go(n);
    }

    back(): void {
        this.history.back();
    }

    forward(): void {
        this.history.forward();
    }

    getLocation(): Location {
        return this.location;
    }
};
