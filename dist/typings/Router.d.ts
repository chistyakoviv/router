import RouterInterface from './interfaces/RouterInterface';
import ResolverInterface from './interfaces/ResolverInterface';
import HistoryApi from './interfaces/HistoryApi';
import RawLocation from './interfaces/RawLocation';
import Route from './Route';
import Location from './Location';
import HTML5History from './history/HTML5History';
export { Route, HTML5History };
/*!
 * @author Chistyakov Ilya <ichistyakovv@gmail.com>
 */
export declare class Router implements RouterInterface {
    private history;
    private resolver;
    private routes;
    private location;
    constructor(routes: Route[], history?: HistoryApi, resolver?: ResolverInterface);
    init(): void;
    private onLocationChange;
    private ensureLocation;
    private transitionTo;
    private resolve;
    match(destination: RawLocation): boolean;
    push(destination: RawLocation): void;
    replace(destination: RawLocation): void;
    go(n: number): void;
    back(): void;
    forward(): void;
    getLocation(): Location;
}
