import RouterInterface from './interfaces/RouterInterface';
import Matcher from './Matcher';
import MatcherInterface from './interfaces/MatcherInterface';
import RouteCollection from './RouteCollection';
import RouteConfig from './interfaces/RouteConfig';
import Ajax from './Ajax';

export default class Router implements RouterInterface {
    private matcher: MatcherInterface;
    private routes: RouteCollection;

    constructor(routes: Array<RouteConfig>, matcher: MatcherInterface = new Matcher()) {
        this.matcher = matcher;
        this.routes = new RouteCollection(routes);
    }

    public match(path: string): string {
        return this.matcher.match(path);
    }

    async to(path: string): Promise<any> {
        const location = this.routes.match(path);

        if (!location) return Promise.reject(new Error('No route matched.'));

        return await Ajax.get(location.getPath())
                        .then(data => {
                            return {data, location};
                        });
    }
};
