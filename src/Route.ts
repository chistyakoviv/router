import { match } from 'path-to-regexp';
import RouteMatch from './interfaces/RouteMatch';
import DecoratorHelper, { Params } from './helpers/DecoratorHelper';
import PathHelper from './helpers/PathHelper';

export default class Route {
    private path: string;
    private matcher: (...args: any) => any;
    private name?: string;
    private handler?: (...args: any) => void;
    private static wrappedRoutes: Route[] = [];

    constructor(path: string, handler?: (...args: any) => void, name?: string) {
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

    getHandler(): ((...args: any) => void) | null {
        return this.handler ? this.handler : null;
    }

    static create(
        path: string,
        handler?: (...args: any) => void,
        name?: string,
    ): Route {
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

        const route = new Route(path, handler, name);

        Route.wrappedRoutes.push(route);

        return route;
    }

    static group(params: Params, fn: (...args: any) => void): void {
        DecoratorHelper.wrap(params, fn);
    }

    static build(): Route[] {
        const routes = Route.wrappedRoutes.slice();
        Route.wrappedRoutes = [];
        return routes;
    }
}
