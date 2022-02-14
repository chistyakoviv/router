import Route from './Route';
import RouteMatch from './interfaces/RouteMatch';
export default class RouteCollection {
    private routes;
    constructor(routes: Route[]);
    match(path: string): RouteMatch;
    find(name: string): Route | null;
}
