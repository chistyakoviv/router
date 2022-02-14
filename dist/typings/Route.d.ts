import RouteMatch from './interfaces/RouteMatch';
import { Params } from './helpers/DecoratorHelper';
export default class Route {
    private path;
    private matcher;
    private name?;
    private handler?;
    private static wrappedRoutes;
    constructor(path: string, handler?: Function, name?: string);
    match(path: string): RouteMatch | null;
    getPath(): string;
    getName(): string | null;
    setName(name: string): void;
    getHandler(): Function | null;
    static create(path: string, handler?: Function, name?: string): void;
    static group(params: Params, fn: Function): void;
    static build(): Route[];
}
