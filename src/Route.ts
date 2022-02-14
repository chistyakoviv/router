import { match } from 'path-to-regexp';
import RouteMatch from './interfaces/RouteMatch';
import DecoratorHelper, { Params } from './helpers/DecoratorHelper';
import PathHelper from './helpers/PathHelper';

export default class Route {
    private path: string;
    private matcher: Function;
    private name?: string;
    private handler?: Function;
    private static wrappedRoutes: Route[] = [];

    constructor(path: string, handler?: Function, name?: string) {
        this.path = path;
        this.name = name;
        this.handler = handler;
        this.matcher = match(this.path, { decode: decodeURIComponent });
    }

    match(path: string): RouteMatch | null {
        const matched = this.matcher(path);

        if (!matched) return null;

        return {
            matchedPath: matched.path,
            route: this,
            params: matched.params,
        };
    }

    getPath(): string {
        return this.path;
    }

    getName(): string | null {
        return this.name ? this.name : null;
    }

    setName(name: string): void {
        this.name = name;
    }

    getHandler(): Function | null {
        return this.handler ? this.handler : null;
    }

    static create(path: string, handler?: Function, name?: string): void {
        const params: Params = DecoratorHelper.getParams();

        if (params.as) {
            name = params.as + name;
        }

        if (params.path) {
            path = PathHelper.join(params.path, path);
        }

        if (params.middlewares.length > 0) {
            handler = DecoratorHelper.applyMiddleware(
                handler,
                params.middlewares,
            );
        }

        Route.wrappedRoutes.push(new Route(path, handler, name));
    }

    static group(params: Params, fn: Function): void {
        DecoratorHelper.wrap(params, fn);
    }

    static build(): Route[] {
        const routes = Route.wrappedRoutes;
        Route.wrappedRoutes = [];
        return routes;
    }
}
